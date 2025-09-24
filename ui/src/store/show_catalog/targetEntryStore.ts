import { create } from 'zustand';

interface ITargetEntryStore {
	targetEntry: string;
	setTargetEntry: (th: string) => void;
}

const initial = '';

// Атом состояния - dn записи для просмотра аттрибутов
export const targetEntryStore = create<ITargetEntryStore>(set => {
	return {
		targetEntry: initial,
		setTargetEntry: (th: string) =>
			set(() => {
				return { targetEntry: th };
			}),
	};
});
