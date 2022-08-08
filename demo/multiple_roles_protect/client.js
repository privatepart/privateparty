require('dotenv').config()
const fetch = require('cross-fetch');
const Partypass = require('partypass');
(async () => {
  // test 1
  try {
    let r = await fetch("http://localhost:3000/api").then((r) => {
      return r.json()
    })
    console.log("Result", r)
  } catch (e) {
    console.log("E",e)
  }

  console.log("######## request with access token => respond with success: access token")

  // test 2
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

  // test 3
  const pass = new Partypass({
    key: process.env.KEY,
    host: "http://localhost:3000"
  })
  let session = await pass.create("jwt")
  console.log("session", session)
  try {
    let r = await fetch("http://localhost:3000/api", {
      headers: {
        "Authorization": `token ${session.jwt}`
      }
    }).then((r) => {
      return r.json()
    })
    console.log("Result", r)
  } catch (e) {
    console.log("E",e)
  }
})();
