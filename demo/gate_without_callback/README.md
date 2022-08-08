# gate without callback

by default, the built-in gate page only refreshes itself after logging in or logging out.


```
<a href="/privateparty/gate/user">login</a>
```

clicking above will send the user to the built-in login page, and when you log in, it will refresh, and display a "logout" button

# test

- `node index` and open http://localhost:3000
- login
- it will refresh and display a "logout from user" button
- when you click logout, it will refresh back to the login page
