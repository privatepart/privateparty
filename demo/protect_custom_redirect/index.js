const Privateparty = require('../../index')
const path = require('path')
const party = new Privateparty()
party.add("user")
party.app.get("/", party.protect("user", { redirect: "/login" }), (req, res) => {
  console.log("session", req.session)
  res.sendFile(path.resolve(__dirname, "index.html"))
})
party.app.get("/login", party.auth("user"), (req, res) => {
  console.log("req.session", req.session)
  res.sendFile(path.resolve(__dirname, "login.html"))
})
party.app.listen(3000)
