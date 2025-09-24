import { create } from 'zustand';
import type { IEff } from '@/interfaces';

interface ITreeDataForCheckRightStore {
	treeDataForCheckRights: IEff;
	setTreeDataForCheckRights: (th: IEff) => void;
}

const initial: IEff = { dn: '', entry_level_rights: '', attribute_level_rights: [], open: false, hashIndex: [] };

// Атом состояния - данные виде дерева для показа эффективных прав доступа
export const treeDataForCheckRightsStore = create<ITreeDataForCheckRightStore>(set => {
	return {
		treeDataForCheckRights: initial,
		setTreeDataForCheckRights: (th: IEff) =>
			set(() => {
				return { treeDataForCheckRights: th };
			}),
	};
});
