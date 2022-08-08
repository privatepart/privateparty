# access token auth

an access token (in Privateparty context) is a "god token".

1. Does not require a separate authentication (No privateparty auth)
2. Simply include the authentication tokens inside the "authorization" header
3. It can pass through any privateparty protection because it's considered an "admin" token
4. Not recommended in production (use Privateparty token authentication via partypass instead)

The session after `party.auth(name)` looks something like this:

```
session := {
  <name>: {
    access_token: <access_token>
  }
}
```

test expected results:

client

```
[Expected] { success: true } == { success: true }
[Expected] { success: true } == { success: true }
```

server

```
session {}
session { user: { access_token: '12345' } }
```
