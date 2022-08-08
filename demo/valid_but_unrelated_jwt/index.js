const Privateparty = require('../../index')
const party = new Privateparty()
party.add("admin")
party.add("user")
party.app.get("/admin_only", party.protect("admin", (req, res) => {
	res.json({ error: "not admin" })
}), (req, res) => {
  console.log("session", req.session)
	res.json({ success: req.authtype, session: req.session })
})
party.app.listen(3000)
