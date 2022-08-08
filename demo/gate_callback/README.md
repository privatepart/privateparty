# gate with callback

by default, the built-in gate page only refreshes itself after logging in or logging out.

However you can set a "callback url", so that the user is redirected to the callback url after the login or logout. You just need to pass a `?callback=<url>` params in the URL.

```
<a href="/privateparty/gate/user?callback=/onboarding">login</a>
```

when you click above link, it will send the user to a "user" role login page, and when they log in, they will be redirected to the `/onboarding` route after login.

# test

- `node index` and open http://localhost:3000
- login
- after logging in, it will send the user to `/onboarding`
