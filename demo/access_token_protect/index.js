const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user", {
  tokens: ["12345"]
})
party.app.get("/api", party.protect("user", { json: { error: "unauthorized" } }), (req, res) => {
  res.json({
    success: true
  })
})
party.app.get("/", party.protect("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(__dirname + "/index.html")
})
party.app.listen(3000)
