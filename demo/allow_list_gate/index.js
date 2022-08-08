///////////////////////////////////////////////////////////////////////////////////////////
//
//  When a user logs in, take a snapshot of an ERC20 token balance and store it in cookie
//
///////////////////////////////////////////////////////////////////////////////////////////
const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user", {
  authorize: async (req, account) => {
    console.log("account", account)
    const list = [
      "0xFb7b2717F7a2a30B42e21CEf03Dd0fC76Ef761E9",
      "0x502b2FE7Cc3488fcfF2E16158615AF87b4Ab5C41"
    ].map(l => l.toLowerCase())
    if (list.includes(account)) {
      return { member: true }
    } else {
      throw new Error("not on the list!") 
    }
  }
})
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.listen(3000)
