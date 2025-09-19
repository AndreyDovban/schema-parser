import Layout from '@/layout';
import styles from './AciConstructor.module.css';
import { SearchSection, OptionAciConstructorSestion, OutBlockSection } from './modules';

export function AciConstructor() {
	return (
		<Layout>
			<div className={styles.aci_constructor_page}>
				<SearchSection className={styles.search_block} />
				<OptionAciConstructorSestion className={styles.options_block} />
				<OutBlockSection className={styles.out_block} />
			</div>
		</Layout>
	);
}
