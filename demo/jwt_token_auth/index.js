const Privateparty = require('../../index')
const party = new Privateparty()
party.add("admin")
party.app.get("/api", party.protect("admin", { json: { error_msg: "not authorized" } }), (req, res) => {
  res.json({ session: req.session })
})
party.app.listen(3000)
