import cn from 'classnames';
import styles from './OneEntrySection.module.css';
import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { Section } from '@/ui';
import { targetEntryStore } from '@/store';
import { useRequest } from '@/hooks/useRequest';
import type { IEntryInCatalog } from '@/interfaces';

interface OneEntrySectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function OneEntrySection({ className, ...props }: OneEntrySectionProps) {
	const { targetEntry } = targetEntryStore();
	const { data, request } = useRequest<IEntryInCatalog>('/api/get_target_entry');

	useEffect(() => {
		if (targetEntry) {
			request({
				method: 'POST',
				body: { baseDn: targetEntry },
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [targetEntry]);

	useEffect(() => {
		if (data) {
			console.log(data);
		}
	}, [data]);

	return (
		<Section className={cn(className, styles.one_entry_section)} {...props}>
			<pre>{targetEntry && data && data.dn && JSON.stringify(data, null, 4)}</pre>
		</Section>
	);
}
