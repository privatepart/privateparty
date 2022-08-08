const Privateparty = require('../../index')
const party = new Privateparty()
party.add("admin", {
  tokens: [ "access-token-12345" ]
})
party.add("user")
party.app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html")
})
party.app.post("/api", party.protect("admin", { json: { error: "error" } }), (req, res) => {
  res.json({ success: true })
})
party.app.listen(3000)
