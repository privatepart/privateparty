# or gate

> test multiple logic in the `authorize()` method and allow login if at least one of the conditions is met

This example tests whether:

- you're a member of an allow list
- or if you own an item on an NFT contract

if at least one of the conditions is met, you are authorized

# test

- create `.env` file with `RPC=<YOUR JSON RPC ENDPOINT URL>`
- customize the contract address or the allow list in `index.js`
- run `node index` and go to http://localhost:3000
- try logging in with a valid account
- try logging in with an invalid account
