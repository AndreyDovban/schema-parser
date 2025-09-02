import { create } from 'zustand';
import type { IAttribute } from '@/interfaces';

interface IChoosedAttributes {
	choosedAttributes: IAttribute[];
	setChoosedAttributes: (th: IAttribute[]) => void;
}

const initial: IAttribute[] = [];

export const choosedAttributesStore = create<IChoosedAttributes>(set => {
	return {
		choosedAttributes: initial,
		setChoosedAttributes: (th: IAttribute[]) =>
			set(() => {
				return { choosedAttributes: th };
			}),
	};
});
