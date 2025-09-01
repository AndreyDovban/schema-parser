import cn from 'classnames';
import styles from './Nav.module.css';

import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Link } from 'react-router';

interface NavProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function Nav({ className, ...props }: NavProps) {
	return (
		<nav className={cn(className, styles.nav)} {...props}>
			<Link to="/attributes">A</Link>
			<Link to="/objectclasses">J</Link>
			<Link to="/builder">C</Link>
		</nav>
	);
}
