import { create } from 'zustand';
import type { IEntryInCatalog } from '@/interfaces';

interface IListCatalogStore {
	listCatalog: IEntryInCatalog[];
	setListCatalog: (th: IEntryInCatalog[]) => void;
}

const initial: IEntryInCatalog[] = [];

export const listCatalogStore = create<IListCatalogStore>(set => {
	return {
		listCatalog: initial,
		setListCatalog: (th: IEntryInCatalog[]) =>
			set(() => {
				return { listCatalog: th };
			}),
	};
});
