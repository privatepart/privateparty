const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user")
party.app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html")
})
party.app.listen(3000)
