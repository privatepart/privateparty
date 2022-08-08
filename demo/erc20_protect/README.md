# erc20 protect

protect a web page based on erc20 balance

# test

- customize the `index.js` file to use your own ERC20 contract address
- `node index` and open http://localhost:3000
- at first, you're sent to the built-in login page for the "user" role. The route will be the same (`/`)
- when you log in, it will refresh, and print the `index.html`

- if you try to login with an account that doesn't hold the ERC20 tokens, it will fail
