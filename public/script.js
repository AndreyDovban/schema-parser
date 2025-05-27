'use strict';
const but = document.querySelector('#but');
but.onclick = async () => {
	try {
		console.log('work');
		const f = await fetch('/schema');
		let res = await f.json();
		console.log(res);
	} catch (err) {
		console.log(err);
	}
};
