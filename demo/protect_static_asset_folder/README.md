# static page protection

the `party.protect(name, handler)` can be used as a middleware to protect a folder

```
party.app.use(
  "/",
  party.protect("user"),                                    // protect with "user" role
  party.express.static(path.resolve(__dirname, "public"))   // protect everything inside the public folder
)
```

# test

- run `node index` and go to http://localhost:3000
- at first it will display the built-in login page (without the url changing)
- when you log in, it will refresh, and...
- the website should property display the html text as well as the embedded `pixel.png` file
