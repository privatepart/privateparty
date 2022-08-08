const Privateparty = require('../../index')
const party = new Privateparty()
party.add("api", {
  tokens: ["12345"]
})
party.add("admin")
party.add("jwt")
const protector = party.protect(["api", "admin", "jwt"], (req, res) => {
  if (req.headers.authorization) {
    res.status(401).json({ error: "token auth error" })
  } else {
    res.status(401).json({ error: "cookie auth error" })
  }
})
party.app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})
party.app.get("/api", protector, (req, res) => {
  console.log("req.session", req.session)
  if (req.authtype === "token:access") {
    res.json({ success: "access token" })
  } else if (req.authtype === "token:jwt") {
    res.json({ success: "jwt token" })
  } else if (req.authtype === "cookie:jwt") {
    res.json({ success: "jwt cookie" })
  }
})
party.app.listen(3000)
