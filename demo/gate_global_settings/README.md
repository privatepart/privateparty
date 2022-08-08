# gate with global settings

you can connect to privateparty in the frontend using custom options, for example:

```
await party.connect("user", {}, {
  fresh: true
})
```

But since you do not have control over the built-in login page, it is not possible to customize the behavior or the built-in login page.

To do this, you can set the configs globally from the privateparty server.

```javascript
const party = new Privateparty({
  gate: {
    fresh: true,
    walletconnect: "767750972a99441ea5d276ed16d7eef0"
  }
})
```

- above will initiate a "fresh connect" every time a user tries to login (let the user select from all wallet options instead of using the currently connected wallet)
- the `walletconnect` lets you support mobile wallets

# test

- `node index` and open http://localhost:3000
- try to log in
- it will ask for a fresh connect
- it will display a walletconnect modal instead of popping up the default injected browser wallet
- when you log in, it should print "GOOD JOB"
