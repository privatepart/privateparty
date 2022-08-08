# mobile support

initialize partyconnect with a "walletconnect" attribute to support mobile wallets

```javascript
const party = new Privateparty({
  walletconnect: "767750972a99441ea5d276ed16d7eef0"
})
```

# test

- `node index` and go to http://localhost:3000
- login
- it should display a walletconnect modal
