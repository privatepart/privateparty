# protect default

`party.protect(name, handler)` can have a custom `handler` object that describes how to react when the incoming request is not authorized for the "name" role.

When the `handler` is not specified, it uses the default handler (renders the built-in account page), and renders it (not redirect)

```
party.protect("user")
```

# test

- run `node index` and open http://localhost:3000
- it will automatically render the built-in loging page WITHOUT changing the route
- when you log in, the built-in login page will refresh
- this time because logged in, the session will be `{ user: { ... } } `
- and the `index.html` page will be rendered.
- when you log out, the `index.html` page will refresh (`location.href = location.href`), and it will render the default login page again
