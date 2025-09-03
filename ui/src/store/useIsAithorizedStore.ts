import { create } from 'zustand';

interface IIsAithorized {
	isAuthorized: boolean;
	setIsAuthorized: (th: boolean) => void;
}

const initial = false;

// Атом состояния - авторизаван ли пользователь
export const useIsAithorizedStore = create<IIsAithorized>(set => {
	return {
		isAuthorized: initial,
		setIsAuthorized: (th: boolean) =>
			set(() => {
				return { isAuthorized: th };
			}),
	};
});
