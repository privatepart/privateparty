const Privateparty = require('../../index')
const party = new Privateparty({
  secret: "hello",
  cors: {
    credentials: true,
    origin: ["http://localhost:8080", "http://localhost:3000"],
  }
})
party.add("user")
party.app.listen(3000)
