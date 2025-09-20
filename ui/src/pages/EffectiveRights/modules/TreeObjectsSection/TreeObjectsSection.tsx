import cn from 'classnames';
import styles from './TreeObjectsSection.module.css';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Section } from '@/ui';
import { outDataForCheckRightStore } from '@/store';

interface TreeObjectsSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function TreeObjectsSection({ className, ...props }: TreeObjectsSectionProps) {
	const { outDataForCheckRights } = outDataForCheckRightStore();

	return (
		<Section className={cn(className, styles.tree_section)} {...props}>
			<pre>{JSON.stringify(outDataForCheckRights, null, 4)}</pre>
		</Section>
	);
}
