import Layout from '@/layout';
import {
	SearchSection,
	ObjectClassesSection,
	ChoosedObjectClassSection,
	AttributesSection,
	TargetAttribute,
} from './modules';
import styles from './Builder.module.css';
import { useSchemaStore } from '@/store';
import { Section } from '@/ui';

export function Builder() {
	const { schema } = useSchemaStore();

	if (!schema.attributes.length || !schema.attributes.length) {
		return (
			<Layout>
				<Section className={styles.error_message}>Данные схемы не получены</Section>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className={styles.builder_page}>
				<SearchSection className={styles.search_block} />
				<ObjectClassesSection className={styles.object_classes} />
				<ChoosedObjectClassSection className={styles.choosed_object_classes} />
				<AttributesSection className={styles.attributes} />
				<TargetAttribute className={styles.target_attribute} />
			</div>
		</Layout>
	);
}
