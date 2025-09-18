import { create } from 'zustand';
import type { IAuthData } from '@/interfaces';

interface IAuthDataStore {
	authData: IAuthData;
	setAuthData: (th: IAuthData) => void;
}

const initial: IAuthData = { address: 'ldaps://dc01.granulex.test', port: '636', login: '', password: '' };

// Атом состояния - объект данные авторизации
export const authDataStore = create<IAuthDataStore>(set => {
	return {
		authData: initial,
		setAuthData: (th: IAuthData) =>
			set(() => {
				return { authData: th };
			}),
	};
});
