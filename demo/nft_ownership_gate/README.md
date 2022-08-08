# nft ownership gate

restrict access based on whether you own a specific NFT (tokenId + contract)

# test

- create a `.env` file with `RPC=<YOUR JSON RPC ENDPOINT URL>`
- update the `authorize()` callback in index.js to use the contract address and tokenId of an NFT you own
- `node index` and go to http://localhost:3000
- login => if you own the nft, you can login
- try with another account that doesn't own the nft => should fail
