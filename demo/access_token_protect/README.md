# access token protect

- The "user" role is an access token authenticated role.
- The "user" role protects:
  - `/api` => returns an error json when not authorized
  - `/` => renders the default login.html when not authorized

# test

## web test

index.html

- should correctly render the login page without changing the URL to `/login`
- when logged in, should display the `index.html` file

## api test

client.js

- the first test should fail because no access token was passed
- the second test should succeed because a correct authorization header with the access token was passed

```
[Shouldnt happen] Result { error: 'unauthorized' }
[Expected] Result { success: true }
```
