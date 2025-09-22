import { create } from 'zustand';
import type { IEffectiveRight } from '@/interfaces';

interface IOutDataForCheckRightStore {
	outDataForCheckRights: IEffectiveRight[];
	setOutDataForCheckRights: (th: IEffectiveRight[]) => void;
}

const initial: IEffectiveRight[] = [];

// Атом состояния - данные для показа эффективных прав доступа
export const outDataForCheckRightStore = create<IOutDataForCheckRightStore>(set => {
	return {
		outDataForCheckRights: initial,
		setOutDataForCheckRights: (th: IEffectiveRight[]) =>
			set(() => {
				return { outDataForCheckRights: th };
			}),
	};
});
