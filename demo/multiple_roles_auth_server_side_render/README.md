# multiple roles authorizatioin

an example to display multiple login options (admin or user)

The [index.ejs](index.ejs) file does not have any javascript because all the authorization is handled in the backend before the template is rendered.

# test

- `node index` and open http://localhost:3000
- check the backend log => the req.session should two keys `user` and `admin` (because it's a multi role authorization)
- initially it will be `{}`
- after logging into user role, the user attribute will not be null anymore
- after logging into admin role, the admin attribute will not be null anymore

After logging into both roles, the backend would print something like this:

```
session {
  user: {
    account: '0xfb7b2717f7a2a30b42e21cef03dd0fc76ef761e9',
    expiresIn: 2592000,
    sub: '0xfb7b2717f7a2a30b42e21cef03dd0fc76ef761e9',
    aud: 'user',
    iat: 1659409374
  },
  admin: {
    account: '0xfb7b2717f7a2a30b42e21cef03dd0fc76ef761e9',
    expiresIn: 2592000,
    sub: '0xfb7b2717f7a2a30b42e21cef03dd0fc76ef761e9',
    aud: 'admin',
    iat: 1659409383
  }
}
```
