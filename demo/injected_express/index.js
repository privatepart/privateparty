const express = require('express')
const Privateparty = require('../../index')
const app = express()
const port = 3000

// Inject the express app into Privateparty
const party = new Privateparty({ app })
party.add("user", { expire: 10 }) // Expire after 10 seconds
app.get("/", party.protect("user"), (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
