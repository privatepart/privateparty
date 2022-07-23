const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user")
party.app.get("/", party.auth("user"), (req, res) => {
  res.sendFile(process.cwd() + "/index.html")
})
party.app.post("/api", party.protect("user", { json: { error: "error" } }), (req, res) => {
  res.json({ success: true })
})
party.app.listen(3000)
