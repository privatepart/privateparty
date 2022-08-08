const Privateparty = require('../../index')
const path = require('path')
const party = new Privateparty()
party.add("user")
party.app.get("/", party.protect("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(path.resolve(__dirname, "index.html"))
})
party.app.listen(3000)
