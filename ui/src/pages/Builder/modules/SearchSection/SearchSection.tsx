import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';

import type { DetailedHTMLProps, HTMLAttributes } from 'react';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function SearchSection({ className, ...props }: SearchSectionProps) {
	return (
		<Section className={cn(className, styles.search_block)} {...props}>
			<input type="text" />
			<button className={styles.icon_button}>
				<Search />
			</button>
		</Section>
	);
}
