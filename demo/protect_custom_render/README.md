# protect with custom render

`party.protect(name, handler)` can have a custom `handler` object that describes how to react when the incoming request is not authorized for the "name" role.

```
party.protect("user", { render: path.resolve(__dirname, "login.html") })
```

## test

- run `node index` and go to http://localhost:3000
- it should keep the same `/` route, but display the `login.html` HTML
- from the `login.html` page you can login
- once you log in, the JS in `login.html` will do a refresh wthout changing the URL (`location.href = location.href`)
- because now logged in, the session won't be empty. It will be `{ "user": { ... } }`
- and now will render the `index.html` page.
- when you log out, it will render the `login.html` again
