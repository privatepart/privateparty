# JWT token authentication

Statelessly authenticate using private key (no cookie).

1. Designed to be used in a non-browser setting (no cookies)
2. Stateless: therefore the session is not automatically stored in cookies
3. Make a request to authenticate, get the `jwt` attribute, and use it in subsequent requests to the endpoint
4. Only returns a session object for the specific JWT (In cookie authentication, the entire session object containing every role authorized for the current session is returned)

The `req.session` after the `party.auth(name)` middleware looks something like this:

```
session := {
  <name>: {
    account: account,
    expiresIn: expiresIn,
    auth: auth,
    ...
  }
}
```
