import { create } from 'zustand';
import type { ITargetPseudoObjectClass } from '@/interfaces';

interface ITargetObjClass {
	targetPseudoObjectClass: ITargetPseudoObjectClass;
	setTargetPseudoObjectClass: (th: ITargetPseudoObjectClass) => void;
}

const initial: ITargetPseudoObjectClass = { name: '', attrs: [] };

// Атом состояния - выбранные атрибуты
export const targetPseudoObjectClassStore = create<ITargetObjClass>(set => {
	return {
		targetPseudoObjectClass: initial,
		setTargetPseudoObjectClass: (th: ITargetPseudoObjectClass) =>
			set(() => {
				return { targetPseudoObjectClass: th };
			}),
	};
});
