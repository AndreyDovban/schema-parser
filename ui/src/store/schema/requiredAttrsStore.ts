import { create } from 'zustand';

interface IRequiredAttrs {
	requiredAttrs: string[];
	setRequiredAttrs: (th: string[]) => void;
}

const initial: string[] = [];

// Атом состояния - список обязательных атрибутов
export const requiredAttrsStore = create<IRequiredAttrs>(set => {
	return {
		requiredAttrs: initial,
		setRequiredAttrs: (th: string[]) =>
			set(() => {
				return { requiredAttrs: th };
			}),
	};
});
