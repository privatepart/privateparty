# cors

make a cross origin request to privateparty server 

# test

- `node index` to start
- run `npx http-server` to start a static web server at port 8080. go to http://localhost:8080
- The `index.html` initializes a Privateparty instance with a host of http://localhost:3000
- The login and logout should work even though the frontend is hosted at port 8080, and the privateparty server is hosted at port 3000
