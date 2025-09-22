import { create } from 'zustand';
import type { IAttribute } from '@/interfaces';

interface ITargetAttribute {
	targetAttribute?: IAttribute;
	setTargetAttribute: (th: IAttribute | undefined) => void;
}

const initial: IAttribute | undefined = undefined;

// Атом состояния - выбранные атрибуты
export const targetAttributeStore = create<ITargetAttribute>(set => {
	return {
		targetAttribute: initial,
		setTargetAttribute: (th: IAttribute | undefined) =>
			set(() => {
				return { targetAttribute: th };
			}),
	};
});
