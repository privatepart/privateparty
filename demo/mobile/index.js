const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user")
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.listen(3000)
