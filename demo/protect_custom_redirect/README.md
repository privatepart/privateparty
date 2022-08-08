# protect with custom redirect

`party.protect(name, handler)` can have a custom `handler` object that describes how to react when the incoming request is not authorized for the "name" role.

```
party.protect("user", { redirect: "/login" })
```

## redirect

- the `/` route is protected with the "user" role, and when unauthorized, it redirects to `/login`.
  - the `/login` route redirects to `/` if logged in.
  - the `/login` route displays the `login.html` when not logged in.
- when authorized, it displays the `index.html`

## test

run `node index` and open http://localhost:3000

- it should redirect to `/login`
- when you log in, the `login.html` page will redirect back to `/`
- now the `index.html` will be displayed with an "Exclusive content" message
- when you log out, it will refresh and redirect to `/login`
