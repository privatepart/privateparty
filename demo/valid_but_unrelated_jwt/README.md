# Valid but unrelated JWT should fail

Making a request with a different role should fail even if the JWT itself is valid.

For example, if you have a valid JWT for a user role, making a request to an endpoint protected by an admin role should fail.

# test

- `node index`
- `node client`
- The first test should fail because the `/admin_only` endpoint is protected for the admin role
- The second test should succeed becaus it makes a request with an admin token
