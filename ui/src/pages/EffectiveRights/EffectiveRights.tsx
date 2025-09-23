import Layout from '@/layout';
import styles from './EffectiveRights.module.css';
import { SearchSection, TreeObjectsSection, AttributeRightsSection } from './modules';

export function EffectiveRights() {
	return (
		<Layout>
			<div className={styles.effective_rights_page}>
				<SearchSection className={styles.search_block} />
				<TreeObjectsSection className={styles.tree_block} />
				<AttributeRightsSection className={styles.attribute_right_block} />
			</div>
		</Layout>
	);
}
