import { create } from 'zustand';

interface INodeForCheckRightsStore {
	nodeForCkeckRights: string;
	setNodeForCheckRights: (th: string) => void;
}

const initial = '';

// Атом состояния - dn узла каталога от которого начинать проверку прав
export const nodeForCheckRightsStore = create<INodeForCheckRightsStore>(set => {
	return {
		nodeForCkeckRights: initial,
		setNodeForCheckRights: (th: string) =>
			set(() => {
				return { nodeForCkeckRights: th };
			}),
	};
});
