# injected contract

for convenience, privateparty ships with a built-in declarative syntax for using contract instances inside the `authorize()` method.

when you add a role with a `contracts` attribute, it can be used to auto-instantiate web3 contract instances, and the initialized contract objects will be passed into the `authorize()` callback as the 3rd parameter:

```
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
    ....
  },
  ...
}}
```

# test

- create a file named `.env` whose content is `RPC=<alchemy endpoint url>`
- customize the `contracts` attribute inside `index.js` to include the address of an NFT contract you at least own one
- `node index` and open http://localhost:3000
- at first, should display `{}` session
- when you log in, it should display the session
- try with another account that does not own any from the NFT collection, and it will display an error message "must own ... "
