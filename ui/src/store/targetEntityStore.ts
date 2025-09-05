// targetEntityStore
import { create } from 'zustand';

interface ITargetEntityStore {
	targetEntity: string;
	setTargetEntity: (th: string) => void;
}

const initial = '';

// Атом состояния - dc объекта для поиска
export const targetEntityStore = create<ITargetEntityStore>(set => {
	return {
		targetEntity: initial,
		setTargetEntity: (th: string) =>
			set(() => {
				return { targetEntity: th };
			}),
	};
});
