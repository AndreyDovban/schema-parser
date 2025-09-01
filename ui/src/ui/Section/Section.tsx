import styles from './Section.module.css';
import cn from 'classnames';

import type { HTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

interface SectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	children?: ReactNode;
	className?: string;
}

export function Section({ className, children, ...props }: SectionProps) {
	return (
		<section className={cn(className, styles.section)} {...props}>
			{children}
		</section>
	);
}
