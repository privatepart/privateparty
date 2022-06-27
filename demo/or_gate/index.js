///////////////////////////////////////////////////////////////////////////////////////////
//
//  When a user logs in, take a snapshot of an ERC20 token balance and store it in cookie
//
///////////////////////////////////////////////////////////////////////////////////////////
require('dotenv').config()
const Privateparty = require('../../index')
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(process.env.RPC)
const party = new Privateparty()
party.add("user", {
  authorize: async (req, account) => {
    const end_of_sartoshi = "0xf7d134224a66c6a4ddeb7dee714a280b99044805"
    let sartoshi_balance = await party.contract(web3, party.abi.erc721, end_of_sartoshi).balanceOf(account).call()
    let ismember = [ "0xFb7b2717F7a2a30B42e21CEf03Dd0fC76Ef761E9", "0x502b2FE7Cc3488fcfF2E16158615AF87b4Ab5C41" ].map(l => l.toLowerCase()).includes(account)
    console.log("ismember", ismember)

    // Must own "End of Sartoshi" or a Member
    if (sartoshi_balance > 0 || ismember) {
      return { sartoshi: sartoshi_balance, ismember }
    } else {
      // If the balance is 0, don't allow login
      throw new Error("must own both 'end of sartoshi' OR is a member")
    }
  }
})
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.listen(3000)
