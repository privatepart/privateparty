const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const express = require('express')
const fs = require('fs')
const sigUtil = require('@metamask/eth-sig-util')
const csurf = require('csurf')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
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
    this.config = o
    this.secret = (o && o.secret ? o.secret : uuidv4())
    this.engines = {}
    this.auth = this.auth.bind(this)
    if (o && o.express) {
      this.express = o.express
    } else {
      this.express = express
    }
    if (o && o.gate) {
      this.gate = o.gate
    }
    if (o && o.app) {
      this.app = o.app
    } else {
      this.app = this.express()
    }
    this.use("cookieParser", cookieParser(this.secret))
    this.use("urlencodedParser", this.express.urlencoded({ extended: true }))
    this.use("jsonParser", this.express.json())
    if (o && o.cors) {
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
          gate: e.gate,
          session: e.session,
          connect: e.connect,
          disconnect: e.disconnect,
          expire: e.expire
        }
      }
      res.json(engines)
    })
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
  verify(x) {
    return new Promise((resolve, reject) => {
      jwt.verify(x, this.secret, (err, decoded) => {
        if (err) {
          resolve(null)
        } else {
          resolve(decoded)
        }
      })
    })
  }
  renderGate(name, res, handler) {
    if (!handler) handler = this.gate // if handler is not set, use the default gate handler
    fs.promises.readFile(path.resolve(__dirname, "login.html"), "utf8").then((str) => {
      str = str.replaceAll("{name}", name)
      if (handler && handler.walletconnect) {
        str = str.replaceAll("{options}", JSON.stringify({ walletconnect: handler.walletconnect }))
      } else {
        str = str.replaceAll("{options}", "")
      }
      if (handler && handler.fresh) {
        str = str.replaceAll("{connect_options}", JSON.stringify({ fresh: true }))
      } else {
        str = str.replaceAll("{connect_options}", "null")
      }
      res.status(200).set('Content-Type', 'text/html').send(str)
    })
  }
  add(name, engine) {
    engine = (engine ? engine : {})
    if (!engine.gate) engine.gate = "/privateparty/gate/" + name
    if (!engine.session) engine.session = "/privateparty/session/" + name
    if (!engine.connect) engine.connect = "/privateparty/connect/" + name
    if (!engine.disconnect) engine.disconnect = "/privateparty/disconnect/" + name
    if (!engine.expire) engine.expire = 60 * 60 * 24 * 30  // default: 30 day later
    this.engines[name] = engine
    this.app.get(engine.session, async (req, res) => {
      if (req.cookies) {
        let session = {}
        if (req.cookies[name]) {
          if (req.cookies[name]) {
            session[name] = await this.verify(req.cookies[name])
          } else {
            session[name] = null
          }
        } else {
          session[name] = null
        }
        res.json(session)
      } else {
        res.json({})
      }
    })
    this.app.get(engine.gate, (req, res) => {
      this.renderGate(name, res, this.gate)
    })
    this.app.post(engine.connect, async (req, res) => {
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
              let base = { account: signer.toLowerCase(), expiresIn: engine.expire }
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
              const token = jwt.sign(base, this.secret)
              base.jwt = token    // return the jwt as well

              const c = {
                expires: new Date(Date.now() + engine.expire * 1000),
                secure: (req.headers.origin && req.headers.origin.startsWith("https") ? true : false),
                httpOnly: true,
              }
              if (this.config && this.config.cors && this.config.cors.origin && this.config.cors.origin.length > 0) {
                if (req.headers.origin.startsWith("http://localhost")) {
                  // lax => localhost doesn't allow samesite cookies
                } else {
                  c.sameSite = "none"
                }
              }
              res.cookie(name, token, c)
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
        for(let key in req.cookies) {
          res.clearCookie(key)
        }
      }
      res.send({})
    })
  }
  contract(web3, abi, address) {
    return new web3.eth.Contract(abi, address).methods
  }
  async check(req, name) {
    // If the request contains an "authorization" header, it's a token authenticated request
    if (req.headers && req.headers['authorization']) {
      let a = req.headers['authorization']
      let s = a.split(' ')
      let token = s[1]
      let engine = this.engines[name]
      if (engine.tokens && engine.tokens.includes(token)) {
        // hardcoded access token authentication
        req.session = {
          [name]: { token }
        }
      } else {
        // jwt token authentication
        let extracted = await this.verify(token)
        if (extracted) {
          req.session = {
            [name]: extracted
          }
        } else {
          req.session = null
        }
      }
      req.authtype = "token"
    }
    // If the request contains cookies, it's an in-browser request.
    else if (req.cookies) {
      req.session = {}
      for(let key in req.cookies) {
        if (key !== "_csrf") {
          req.session[key] = await this.verify(req.cookies[key])
        }
      }
      req.authtype = "cookie"
    }
    // Otherwise, null session
    else {
      req.session = null
    }
    return req.session
  }
  error(res, name, handler) {
    if (handler) {
      if (handler.redirect) {
        res.redirect(handler.redirect)
      } else if (handler.render) {
        res.status(401).set('Content-Type', 'text/html').sendFile(handler.render)
      } else if (handler.json) {
        res.status(401).json(handler.json)
      } else {
        this.renderGate(name, res, handler)
      }
    } else {
      this.renderGate(name, res, handler)
    }
  }
  auth (name) {
    return async (req, res, next) => {
      if (req.originalUrl === this.engines[name].connect || req.originalUrl === this.engines[name].disconnect) {
        next()
      } else {
        await this.check(req, name)
        next()
      }
    }
  }

  // advanced protection (both access token protect + cookie protection)
  protect2 (mapping, handler) {
    return async (req, res, next) => {
      // cookie authentication setup route => always pass
      if (mapping.cookie && req.originalUrl === this.engines[mapping.cookie].connect || req.originalUrl === this.engines[mapping.cookie].disconnect) {
        next()
      } else {
        // loop through the roles and check until matches
        for(let key in mapping) {
          // key := "token"|"cookie"
          let session = await this.check(req, mapping[key])
          if (session) break;
        }
        if (req.session && Object.keys(req.session).length > 0) {
          // at least one of the sessions is available
          next()
        } else {
          // if the request was token authenticated, return json
          // if the request was cookie authenticated, return html
          this.error(res, mapping[req.authtype], handler)
        }
      }
    }
  }

  // cookie protection
  protect1 (name, handler) {
    return async (req, res, next) => {
      if (req.originalUrl === this.engines[name].connect || req.originalUrl === this.engines[name].disconnect) {
        next()
      } else {
        await this.check(req, name)
        if (req.session && req.session[name]) {
          // logged in
          next()
        } else {
          //// logged out 
          this.error(res, name, handler)
        }
      }
    }
  }
  /*
  protect1: party.protect({ token: "api", cookie: "admin" }, handler)
  protect2: party.protect("api", handler)
  */
  protect (name, handler) {
    if (typeof name === 'string') {
      return this.protect1(name, handler)
    } else {
      return this.protect2(name, handler)
    }
  }
}
module.exports = Privateparty
