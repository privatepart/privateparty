const fetch = require('cross-fetch');
(async () => {
  // Should fail becasue not logged in
  try {
    let r = await fetch("http://localhost:3000/api").then((r) => {
      return r.json()
    })
    console.log("Result", r)
  } catch (e) {
    console.log("E",e)
  }

  // Should succeed with the auth token
  try {
    let r = await fetch("http://localhost:3000/api", {
      headers: {
        "Authorization": "token 12345"
      }
    }).then((r) => {
      return r.json()
    })
    console.log("Result", r)
  } catch (e) {
    console.log("E",e)
  }
})();
