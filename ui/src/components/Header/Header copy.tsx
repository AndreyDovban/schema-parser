import styles from './Header.module.css';
import cn from 'classnames';
import { useState, type ChangeEvent, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import Link from '@/assets/svg/link.svg?react';
import Refresh from '@/assets/svg/refresh.svg?react';
import { useIsAithorizedStore } from '@/store';

interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function Header({ className, ...props }: HeaderProps) {
	const [authData, setAuthData] = useState({
		address: 'ldaps://dc01.granulex.test',
		port: '636',
		login: 'uid=admin,cn=users,cn=accounts,dc=granulex,dc=test',
		password: '12345678',
	});
	const { isAuthorized, setIsAuthorized } = useIsAithorizedStore();

	function handleCahangeAuthData(e: ChangeEvent<HTMLInputElement>) {
		setAuthData({ ...authData, [e.target.placeholder]: e.target.value });
	}

	async function handleSubmit() {
		try {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(authData),
			});
			if (!response.ok) {
				throw new Error(`Ошибка HTTP запроса! Статус ошибки ${response.status}`);
			}

			const result = await response.json();
			setIsAuthorized(true);

			if (typeof result == 'string') {
				setIsAuthorized(true);
			}
		} catch (error) {
			if (error instanceof Error && error.name !== 'AbortError') {
				setIsAuthorized(false);
			}
		}
	}

	return (
		<header className={cn(className, styles.header)} {...props}>
			<div className={styles.inputs_block}>
				<input
					className={styles.address}
					title="Адрес доменного контроллера"
					placeholder="address"
					value={authData.address}
					onChange={handleCahangeAuthData}
				/>
				<input
					className={styles.port}
					title="Порт подключения"
					type="number"
					placeholder="port"
					value={authData.port}
					onChange={handleCahangeAuthData}
				/>
				<input
					className={styles.login}
					title="UID пользователя"
					placeholder="login"
					value={authData.login}
					onChange={handleCahangeAuthData}
				/>
				<input
					className={styles.password}
					title="Пароль"
					type="password"
					placeholder="password"
					value={authData.password}
					onChange={handleCahangeAuthData}
				/>
			</div>
			<div className={styles.buttons_block}>
				<hr />
				<button
					title="Подключиться к каталогу"
					className={cn(styles.button_icon, { [styles.is_authorized]: isAuthorized })}
					onClick={handleSubmit}
				>
					<Link />
				</button>
				<button title="Обновить данные" className={styles.button_icon}>
					<Refresh />
				</button>
			</div>
		</header>
	);
}
