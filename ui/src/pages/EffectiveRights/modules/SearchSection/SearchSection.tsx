import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';
import { useEffect, type ChangeEvent, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { nodeForCheckRightsStore, objectForCheckRightStore, outDataForCheckRightStore } from '@/store';
import type { IEffectiveRight } from '@/interfaces';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function SearchSection({ className, ...props }: SearchSectionProps) {
	const { data, request } = useRequest<IEffectiveRight[]>('/api/get_effective_rights');
	const { nodeForCkeckRights, setNodeForCheckRights } = nodeForCheckRightsStore();
	const { objectForCheckRights, setObjectForCheckRights } = objectForCheckRightStore();
	const { setOutDataForCheckRights } = outDataForCheckRightStore();

	function handlerSearch() {
		request({ method: 'POST', body: { baseDn: nodeForCkeckRights, objectsForCheckRights: objectForCheckRights } });
	}

	useEffect(() => {
		if (data) {
			setOutDataForCheckRights(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<Section className={cn(className, styles.search_block)} {...props}>
			<div className={styles.inputs_block}>
				<span>Узел объект проверки</span>
				<input
					placeholder="Enter target node in to tree..."
					type="text"
					value={nodeForCkeckRights}
					onInput={(e: ChangeEvent<HTMLInputElement>) => setNodeForCheckRights(e.target.value)}
				/>
				<span>Субъект проверки</span>
				<input
					placeholder="Enter obgect for check rights..."
					type="text"
					value={objectForCheckRights}
					onInput={(e: ChangeEvent<HTMLInputElement>) => setObjectForCheckRights(e.target.value)}
				/>
			</div>
			<button
				onClick={handlerSearch}
				className={cn(styles.icon_button, {
					[styles.off]: !nodeForCkeckRights || !objectForCheckRights,
				})}
			>
				<Search />
			</button>
		</Section>
	);
}
