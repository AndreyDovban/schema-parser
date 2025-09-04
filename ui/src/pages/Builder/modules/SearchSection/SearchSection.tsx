import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';
import { useEffect, useState, type ChangeEvent, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { useRequest } from '@/hooks/useRequest';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function SearchSection({ className, ...props }: SearchSectionProps) {
	const { data, request } = useRequest('/api/search');
	const [value, setValue] = useState('');

	function handlerSearch() {
		if (value) {
			request({ method: 'POST', body: { baseDn: value } });
		}
	}

	useEffect(() => {
		if (data) {
			console.log(data);
		}
	}, [data]);

	return (
		<Section className={cn(className, styles.search_block)} {...props}>
			<input
				placeholder="Search entity by distigushidName..."
				type="text"
				value={value}
				onInput={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
			/>
			<button
				onClick={handlerSearch}
				className={cn(styles.icon_button, {
					[styles.off]: !value,
				})}
			>
				<Search />
			</button>
		</Section>
	);
}
