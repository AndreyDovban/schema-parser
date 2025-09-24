import cn from 'classnames';
import styles from './EntriesTableSection.module.css';
import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { Section } from '@/ui';
import { targetContainerStore } from '@/store';
import { useRequest } from '@/hooks/useRequest';

interface EntriesTableSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function EntriesTableSection({ className, ...props }: EntriesTableSectionProps) {
	const { targetContainer } = targetContainerStore();
	const { data, request } = useRequest<string>('/api/show_children_container');

	useEffect(() => {
		if (targetContainer) {
			request({
				method: 'POST',
				body: {
					baseDn: targetContainer,
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [targetContainer]);

	return (
		<Section
			className={cn(className, styles.entries_table_section_section, {
				[styles.hide]: !data,
			})}
			{...props}
		>
			{targetContainer}
			<pre>{data && JSON.stringify(data, null, 4)}</pre>
		</Section>
	);
}
