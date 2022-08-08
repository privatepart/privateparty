# login with nft

you can pass an extra payload for usage in the `authorize()` logic. For example:


```javascript
let connection = await party.connect("user", {
  collection: collectionAddress,
  tokenId: tokenId
})
```

when you pass the payload as the second argument, this object will be made available inside the `authorize()` method as `req.body.payload`

```javascript
party.add("user", {
  authorize: async (req, account) => {
    console.log("req.body.payload", req.body.payload)
    //  req.body.payload := {
    //    collection: collectionAddress,
    //    tokenId: tokenId
    //  }
  },
  ...
})
```

# test


- create a file named `.env` with `RPC=<json rpc endpoint url>`
- `node index` and go to http://localhost:3000
- enter the contract address and tokenId of an NFT you own.
- login
- ONLY IF You actually own the NFT it will login and display the image
  - the session will contain an `auth` attribute, which in turn contains `tokenURI` and `image` attributes
- IF you're not the owner, the authorization will fail => "not the owner of the nft"
