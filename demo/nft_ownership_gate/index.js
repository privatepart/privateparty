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
    const tokenId = 9336
    let owner = await party.contract(web3, party.abi.erc721, end_of_sartoshi).ownerOf(tokenId).call()
    if (owner.toLowerCase() === account.toLowerCase()) {
      return {
        who: "9336 owner"
      }
    } else {
      // If the balance is 0, don't allow login
      throw new Error("must own the tokenId 9336")
    }

  }
})
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.listen(3000)
