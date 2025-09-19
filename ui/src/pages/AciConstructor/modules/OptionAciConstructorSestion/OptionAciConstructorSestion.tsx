import { Section } from '@/ui';
import cn from 'classnames';
import styles from './OptionAciConstructorSestion.module.css';
import { type DetailedHTMLProps, type HTMLAttributes } from 'react';
import Table from '@/assets/svg/table.svg?react';
import ListUl from '@/assets/svg/list-ul.svg?react';
import { columnAciVisibleStore } from '@/store';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function OptionAciConstructorSestion({ className, ...props }: SearchSectionProps) {
	const { columnAciVisible, setColumnAciVisible } = columnAciVisibleStore();

	return (
		<Section className={cn(className, styles.options_block)} {...props}>
			<button
				className={cn(styles.icon_button, {
					[styles.active]: columnAciVisible == 'parse',
				})}
				title="Таблица с обработанными данными"
				onClick={() => setColumnAciVisible('parse')}
			>
				<Table />
			</button>
			<button
				className={cn(styles.icon_button, {
					[styles.active]: columnAciVisible == 'raw',
				})}
				title="Таблица с локацией атрибута и сырыми данными"
				onClick={() => setColumnAciVisible('raw')}
			>
				<ListUl />
			</button>
		</Section>
	);
}
