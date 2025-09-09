const data = require('./test.json');
const fs = require('fs');

let result = data.reduce((acc, el, i) => {
	if (el[1] == false) {
		acc.push(el[0]);
	}

	return acc;
}, []);

fs.writeFileSync('./multivalue-attributes.json', JSON.stringify(result));
