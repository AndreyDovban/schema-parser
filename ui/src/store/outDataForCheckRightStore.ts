import { create } from 'zustand';

interface IOutDataForCheckRightStore {
	outDataForCheckRights: string;
	setOutDataForCheckRights: (th: string) => void;
}

const initial = '';

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
