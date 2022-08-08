require('dotenv').config()
const assert = require('assert')
const fetch = require('cross-fetch');
const Partypass = require('partypass');
(async () => {
  const pass = new Partypass({
    key: process.env.KEY,
    host: "http://localhost:3000"
  })
  let admin_session = await pass.create("admin")
  let user_session = await pass.create("user")

  // Test 1
	// fetch with user jwt => should fail
	let r = await fetch("http://localhost:3000/admin_only", {
		headers: {
			"Authorization": `token ${user_session.jwt}`
		}
	}).then((r) => {
		return r.json()
	})
	// result should be { error: "not admin" }
	console.log(r)
	assert.deepEqual(r, { error: 'not admin' })


  // Test 2
	// fetch with admin jwt => should work
	let r2 = await fetch("http://localhost:3000/admin_only", {
		headers: {
			"Authorization": `token ${admin_session.jwt}`
		}
	}).then((r) => {
		return r.json()
	})
	console.log(r2)
	assert(r2.success === "token:jwt")
	assert(r2.session)
	assert(r2.session.admin)
	
	
})();
