import styles from './LdapBrowser.module.css';
import Layout from '@/layout';
import { SearchSection, EntriesTableSection, TreeEntriesSection, OneEntrySection } from './modules';

export function LdapBrowser() {
	return (
		<Layout>
			<div className={styles.ldap_browser}>
				<SearchSection className={styles.search_block} />
				<TreeEntriesSection className={styles.tree_block} />
				<EntriesTableSection className={styles.entries_table_block} />
				<OneEntrySection className={styles.one_entry_block} />
			</div>
		</Layout>
	);
}
