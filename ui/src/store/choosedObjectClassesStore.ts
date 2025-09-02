import { create } from 'zustand';
import type { IObjectClass } from '@/interfaces';

interface IChoosedObjClasses {
	choosedObjectClasses: IObjectClass[];
	setChoosedObjectClasses: (th: IObjectClass[]) => void;
}

const initial: IObjectClass[] = [];

export const choosedObjectClassesStore = create<IChoosedObjClasses>(set => {
	return {
		choosedObjectClasses: initial,
		setChoosedObjectClasses: (th: IObjectClass[]) =>
			set(() => {
				return { choosedObjectClasses: th };
			}),
	};
});
