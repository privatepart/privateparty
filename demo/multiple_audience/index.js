const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user")
party.add("admin")
party.app.set('view engine', 'ejs');
party.app.set('views', __dirname);
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.render("index", { session: req.session })
})
party.app.listen(3000)
