// treeCatalogStore
import { create } from 'zustand';
import type { IEIC } from '@/interfaces';

interface ITreeCatalogStore {
	treeCatalog: IEIC;
	setTreeCatalog: (th: IEIC) => void;
}

const initial: IEIC = { dn: '', open: false, hashIndex: [], attributes: [] };

export const treeCatalogStore = create<ITreeCatalogStore>(set => {
	return {
		treeCatalog: initial,
		setTreeCatalog: (th: IEIC) =>
			set(() => {
				return { treeCatalog: th };
			}),
	};
});
