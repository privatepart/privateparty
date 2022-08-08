const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user", {
  tokens: ["12345"]
})
party.app.get("/api", party.auth(), (req, res) => {
  console.log("session", req.session)
  res.json({ success: true })
})
party.app.listen(3000)
