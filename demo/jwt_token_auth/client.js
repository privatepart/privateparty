require('dotenv').config()
const fetch = require('cross-fetch');
const assert = require('assert')
const Partypass = require('partypass');
(async () => {
  // test 1 => no token
  try {
    let r = await fetch("http://localhost:3000/api").then((r) => {
      if (r.ok) {
        return r.json()
      } else {
				return r.json().then((json) => {
          console.log("json", json)
					throw new Error(json.error_msg)
				})
      }
    })
    console.log("Result", r)
  } catch (e) {
    console.log("Expect", e.message, "==", "not authorized")
  }


  // test 2 => include jwt
  const pass = new Partypass({
    key: process.env.KEY,
    host: "http://localhost:3000"
  })
  let session = await pass.create("admin")
  console.log("session", session)
  let r = await fetch("http://localhost:3000/api", {
    headers: {
      "Authorization": `token ${session.jwt}`
    }
  }).then((r) => {
    return r.json()
  })
  console.log(r)
  assert(r.session)
  assert(r.session.admin)
  assert(r.session.admin.account)
  assert(r.session.admin.sub)
  assert(r.session.admin.aud === "admin")
})();
