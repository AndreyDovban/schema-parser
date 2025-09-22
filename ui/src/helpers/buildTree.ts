export interface IEff {
	dn: string;
	entry_level_rights: string;
	open: boolean;
	hashIndex: string[];
}

export function buildTree(objects: IEff[]) {
	const tree: Record<string, IEff> = {};

	objects.forEach(obj => {
		let arr = obj.dn.split(',');

		let dc = '';

		arr = arr.filter(el => {
			if (/dc=/.test(el)) {
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
						entry_level_rights: obj.entry_level_rights,
						open: false,
						hashIndex: arr.slice(0, i + 1),
					};
				} else {
					currentNode[arr[i]] = {
						entry_level_rights: '???',
						open: false,
						hashIndex: arr.slice(0, i + 1),
					};
				}
			}

			currentNode = currentNode[arr[i]];
		}
	});

	return tree;
}
