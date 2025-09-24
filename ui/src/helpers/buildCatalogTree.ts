import type { IEIC, IEntryInCatalog } from '@/interfaces';

export function buildCatalogTree(objects: IEntryInCatalog[]) {
	const tree: IEIC = { dn: '', open: false, hashIndex: [], attributes: [] };

	objects.forEach(obj => {
		let arr = obj.dn.split(',');

		let dc = '';

		arr = arr.filter(el => {
			if (/dc=/.test(el) || /DC=/.test(el)) {
				dc += `${el},`;
				return false;
			} else {
				return true;
			}
		});

		dc = dc.substring(0, dc.length - 1);
		arr.push(dc);

		arr.reverse();

		let currentNode = tree;

		for (let i = 0; i < arr.length; i++) {
			if (!currentNode[arr[i]]) {
				if (i == arr.length - 1) {
					currentNode[arr[i]] = {
						dn: obj.dn,
						attributes: obj.attributes,
						open: false,
						hashIndex: arr.slice(0, i + 1),
					};
				} else {
					currentNode[arr[i]] = {
						dn: '',
						attributes: [],
						open: false,
						hashIndex: arr.slice(0, i + 1),
					};
				}
			}

			currentNode = currentNode[arr[i]] as IEIC;
		}
	});

	return tree;
}
