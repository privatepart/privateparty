const path = require('path')
const Privateparty = require('../../index')
const plugin = require('./plugin')
const party = new Privateparty({
  config: () => {
    let c = plugin.config()
    c.secret = "secret"
    return c
  },
  install: plugin.install
})
party.add("user")
party.app.use(party.protect("partyadmin")).use(party.express.static(path.join(__dirname, "homepage")))
party.app.get("/app", party.auth("user"), async (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.get("/api", party.protect("partyadmin"), (req, res) => {
  res.json({
    title: "hello world",
    description: "This is a test"
  })
})
party.app.listen(3000)
