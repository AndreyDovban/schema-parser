import type { IAciForEntity } from '@/interfaces';
import { create } from 'zustand';

interface IListAciEntity {
	listAciEntity: IAciForEntity[];
	setListAciEntity: (th: IAciForEntity[]) => void;
}

const initial: IAciForEntity[] = [];

// Атом состояния - масси имён атрибутов выбранных объект классов
export const listAciEntityStore = create<IListAciEntity>(set => {
	return {
		listAciEntity: initial,
		setListAciEntity: (th: IAciForEntity[]) =>
			set(() => {
				return { listAciEntity: th };
			}),
	};
});
