# allow list gate

> specify an array of accounts allowed to access an endpoint

# test

- update the `index.js` file to include your own address in the "list" array.
- `node index` and open http://localhost:3000
- login from the browser
- it should successfully login if you're in the list
- try with an address that's not on the list => should fail
