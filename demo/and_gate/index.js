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
  authorize: async (req, account, engine) => {
    // take a snapshot of ERC721 NFT balance (End of Sartoshi)
    // ONLY allow login if the account holds AT LEAST 1
    const end_of_sartoshi = "0xf7d134224a66c6a4ddeb7dee714a280b99044805"
    const canvas = "0x6866ed9a183f491024692971a8f78b048fb6b89b"
    let sartoshi_balance = await party.contract(web3, party.abi.erc721, end_of_sartoshi).balanceOf(account).call()
    let canvas_balance = await party.contract(web3, party.abi.erc721, canvas).balanceOf(account).call()
    if (sartoshi_balance > 0 && canvas_balance > 0) {
      return { sartoshi: sartoshi_balance, canvas: canvas_balance }
    } else {
      // If the balance is 0, don't allow login
      throw new Error("must own both 'end of sartoshi' and 'canvas' NFTs")
    }
  }
})
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.listen(3000)
