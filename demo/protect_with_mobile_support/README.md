# protect() with mobile support

The `protect()` method automatically sends the user to the built-in login page when unauthorized.

By default this login page does not support mobile wallets. But you can support mobile by passing a second argument `{ walletconnect: infuraId }`. Example:

```javascript
party.app.get("/", party.protect("admin", { walletconnect: "767750972a99441ea5d276ed16d7eef0" }), (req, res) => {
  console.log("session", req.session)
  res.sendFile(__dirname + "/index.html")
})
```

# test

- `node index` and go to http://localhost:3000
- login
- it should display the walletconnect modal
