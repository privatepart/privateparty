# fresh login from frontend

By default, the partyconnect library caches the existing wallet connection so the user doesn't have to select an account from the available wallet list every time they need to authenticate.

But you can override this behavior by calling:

```javascript
await party.connect(name, null, { fresh: true })
```

The `fresh: true` option will ensure that the user gets to select accounts from the list.

# test

- run `node index` and go to http://localhost:3000
- when trying to log in, it will let you select from a list of accounts
