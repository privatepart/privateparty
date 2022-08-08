const Privateparty = require('../../index')
const party = new Privateparty({
  gate: {
    fresh: true,
    walletconnect: "767750972a99441ea5d276ed16d7eef0"
  }
})
party.add("user")
party.app.get("/", party.protect("user"), (req, res) => {
  res.send("GOOD JOB")
})
party.app.listen(3000)
