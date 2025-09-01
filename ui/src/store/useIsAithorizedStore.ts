import { create } from 'zustand';

interface IIsAithorized {
	isAuthorized: boolean;
	setIsAuthorized: (th: boolean) => void;
}

const initial = false;

export const useIsAithorizedStore = create<IIsAithorized>(set => {
	return {
		isAuthorized: initial,
		setIsAuthorized: (th: boolean) =>
			set(() => {
				return { isAuthorized: th };
			}),
	};
});
