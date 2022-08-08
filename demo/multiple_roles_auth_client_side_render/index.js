const Privateparty = require('../../index')
const party = new Privateparty()
party.add("admin")
party.add("user")
party.app.get('/', party.auth(["admin", "user"]), (req, res) => {
	console.log("req.session", req.session)
	res.sendFile(__dirname + "/index.html")
})
party.app.listen(3000)
