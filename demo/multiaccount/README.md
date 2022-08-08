# multiaccount

it's possible to create multiple roles.

This example lets you login as "user" at route `/`, and lets you login as "admin" at route `/admin`.

The sessions are maintained separately, so you can be logged in as admin while logged out as user, and vice versa.

# test

- `node index` and go to http://localhost:3000
- when loading the `/` route, the backend should initially print the session `{}`
- login as user => when loading the `/` route, the backend should print the session `{ user: ... }`
- go to the admin page `/admin`. the backend should initially print the session `{}`
- login as admin => when loading the `/admin` route, the backend should print the session `{ admin: ... }`
- logout of admin => the user account should still be valid
