const Privateparty = require('../../index')
const party = new Privateparty()
party.add("admin")
party.app.get("/", party.protect("admin", { walletconnect: "767750972a99441ea5d276ed16d7eef0" }), (req, res) => {
  console.log("session", req.session)
  res.sendFile(__dirname + "/index.html")
})
party.app.listen(3000)
