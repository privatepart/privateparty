const Privateparty = require('../../index')
const party = new Privateparty()
party.add("api", {
  tokens: ["12345"]
})
party.add("admin")
party.app.get("/api", party.protect({ token: "api", cookie: "admin" }, { json: { error: "not authorized" } }), (req, res) => {
  res.json({ success: true })
})
party.app.get("/", party.protect("admin"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(__dirname + "/index.html")
})
party.app.listen(3000)
