import styles from './Select.module.css';
import cn from 'classnames';
import type { DetailedHTMLProps, SelectHTMLAttributes } from 'react';

interface SelectProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
	className?: string;
	items: string[];
}

export function Select({ className, items, ...props }: SelectProps) {
	return (
		<select className={cn(className, styles.select)} {...props}>
			{items.map((el, i) => {
				return <option key={i}>{el}</option>;
			})}
		</select>
	);
}
