import { create } from 'zustand';

interface IObjectForCheckRightStore {
	objectForCheckRights: string;
	setObjectForCheckRights: (th: string) => void;
}

const initial = '';

// Атом состояния - dn объекта для которого показать еффективные права доступа
export const objectForCheckRightStore = create<IObjectForCheckRightStore>(set => {
	return {
		objectForCheckRights: initial,
		setObjectForCheckRights: (th: string) =>
			set(() => {
				return { objectForCheckRights: th };
			}),
	};
});
