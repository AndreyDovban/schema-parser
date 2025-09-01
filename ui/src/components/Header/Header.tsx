import styles from './Header.module.css';
import cn from 'classnames';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function Header({ className, ...props }: HeaderProps) {
	return (
		<header className={cn(className, styles.header)} {...props}>
			<span>1</span>
			<span>1</span>
			<span>1</span>
		</header>
	);
}
