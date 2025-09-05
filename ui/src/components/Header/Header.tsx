import styles from './Header.module.css';
import cn from 'classnames';
import { useEffect, type ChangeEvent, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import Tower from '@/assets/svg/tower.svg?react';
import Refresh from '@/assets/svg/refresh.svg?react';
import { useIsAithorizedStore, useSchemaStore, authDataStore } from '@/store';
import type { ISchema } from '@/interfaces';
import { useRequest } from '@/hooks/useRequest';

interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function Header({ className, ...props }: HeaderProps) {
	const { isAuthorized, setIsAuthorized } = useIsAithorizedStore();
	const { data, error, request } = useRequest<ISchema>('/api/schema'); // Хук запроса к серверу
	const { setSchema } = useSchemaStore();
	const { authData, setAuthData } = authDataStore();

	function handleCahangeAuthData(e: ChangeEvent<HTMLInputElement>) {
		setAuthData({ ...authData, [e.target.placeholder]: e.target.value });
		setIsAuthorized(false);
	}

	// Функция отправки данных авторизации
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

	// Функция обновления данных
	function handleRefresh() {
		if (isAuthorized) {
			request();
		}
	}

	useEffect(() => {
		if (data && data.attributes) {
			setSchema(data);
		}
	}, [data, setSchema, error]);

	// В эффекте выводится инвормаци ответа сервере
	// useEffect(() => {
	// 	if (info) {
	// 		console.log('INFO', info);
	// 	}
	// }, [info]);

	// Вывод лоадера при ожидании ответа
	// if (loading) {
	// 	console.log('Загрузка');
	// 	<Section className={styles.table_section}>LOADING...</Section>;
	// }

	// Вывод инфорамции об ошибке
	// if (error) {
	// 	return <Section className={styles.table_section}>Ошибка: {error.message}</Section>;
	// }

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
					<Tower />
				</button>
				<button
					title="Обновить данные"
					className={cn(styles.button_icon, {
						['off']: !isAuthorized,
						[styles.off]: !isAuthorized,
					})}
					onClick={handleRefresh}
				>
					<Refresh />
				</button>
			</div>
		</header>
	);
}
