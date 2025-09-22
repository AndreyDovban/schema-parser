import { create } from 'zustand';

interface ITargetPermissionContainerStore {
	targetPermissionContainer: string;
	setTargetPermissionContainer: (th: string) => void;
}

const initial = '';

// Атом состояния - dn объекта контейнера с разрешениями
export const targetPermissionContainerStore = create<ITargetPermissionContainerStore>(set => {
	return {
		targetPermissionContainer: initial,
		setTargetPermissionContainer: (th: string) =>
			set(() => {
				return { targetPermissionContainer: th };
			}),
	};
});
