# and gate

> combining multiple conditions to protect a route

This example uses the `authorize()` method to authorize the `user` role

# test

- create a file named `.env` and set `RPC=<alchemy endpoint url>`
- `node index` and go to http://localhost:3000
- this will display `index.html`, which is NOT protected but just uses `auth()`.
- the `index.html` should initially display an empty session `{}`
- initially the session will be `{}` because of the `party.auth("user")` middleware, and the user is not logged in.
- now login, and the frontend will fetch the `user` session, which will fetch the entire session object for the user, and display the `user` role part of the session, which would look something like:
  - `{ "account": "0xfb7b2717f7a2a30b42e21cef03dd0fc76ef761e9", "expiresIn": 2592000, "sub": "0xfb7b2717f7a2a30b42e21cef03dd0fc76ef761e9", "aud": "user", "auth": { "sartoshi": "1", "canvas": "1" }, "iat": 1659396087 }`
- try refreshing the page first, the backend should print the session object as `{ user: { . . . } }`
- log out, and goes back to the beginning
