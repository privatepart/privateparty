const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user")
party.add("admin", {
  session: "/admin/session",
  connect: "/admin/connect",
  disconnect: "/admin/disconnect",
  authorize: (req, account) => {
    return { admin: true }
  }
})
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.get("/admin", party.auth("admin"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/admin.html")
})
party.app.listen(3000)
