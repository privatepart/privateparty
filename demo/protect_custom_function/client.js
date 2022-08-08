require('dotenv').config()
const fetch = require('cross-fetch');
const Partypass = require('partypass');
(async () => {
  // test 1
	try {
    let r = await fetch("http://localhost:3000/api").then((res) => {
      console.log("res.ok", res.ok)
			if (res.ok) {
				return res.json()
			} else {
				return res.json().then((json) => {
					throw new Error(json.error)
				})
			}
		})
    console.log("Result", r)
	} catch (e) {
		console.log("[Expected]", e.message, "==",  "unauthorized")
	}


  // test 2
  const pass = new Partypass({
    key: process.env.KEY,
    host: "http://localhost:3000"
  })
  let session = await pass.create("user")
  console.log("session", session)
  let r = await fetch("http://localhost:3000/api", {
    headers: {
      "Authorization": `token ${session.jwt}`
    }
  }).then((r) => {
    return r.json()
  })
  console.log("[expected]", r, '==', { success: true} )

})();
