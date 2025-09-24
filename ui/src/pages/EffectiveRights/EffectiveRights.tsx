import Layout from '@/layout';
import styles from './EffectiveRights.module.css';
import { SearchSection, TreeObjectsSection, AttributeRightsSection } from './modules';
import { useState } from 'react';
import { Section } from '@/ui';
import { treeDataForCheckRightsStore } from '@/store';

export function EffectiveRights() {
	const [message, setMessage] = useState<string>();
	const { treeDataForCheckRights, setTreeDataForCheckRights } = treeDataForCheckRightsStore();

	return (
		<Layout>
			<div className={styles.effective_rights_page}>
				<SearchSection
					className={styles.search_block}
					setMessage={setMessage}
					setTreeDataForCheckRights={setTreeDataForCheckRights}
				/>
				{message ? (
					<Section className={styles.error_message}>{message}</Section>
				) : Object.keys(treeDataForCheckRights).length < 6 ? (
					<Section className={styles.error_message}>Данные списка разрешений не получены</Section>
				) : (
					<>
						<TreeObjectsSection className={styles.tree_block} />
						<AttributeRightsSection className={styles.attribute_right_block} />
					</>
				)}
			</div>
		</Layout>
	);
}
