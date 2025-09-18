import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';
// import Download from '@/assets/svg/download.svg?react';
import { useEffect, type ChangeEvent, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { targetEntityForAciStore, listAciEntityStore } from '@/store';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function SearchSection({ className, ...props }: SearchSectionProps) {
	const { data, request } = useRequest<string[]>('/api/get_aci_for_entity');
	const { targetEntityForAci, setTargetEntityForAci } = targetEntityForAciStore();
	const { setListAciEntity } = listAciEntityStore();

	function handlerSearch() {
		if (targetEntityForAci) {
			request({ method: 'POST', body: { baseDn: targetEntityForAci } });
		}
	}

	useEffect(() => {
		if (data) {
			setListAciEntity(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<Section className={cn(className, styles.search_block)} {...props}>
			<input
				placeholder="Search entity by distigushidName..."
				type="text"
				value={targetEntityForAci}
				onInput={(e: ChangeEvent<HTMLInputElement>) => setTargetEntityForAci(e.target.value)}
			/>
			<button
				onClick={handlerSearch}
				className={cn(styles.icon_button, {
					[styles.off]: !targetEntityForAci,
				})}
			>
				<Search />
			</button>
			{/* <input
				placeholder="Search entity by distigushidName..."
				type="text"
				value={targetEntity}
				onInput={(e: ChangeEvent<HTMLInputElement>) => setTargetEntity(e.target.value)}
			/>
			<button
				onClick={handlerSearch}
				className={cn(styles.icon_button, {
					[styles.off]: !targetEntity,
				})}
			>
				<Search />
			</button> */}
			<span className={styles.grow}></span>
		</Section>
	);
}
