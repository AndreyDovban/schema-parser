'use strict';
const schema_but = document.querySelector('#schema_but');
const subschema_but = document.querySelector('#subschema_but');
const out = document.querySelector('#out');

async function request(url) {
	try {
		const f = await fetch(url);
		let res = await f.json();
		out.innerHTML = JSON.stringify(res, null, 4);
	} catch (err) {
		out.innerHTML = JSON.stringify(err, null, 4);
	}
}

schema_but.onclick = () => request('/api/schema');
subschema_but.onclick = () => request('/api/subschema');
