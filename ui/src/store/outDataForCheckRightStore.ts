import { create } from 'zustand';

interface IOutDataForCheckRightStore {
	outDataForCheckRights: string;
	setOutDataForCheckRights: (th: string) => void;
}

const initial = 'cn=permissions,cn=pbac,dc=granulex,dc=test';

// Атом состояния - данные для показа эффективных прав доступа
export const outDataForCheckRightStore = create<IOutDataForCheckRightStore>(set => {
	return {
		outDataForCheckRights: initial,
		setOutDataForCheckRights: (th: string) =>
			set(() => {
				return { outDataForCheckRights: th };
			}),
	};
});
