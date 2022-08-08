# multiple roles authorizatioin with client side rendering

same as [multiple_roles_auth](multiple_roles_auth) but take care of all the authorization and rendering on the server side, using EJS template.

# test

- `node index` and go to http://localhost:3000
- at first the `req.session` will be `{}`
- after logging into user, it will be `{ user: ... }`
- after logging into admin, it will be `{ user: ..., admin: ... }`
