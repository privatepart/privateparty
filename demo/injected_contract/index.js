///////////////////////////////////////////////////////////////////////////////////////////
//
//  When a user logs in, take a snapshot of an ERC20 token balance and store it in cookie
//
///////////////////////////////////////////////////////////////////////////////////////////
require('dotenv').config()
const Privateparty = require('../../index')
const party = new Privateparty()
party.add("user", {
  contracts: {
    sartoshi: {
      address: "0xf7d134224a66c6a4ddeb7dee714a280b99044805",
      rpc: process.env.RPC,
      abi: party.abi.erc721
    }
  },
  authorize: async (req, account, contracts) => {
    let balance = await contracts.sartoshi.methods.balanceOf(account).call()
    console.log("balance", balance)
    if (balance > 0) {
      return { balance: balance }
    } else {
      throw new Error("must own at least one 'end of sartoshi'")
    }
  }
})
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.listen(3000)
