const Privateparty = require('../../index')
const path = require('path')
const party = new Privateparty()
party.add("user")
party.app.get("/onboarding", (req, res) => {
  res.send("ONBOARDING PAGE <a href='/'>go home</a>")
})
party.app.use("/", party.auth("user"), party.express.static(path.resolve(__dirname)))
party.app.listen(3000)
