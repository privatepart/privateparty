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
    // take a snapshot of ERC20 ownership ($UNI or $RARI) and set it on the cookie
    const UNI = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
    const RARI = "0xfca59cd816ab1ead66534d82bc21e7515ce441cf"
    let balance = await party.contract(web3, party.abi.erc20, RARI).balanceOf(account).call()

    // Returning the additional attribute 'balance' will automatically set the value on the cookie
    // under the "auth" attribute
    return {
      balance: balance
    }
  }
})
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.listen(3000)
