# add role with custom routes

By default, Privateparty automatically generates routes for every privateparty endpoint.:

- session: '/privateparty/session/:name',
- gate: '/privateparty/gate/:name',
- connect: '/privateparty/connect/:name',
- disconnect: '/privateparty/disconnect/:name',

But you can override the routes by passing the attributes when adding a role

```javascript
party.add("user", {
  session: "/user/session"
})
```

This will override the "session" endpoint for the "user" role, while maintaining the rest of the auto-generated routes, which would look something like this:

```
- session: '/user/session',
- gate: '/privateparty/gate/user',
- connect: '/privateparty/connect/user',
- disconnect: '/privateparty/disconnect/user',
```

# test

- `node index` and go to http://localhost:3000
- look inside the browser network tab, the route it's hitting should be `/user/session` (not `/privateparty/session/user`)
