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
    const contract_address = "0xf7d134224a66c6a4ddeb7dee714a280b99044805"
    const allow_list = [ "0xFb7b2717F7a2a30B42e21CEf03Dd0fC76Ef761E9", "0x502b2FE7Cc3488fcfF2E16158615AF87b4Ab5C41" ].map(l => l.toLowerCase())
    const balance = await party.contract(web3, party.abi.erc721, contract_address).balanceOf(account).call()
    const ismember = allow_list.includes(account)
    if (balance > 0 || ismember) {
      return { sartoshi: balance, ismember }
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
