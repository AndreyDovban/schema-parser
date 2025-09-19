import Layout from '@/layout';
import styles from './Permission.module.css';
import { PermissionsTableSection, SearchSection } from './modules';

export function Permissions() {
	return (
		<Layout>
			<div className={styles.permission_page}>
				<SearchSection className={styles.search_block} />
				<PermissionsTableSection className={styles.out_block} />
			</div>
		</Layout>
	);
}
