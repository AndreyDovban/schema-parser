import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';
import {
	useEffect,
	// useEffect,
	// type ChangeEvent,
	type DetailedHTMLProps,
	type HTMLAttributes,
} from 'react';
import { useRequest } from '@/hooks/useRequest';
import { buildCatalogTree } from '@/helpers';
import { treeCatalogStore } from '@/store';
import type { IEntryInCatalog } from '@/interfaces';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function SearchSection({ className, ...props }: SearchSectionProps) {
	const { data, request } = useRequest<IEntryInCatalog[]>('/api/show_ldap_catalog');
	const { setTreeCatalog } = treeCatalogStore();

	function handlerSearch() {
		request({
			method: 'POST',
			body: {
				baseDn: 'dc=granulex,dc=test',
			},
		});
	}

	useEffect(() => {
		if (data) {
			setTreeCatalog(buildCatalogTree(data));
		}
		// if (error) {
		// 	setTreeDataForCheckRights({
		// 		dn: '',
		// 		entry_level_rights: ',',
		// 		attribute_level_rights: [],
		// 		open: false,
		// 		hashIndex: [],
		// 	});

		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<Section className={cn(className, styles.search_block)} {...props}>
			<input
				placeholder="Show ldap catalog..."
				type="text"
				// value={targetEntityForAci}
				// onInput={(e: ChangeEvent<HTMLInputElement>) => setTargetEntityForAci(e.target.value)}
			/>
			<button
				title="просмотр дерева каталога исключая записи нижнего уровны"
				onClick={handlerSearch}
				className={cn(styles.icon_button, {
					// [styles.off]: !targetEntityForAci,
				})}
			>
				<Search />
			</button>
			<span className={styles.grow}></span>
		</Section>
	);
}
