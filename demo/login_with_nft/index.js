///////////////////////////////////////////////////////////////////////////////////////////
//
//  When a user logs in, take a snapshot of an ERC20 token balance and store it in cookie
//
///////////////////////////////////////////////////////////////////////////////////////////
require('dotenv').config()
const Privateparty = require('../../index')
const fetch = require('cross-fetch')
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(process.env.RPC)
const party = new Privateparty()
party.add("user", {
  authorize: async (req, account) => {
    console.log("req.body", req.body)
    console.log("account", account)
    // take a snapshot of ERC721 NFT balance (End of Sartoshi)
    // ONLY allow login if the account holds AT LEAST 1
    let tokenURI = await party.contract(web3, party.abi.erc721, req.body.payload.collection).tokenURI(req.body.payload.tokenId).call()
    let owner = await party.contract(web3, party.abi.erc721, req.body.payload.collection).ownerOf(req.body.payload.tokenId).call()
    if (owner.toLowerCase() === account) {
      let image = await fetch("https://ipfs.io/ipfs/" + tokenURI.replace("ipfs://", ""))
                        .then(r => r.json())
                        .then(r => r.image)
      return {
        tokenURI,
        image: "https://ipfs.io/ipfs/" + image.replace("ipfs://", "")
      }
    } else {
      throw new Error("not the owner of the nft")
    }
  }
})
party.app.get("/", party.auth("user"), (req, res) => {
  console.log("session", req.session)
  res.sendFile(process.cwd() + "/index.html")
})
party.app.listen(3000)
