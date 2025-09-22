import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';
import Tree from '@/assets/svg/tree.svg?react';
import { useEffect, type ChangeEvent, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { useRequest } from '@/hooks/useRequest';
import {
	nodeForCheckRightsStore,
	objectForCheckRightStore,
	outDataForCheckRightStore,
	scopeForCheckRightsStore,
} from '@/store';
import type { IEffectiveRight } from '@/interfaces';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function SearchSection({ className, ...props }: SearchSectionProps) {
	const { data, request } = useRequest<IEffectiveRight[]>('/api/get_effective_rights');
	const { nodeForCkeckRights, setNodeForCheckRights } = nodeForCheckRightsStore();
	const { objectForCheckRights, setObjectForCheckRights } = objectForCheckRightStore();
	const { setOutDataForCheckRights } = outDataForCheckRightStore();
	const { scopeForCheckRights, setScopeForCheckRights } = scopeForCheckRightsStore();

	function handlerSearch() {
		request({
			method: 'POST',
			body: {
				baseDn: nodeForCkeckRights,
				objectsForCheckRights: objectForCheckRights,
				scopeForCheckRights: scopeForCheckRights,
			},
		});
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
			<hr />
			<button
				title="просмотр прав субъекта на указанную запись каталога"
				onClick={handlerSearch}
				className={cn(styles.icon_button, {
					[styles.off]: !nodeForCkeckRights || !objectForCheckRights,
				})}
			>
				<Search />
			</button>
			<button
				title="режим просмотра поддерева"
				onClick={() => setScopeForCheckRights(!scopeForCheckRights)}
				className={cn(styles.icon_button, {
					[styles.active]: scopeForCheckRights,
				})}
			>
				<Tree />
			</button>
		</Section>
	);
}
