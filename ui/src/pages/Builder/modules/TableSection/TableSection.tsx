import styles from './TableSection.module.css';
import { Section } from '@/ui';

export function TableSection() {
	return (
		<Section className={styles.table_section} classNameContent={styles.content}>
			<h1>content</h1>
		</Section>
	);
}
