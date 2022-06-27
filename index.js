const express = require('express')
const sigUtil = require('@metamask/eth-sig-util')
const csurf = require('csurf')
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
  constructor (secret) {
    secret = (secret ? secret : uuidv4());
    this.engines = {}
    this.express = express
    this.auth = this.auth.bind(this)
    this.app = app
    this.app.use(cookieParser(secret));
    this.app.use(this.express.urlencoded({ extended: true }))
    this.app.use(this.express.json())

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
      let host = req.get("host")
      // must have been signed with the csrfToken as nonce
      let re = new RegExp(`${host} authenticating [^ ]+ at [0-9]+ with nonce ${csrfToken}`)
      let isvalid = re.test(req.body.str)
      if (isvalid) {
        const signer = sigUtil.recoverPersonalSignature({
          data: Buffer.from(req.body.str),//    .toString("hex"),
          signature: req.body.sig
        })
        if (signer) {
          let tokens = req.body.str.split(" ")
          let address = tokens[2]
          let timestamp = parseInt(tokens[4])

          // the signer must match the address
          if (signer.toLowerCase() === address.toLowerCase()) {
            // the timestamp must not be expired (timestamp must be less than the current time but not too old : 60 seconds)
            let now = Date.now()
            if (timestamp < now && timestamp > now - 1000 * 60) {

              let base = { account: signer.toLowerCase() }
              if (engine.authorize) {
                try {
                  let r = await engine.authorize(req, signer.toLowerCase())
                  if (r) {
                    base.auth = r
                  }
                } catch (e) {
                  res.status(500).send({error: e.message})
                  return
                }
              }

              const c = {
                expires: new Date(Date.now() + engine.expire * 1000),
                secure: (req.headers.origin.startsWith("https") ? true : false),
                signed: true,
                httpOnly: true,
              }
              res.cookie(name, JSON.stringify(base), c)
              res.clearCookie("_csrf")
              res.json(base)
            } else {
              res.status(500).send({error: "signature expired"})
            }
          } else {
            res.status(500).send({error: "invalid signer"})
          }
        } else {
          res.status(500).send({error: "invalid signature"})
        }
      } else {
        res.status(500).send({error: "invalid signature data"})
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
          console.log("req.signedCookies", req.signedCookies)
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
}
module.exports = Privateparty
