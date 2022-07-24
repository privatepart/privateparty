const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user")
party.app.get("/", party.protect("user"), (req, res) => {
  res.send("GOOD JOB")
})
party.app.listen(3000)
