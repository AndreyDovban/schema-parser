import { create } from 'zustand';
import type { IObjectClass } from '@/interfaces';

interface IChoosedObjClasses {
	choosedObjectClasses: IObjectClass[];
	setChoosedObjectClasses: (th: IObjectClass[]) => void;
}

const initial: IObjectClass[] = [];

// Атом состояния - выбранные объект классы
export const choosedObjectClassesStore = create<IChoosedObjClasses>(set => {
	return {
		choosedObjectClasses: initial,
		setChoosedObjectClasses: (th: IObjectClass[]) =>
			set(() => {
				return { choosedObjectClasses: th };
			}),
	};
});
