import type { IPermission } from '@/interfaces';
import { create } from 'zustand';

interface IListPermissionsStore {
	listPermissions: IPermission[];
	setListPermissions: (th: IPermission[]) => void;
}

const initial: IPermission[] = [];

// Атом состояния - массив объектов "permission" (разрешение)
export const listPermissionsStore = create<IListPermissionsStore>(set => {
	return {
		listPermissions: initial,
		setListPermissions: (th: IPermission[]) =>
			set(() => {
				return { listPermissions: th };
			}),
	};
});
