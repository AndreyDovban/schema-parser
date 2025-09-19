import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';
// import Download from '@/assets/svg/download.svg?react';
import { useEffect, type ChangeEvent, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { targetPermissionContainerStore, listPermissionsStore } from '@/store';
import type { IPermission } from '@/interfaces';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function SearchSection({ className, ...props }: SearchSectionProps) {
	const { data, request } = useRequest<IPermission[]>('/api/get_list_permissions');
	const { targetPermissionContainer, setTargetPermissionContainer } = targetPermissionContainerStore();
	const { setListPermissions } = listPermissionsStore();

	function handlerSearch() {
		if (targetPermissionContainer) {
			request({ method: 'POST', body: { baseDn: targetPermissionContainer } });
		}
	}

	useEffect(() => {
		if (data) {
			setListPermissions(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<Section className={cn(className, styles.search_block)} {...props}>
			<input
				placeholder="Search entity by distigushidName..."
				type="text"
				value={targetPermissionContainer}
				onInput={(e: ChangeEvent<HTMLInputElement>) => setTargetPermissionContainer(e.target.value)}
			/>
			<button
				onClick={handlerSearch}
				className={cn(styles.icon_button, {
					[styles.off]: !targetPermissionContainer,
				})}
			>
				<Search />
			</button>

			<span className={styles.grow}></span>
		</Section>
	);
}
