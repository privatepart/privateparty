const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const Config = "partyadmin.config.js"
module.exports = {
  config: () => {
    let config
    try {
      let configStr = fs.readFileSync(Config, "utf8")
      config = JSON.parse(configStr)
    } catch (e) {
      config = {}
    }
    return config
  },
  install: (party) => {
    const render = path.resolve(__dirname, "login.html")
    party.add("partyadmin", {
      session: "/privateparty/admin/session",
      connect: "/privateparty/admin/connect",
      disconnect: "/privateparty/admin/disconnect",
      authorize: async (req, account) => {
        console.log('authorizing', account)
        console.log("config", party.config)
        if (party.config) {
          if (party.config.admins && Array.isArray(party.config.admins)) {
            if (party.config.admins.length > 0) {
              // if there's at least one admin, must atch
              let admins = party.config.admins.map(a => a.toLowerCase())
              if (admins.includes(account)) {
                return { admin: true }
              }
            } else {
              // if there's no admin set yet, anyone can authorize
              return { admin: true }
            }
          } else {
            return { admin: true }
          }
        } else {
          return { admin: true }
        }
        throw new Error(`The account ${account} is not an admin`)
      }
    })
    party.app.post("/privateparty/admin/update", party.protect("partyadmin", { render }), async (req, res) => {
      console.log("body", req.body)
      await fs.promises.writeFile(Config, JSON.stringify(req.body, null, 2))
      party.config = req.body
      res.json({})
    })
    party.app.get("/privateparty/admin", party.protect("partyadmin", { render }), async (req, res) => {
      let configStr = await fs.promises.readFile(Config, "utf8").catch((e) => {})
      let config
      try {
        config = JSON.parse(configStr)
      } catch (e) {
        config = {}
      }
      if (config.cors && config.cors.origin) config.cors = config.cors.origin.join("\n")
      if (config.admins) config.admins = config.admins.join("\n")
      let html = await ejs.renderFile("admin.html", config, { async: true })
      res.setHeader("Content-Type", "text/html").send(html)
    })
  }
}
