# multiple roles protection

You can pass an array to `party.protect(name)` to try to authorize with multiple roles.

If authorized for at least one of the supplied roles, the user is authorized.

```
const protector = party.protect(["api", "admin", "jwt"], handler)
party.app.get("/api", protector, (req, res) => {
  // authorized
})
```

# test

## browser test

- `node index` and go to http://localhost:3000
- the web app lets the user login as the admin role
- the backend should print `{}` for the `req.session` object at this point.
- after logging in, the `req.session` should be `{ "admin": { account, ... } }`
- the web app should fetch from `/api` and print `{ success: "jwt cookie" }`


## api test

- `node index`
- `node client`
- Test 1: fails because no auth header
- Test 2: use the accesss token to fetch => should succeed because the access token matches
  - the `req.session` should be `{ "api": { access_token: access_token } }`
- Test 3: use the JWT token authentication to fetch => SHOULD SUCCEED
  - the `req.session` should be `{ "jwt": { account, ... } }` => SHOULD SUCCEED
