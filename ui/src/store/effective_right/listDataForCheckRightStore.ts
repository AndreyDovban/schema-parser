import { create } from 'zustand';
import type { IEffectiveRight } from '@/interfaces';

interface IListDataForCheckRightStore {
	listDataForCheckRights: IEffectiveRight[];
	setListDataForCheckRights: (th: IEffectiveRight[]) => void;
}

const initial: IEffectiveRight[] = [];

// Атом состояния - данные в виде списка для показа эффективных прав доступа
export const listDataForCheckRightStore = create<IListDataForCheckRightStore>(set => {
	return {
		listDataForCheckRights: initial,
		setListDataForCheckRights: (th: IEffectiveRight[]) =>
			set(() => {
				return { listDataForCheckRights: th };
			}),
	};
});
