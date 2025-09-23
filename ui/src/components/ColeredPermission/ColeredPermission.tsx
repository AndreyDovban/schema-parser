import type { HTMLAttributes, DetailedHTMLProps } from 'react';
import cn from 'classnames';
import styles from './ColeredPermission.module.css';

interface ColeredPermissionProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
	className?: string;
	rights: string;
}

export function ColeredPermission({ className, rights, ...props }: ColeredPermissionProps) {
	const arr = rights.split('');

	return (
		<span className={cn(className, styles.rights)} {...props}>
			{arr.map((el, i) => {
				return (
					<span
						key={i}
						className={cn({
							[styles.a]: el == 'a',
							[styles.d]: el == 'd',
							[styles.n]: el == 'n',
							[styles.v]: el == 'v',
						})}
					>
						{el}
					</span>
				);
			})}
		</span>
	);
}
