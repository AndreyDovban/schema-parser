import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';
import { useEffect, useState, type ChangeEvent, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { useRequest } from '@/hooks/useRequest';
import {
	choosedObjectClassesStore,
	namesAttributesStore,
	requiredAttrsStore,
	targetPseudoObjectClassStore,
	useSchemaStore,
} from '@/store';
import type { IObjectClass } from '@/interfaces';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function SearchSection({ className, ...props }: SearchSectionProps) {
	const { schema } = useSchemaStore();
	const { setChoosedObjectClasses } = choosedObjectClassesStore();
	const { setNamesAttributes } = namesAttributesStore();
	const { setRequiredAttrs } = requiredAttrsStore();
	const { setTargetPseudoObjectClass } = targetPseudoObjectClassStore();

	const { data, request } = useRequest<string[]>('/api/search');
	const [value, setValue] = useState('');

	const hashObjects = schema.objectclasses.reduce((acc: Record<string, IObjectClass>, el) => {
		acc[el.NAME] = el;
		return acc;
	}, {});

	function handlerSearch() {
		if (value) {
			request({ method: 'POST', body: { baseDn: value } });
		}
	}

	useEffect(() => {
		if (data) {
			const objectClassesArr: IObjectClass[] = [];
			let namesArr: string[] = [];
			let req: string[] = [];

			for (const key in hashObjects) {
				if (data.includes(hashObjects[key].NAME.toLowerCase())) {
					objectClassesArr.push(hashObjects[key]);
				}
			}

			for (const el of objectClassesArr) {
				if (el.MUST) {
					for (const m of el.MUST) {
						namesArr.push(m);
						req.push(m);
					}
				}

				if (el.MAY) {
					for (const m of el.MAY) {
						namesArr.push(m);
					}
				}
			}

			namesArr = [...new Set(namesArr)];
			req = [...new Set(req)];
			setNamesAttributes(namesArr);
			setRequiredAttrs(req);
			setChoosedObjectClasses(objectClassesArr);
			setTargetPseudoObjectClass({ name: '', attrs: [] });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
