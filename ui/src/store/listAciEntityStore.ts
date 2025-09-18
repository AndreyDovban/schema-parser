import { create } from 'zustand';

interface IListAciEntity {
	listAciEntity: string[];
	setListAciEntity: (th: string[]) => void;
}

const initial: string[] = [];

// Атом состояния - масси имён атрибутов выбранных объект классов
export const listAciEntityStore = create<IListAciEntity>(set => {
	return {
		listAciEntity: initial,
		setListAciEntity: (th: string[]) =>
			set(() => {
				return { listAciEntity: th };
			}),
	};
});
