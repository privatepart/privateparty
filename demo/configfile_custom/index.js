// If the config is not an object but a string,
// use that config file as the initialization config
const Privateparty = require('../../index')
const party = new Privateparty("./party.js")
party.add("user")
party.app.listen(3000)
