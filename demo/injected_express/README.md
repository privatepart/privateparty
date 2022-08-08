# injected express.js

by default privateparty instantiates a new express server app object from scratch.

However you can also plug privateparty into an existing express.js app instance.

```
const app = express()
const party = new Privateparty({ app })
```

# test

- `node index` and open http://localhost:3000
- the route is protected, so at first it will send you to the built-in login page.
- login, and it will render "Hello World"
- try refreshing after 10 seconds, the session would be expired (because of the "expire: 10" option)
