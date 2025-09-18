import { Section } from '@/ui';
import cn from 'classnames';
import styles from './OutBlockSection.module.css';
import { type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { listAciEntityStore } from '@/store';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function OutBlockSection({ className, ...props }: SearchSectionProps) {
	const { listAciEntity } = listAciEntityStore();

	return (
		<Section className={cn(className, styles.search_block)} {...props}>
			<pre>{JSON.stringify(listAciEntity, null, 4)}</pre>
		</Section>
	);
}
