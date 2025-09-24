import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';
import Tree from '@/assets/svg/tree.svg?react';
import {
	useEffect,
	type ChangeEvent,
	type DetailedHTMLProps,
	type Dispatch,
	type HTMLAttributes,
	type SetStateAction,
} from 'react';
import { useRequest } from '@/hooks/useRequest';
import { buildTree } from '@/helpers';
import { nodeForCheckRightsStore, objectForCheckRightStore, scopeForCheckRightsStore } from '@/store';
import type { IEff, IEffectiveRight } from '@/interfaces';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
	setMessage: Dispatch<SetStateAction<string | undefined>>;
	setTreeDataForCheckRights: (th: IEff) => void;
}

export function SearchSection({ className, setMessage, setTreeDataForCheckRights, ...props }: SearchSectionProps) {
	const { data, error, request } = useRequest<IEffectiveRight[]>('/api/get_effective_rights');
	const { nodeForCkeckRights, setNodeForCheckRights } = nodeForCheckRightsStore();
	const { objectForCheckRights, setObjectForCheckRights } = objectForCheckRightStore();
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
			setTreeDataForCheckRights(buildTree(data));
			setMessage('');
		}
		if (error) {
			setTreeDataForCheckRights({
				dn: '',
				entry_level_rights: ',',
				attribute_level_rights: [],
				open: false,
				hashIndex: [],
			});
			setMessage(error.message);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, error]);

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
