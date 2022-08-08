# protect with custom error handler function

in

```
party.protect(name, handler)
```

The `handler` can be an object:

- redirect
- render
- json

```json
{
  redirect: <redirect route>
}
```

or 

```json
{
  render: <render file path>
}
```

or

```json
{
  json: <json response>
}
```

But it can also be a function, which provides the most flexible way to deal with the authorization error. For example:

```
party.protect(name, (req, res) => {
  res.json({ error: "this is an error" })
})
```

or 

```
party.protect(name, (req, res) => {
  res.status(404).sendFile(path.resolve(__dirname, "404.html"))
})
```

# test

## browser test

- run `node index` and open http://localhost:3000
- it should redirect to `/privateparty/gate/user?callback=/`
- when you log in, it will redirect back to `/`
- this time you're logged in, so it will display the `index.html` file, printing the session

## api test

- run `node index`
- run `node client`
- The first request should fail because there's no authorization header
- The second request should succeed because it creates a token and uses it in the header
