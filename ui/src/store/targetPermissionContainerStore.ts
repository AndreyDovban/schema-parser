import { create } from 'zustand';

interface ITargetPermissionContainerStore {
	targetPermissionContainer: string;
	setTargetPermissionContainer: (th: string) => void;
}

const initial = 'cn=permissions,cn=pbac,dc=granulex,dc=test';

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
