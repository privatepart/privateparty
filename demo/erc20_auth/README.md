# erc20 auth

set user session based on the account's erc20 balance (see erc20_protect for protecting a route, not just setting the session)

# test

- customize the `index.js` file to use your own ERC20 contract address
- `node index` and open http://localhost:3000
- when you log in, the session will look something like `{ "user": { "account": account, "auth": { "balance": your_erc20_balance }, ... } }`
- when logged in, it will print the corresponding session obejct `{ "account": ... }` on the screen
