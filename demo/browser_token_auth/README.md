# browser token auth

There are two ways to do token authentication

- access token: "root access" token => can access all routes as long as the privateparty server is set up to accept the access tokens
- JWT: while you can use the partyconnect library to automatically store the authenticated JWT inside browser cookies, you can also extract out just the JWT string and attach them inside request authorization header

# test

- `node index` and open http://localhost:3000
- click "API request with access token": try making a request with access token. Should work even without logging in.
- click "API request without auth token": tries to make a request without any token. Should fail.
- click "API request with auth token": because not yet logged in, should fail because the jwt is empty
- click "get admin JWT" => should fill out the jwt field
- click "API request with auth token": should succeed now because the JWT is valid and the `/api` route is protected for the admin role
- click "get user JWT" => should fill out the jwt field with the user session
- click "API request with auth token": Should fail because the `/api` route is only accessible by the admin
