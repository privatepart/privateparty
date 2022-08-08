const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user")
party.app.get(
  "/",
  party.protect("user", (req, res) => { res.redirect("/privateparty/gate/user?callback=/") }),
  (req, res) => {
    console.log("session", req.session)
    res.sendFile(process.cwd() + "/index.html")
  }
)
party.app.get(
  "/api",
  party.protect("user", (req, res) => { res.status(404).json({ error: "unauthorized" })	 }),
  (req, res) => {
    console.log("session", req.session)
    res.json({ success: true })
  }
)
party.app.listen(3000)
