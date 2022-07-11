const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const express = require('express')
const fs = require('fs')
const sigUtil = require('@metamask/eth-sig-util')
const csurf = require('csurf')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const Token = require('./token')
const ERC20 = require('./abi/erc20.json')
const ERC721 = require('./abi/erc721.json')
const OWNABLE = require('./abi/ownable.json')
const app = express()
const csrf = csurf({
  cookie: {
    httpOnly: true,
    signed: true
  }
})
const csrfProtection = (req, res, next) => {
  csrf(req, res, function (err) {
    if (err) {
      res.status(403).send({error: err.message})
    } else {
      next();
    }
  });
}
class Privateparty {
  abi = {
    erc20: ERC20,
    erc721: ERC721,
    ownable: OWNABLE
  }
  constructor (o) {
    if (o && o.config) {
      this.config = o.config() 
    }
    if (this.config && this.config.secret) {
      this.secret = this.config.secret
    } else {
      this.secret = (o && o.secret ? o.secret : uuidv4())
    }
    this.engines = {}
    this.auth = this.auth.bind(this)
    if (o && o.express) {
      this.express = o.express
    } else {
      this.express = express
    }
    if (o && o.app) {
      this.app = o.app
    } else {
      this.app = this.express()
    }
    this.use("cookieParser", cookieParser(this.secret))
    this.use("urlencodedParser", this.express.urlencoded({ extended: true }))
    this.use("jsonParser", this.express.json())

    if (this.config && this.config.cors) {
      this.use("corsMiddleware", cors(this.config.cors))  // set cors options if exists
      this.app.options('*', cors(this.config.cors))
    } else if (o && o.cors) {
      this.use("corsMiddleware", cors(o.cors))  // set cors options if exists
      this.app.options('*', cors(o.cors))
    }
    this.app.get("/privateparty", csrfProtection, (req, res) => {
      // get all the installed engines 
      let engines = {
        csrfToken: req.csrfToken(),
        parties: {}
      }
      for(let key in this.engines) {
        let e = this.engines[key]
        engines.parties[key] = {
          session: e.session,
          connect: e.connect,
          disconnect: e.disconnect,
          expire: e.expire
        }
      }
      res.json(engines)
    })
    if (o && o.install) o.install(this)
  }
  use(name, middleware) {
    // use a middleware, or override if it already exists
    if (this.app._router) {
      for(let i=0; i<this.app._router.stack.length; i++) {
        if (this.app._router.stack[i].name === name) {
          // the middleware already exists. remove and break
          this.app._router.stack.splice(i, 1);
          break;
        }
      }
    }
    this.app.use(middleware)
  }
  add(name, engine) {
    engine = (engine ? engine : {})
    if (!engine.session) engine.session = "/session"
    if (!engine.connect) engine.connect = "/connect"
    if (!engine.disconnect) engine.disconnect = "/disconnect"
    if (!engine.expire) engine.expire = 60 * 60 * 24 * 30  // default: 30 day later
    this.engines[name] = engine
    this.app.get(engine.session, (req, res) => {
      if (req.signedCookies) {
        let session = {}
        if (req.signedCookies[name]) {
          session[name] = JSON.parse(req.signedCookies[name])
        } else {
          session[name] = null
        }
        res.json(session)
      } else {
        res.json({})
      }
    })
    this.app.post(engine.connect, csrfProtection, async (req, res) => {
      // verify that the string matches the format
      let csrfToken = req.headers['csrf-token']
      // must have been signed with the csrfToken as nonce
      let re = new RegExp(`authenticating [^ ]+ at [0-9]+ with nonce ${csrfToken}`)
      let isvalid = re.test(req.body.str)
      if (isvalid) {
        const signer = sigUtil.recoverPersonalSignature({
          data: Buffer.from(req.body.str),
          signature: req.body.sig
        })
        if (signer) {
          let tokens = req.body.str.split(" ")
          let address = tokens[1]
          let timestamp = parseInt(tokens[3])
          // the signer must match the address
          if (signer.toLowerCase() === address.toLowerCase()) {
            // the timestamp must not be expired (timestamp must be less than the current time but not too old : 60 seconds)
            let now = Date.now()
            if (timestamp < now && timestamp > now - 1000 * 60) {
              let base = { account: signer.toLowerCase() }
              if (engine.authorize) {
                try {
                  let r
                  if (engine.contracts) {
                    let contracts = {}
                    for(let key in engine.contracts) {
                      let config = engine.contracts[key]
                      if (!config.rpc) throw new Error(`required field: contracts.${key}.rpc`)
                      if (!config.address) throw new Error(`required field: contracts.${key}.address`)
                      if (!config.abi) throw new Error(`required field: contracts.${key}.abi`)
                      let web3 = createAlchemyWeb3(config.rpc)
                      contracts[key] = new web3.eth.Contract(config.abi, config.address)
                    }
                    r = await engine.authorize(req, signer.toLowerCase(), contracts)
                  } else {
                    r = await engine.authorize(req, signer.toLowerCase())
                  }
                  if (r) {
                    base.auth = r
                  }
                } catch (e) {
                  res.status(401).send({error: e.message})
                  return
                }
              }
              const c = {
                expires: new Date(Date.now() + engine.expire * 1000),
                secure: (req.headers.origin.startsWith("https") ? true : false),
                signed: true,
                httpOnly: true,
              }
              if (this.config && this.config.cors && this.config.cors.origin && this.config.cors.origin.length > 0) {
                c.sameSite = "none"
              }
              res.cookie(name, JSON.stringify(base), c)
              res.clearCookie("_csrf")
              res.json(base)
            } else {
              res.status(401).send({error: "signature expired"})
            }
          } else {
            res.status(401).send({error: "invalid signer"})
          }
        } else {
          res.status(401).send({error: "invalid signature"})
        }
      } else {
        res.status(401).send({error: "invalid signature data"})
      }
    })
    this.app.post(engine.disconnect, async (req, res) => {
      if (req.body.name) {
        res.clearCookie(req.body.name)
      } else {
        for(let key in req.signedCookies) {
          res.clearCookie(key)
        }
      }
      res.send({})
    })
  }
  contract(web3, abi, address) {
    return new web3.eth.Contract(abi, address).methods
  }
  auth (name) {
    return (req, res, next) => {
      if (req.originalUrl === this.engines[name].connect || req.originalUrl === this.engines[name].disconnect) {
        next()
      } else {
        if (req.cookies) {
          req.session = {}
          for(let key in req.signedCookies) {
            if (key !== "_csrf") {
              req.session[key] = JSON.parse(req.signedCookies[key])
            }
          }
        } else {
          req.session = null
        }
        next()
      }
    }
  }
  protect (name, handler) {
    return (req, res, next) => {
      if (req.originalUrl === this.engines[name].connect || req.originalUrl === this.engines[name].disconnect) {
        next()
      } else {
        if (req.cookies) {
          req.session = {}
          for(let key in req.signedCookies) {
            if (key !== "_csrf") {
              req.session[key] = JSON.parse(req.signedCookies[key])
            }
          }
        } else {
          req.session = null
        }
        if (req.session && req.session[name]) {
          // logged in
          next()
        } else {
          // logged out 
          if (handler) {
            if (handler.redirect) {
              res.redirect(handler.redirect)
            } else if (handler.render) {
              res.status(401).set('Content-Type', 'text/html').sendFile(handler.render)
            } else {
              fs.promises.readFile(path.resolve(__dirname, "login.html"), "utf8").then((str) => {
                res.status(401).set('Content-Type', 'text/html').send(str.replace("{name}", name))
              })
            }
          } else {
            fs.promises.readFile(path.resolve(__dirname, "login.html"), "utf8").then((str) => {
              res.status(401).set('Content-Type', 'text/html').send(str.replace("{name}", name))
            })
          }
        }
      }
    }
  }
}
module.exports = Privateparty
