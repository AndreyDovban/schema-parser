import { create } from 'zustand';

interface IScopeForCheckRightsStore {
	scopeForCheckRights: boolean;
	setScopeForCheckRights: (th: boolean) => void;
}

const initial = false;

// Атом состояния - режим просмотра поддерева записи при просмотре эффективных прав доступа
export const scopeForCheckRightsStore = create<IScopeForCheckRightsStore>(set => {
	return {
		scopeForCheckRights: initial,
		setScopeForCheckRights: (th: boolean) =>
			set(() => {
				return { scopeForCheckRights: th };
			}),
	};
});
