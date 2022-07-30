# JWT token authentication

Statelessly authenticate using private key (no cookie).

1. Designed to be used in a non-browser setting (no cookies)
2. Stateless: therefore the session is not automatically stored in cookies
3. Make a request to authenticate, get the `jwt` attribute, and use it in subsequent requests to the endpoint
4. Only returns a session object for the specific JWT (In cookie authentication, the entire session object containing every role authorized for the current session is returned)

The session after `party.auth()` looks something like this:

```
session := {
  <role>: {
    account: account,
    expiresIn: expiresIn,
    auth: auth,
  }
}
```

Compare it to a cookie based authentication where it returns ALL authorized for the current session, for example:


```
session := {
  <role0>: {
    account: account,
    expiresIn: expiresIn,
    auth: auth,
  },
  <role1>: {
    account: account,
    expiresIn: expiresIn,
    auth: auth,
  },
  <role2>: {
    account: account,
    expiresIn: expiresIn,
    auth: auth,
  }
}
```
