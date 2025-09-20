import Layout from '@/layout';
import styles from './EffectiveRights.module.css';
import { SearchSection, TreeObjectsSection } from './modules';

export function EffectiveRights() {
	return (
		<Layout>
			<div className={styles.effective_rights_page}>
				<SearchSection className={styles.search_block} />
				<TreeObjectsSection className={styles.out_block} />
			</div>
		</Layout>
	);
}
