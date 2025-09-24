import { create } from 'zustand';

interface IЕargetContainerStore {
	targetContainer: string;
	setTargetContainer: (th: string) => void;
}

const initial = '';

// Атом состояния - dn объекта для поиска дочерних объектов
export const targetContainerStore = create<IЕargetContainerStore>(set => {
	return {
		targetContainer: initial,
		setTargetContainer: (th: string) =>
			set(() => {
				return { targetContainer: th };
			}),
	};
});
