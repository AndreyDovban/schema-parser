import { Section } from '@/ui';
import cn from 'classnames';
import styles from './SearchSection.module.css';
import Search from '@/assets/svg/search.svg?react';
import Download from '@/assets/svg/download.svg?react';
import { useEffect, type ChangeEvent, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import { useRequest } from '@/hooks/useRequest';
import {
	choosedObjectClassesStore,
	namesAttributesStore,
	requiredAttrsStore,
	targetPseudoObjectClassStore,
	useSchemaStore,
	targetEntityStore,
} from '@/store';
import type { IObjectClass } from '@/interfaces';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

export function SearchSection({ className, ...props }: SearchSectionProps) {
	const { schema } = useSchemaStore();
	const { setChoosedObjectClasses } = choosedObjectClassesStore();
	const { namesAttributes, setNamesAttributes } = namesAttributesStore();
	const { setRequiredAttrs } = requiredAttrsStore();
	const { setTargetPseudoObjectClass } = targetPseudoObjectClassStore();

	const { data, request } = useRequest<string[]>('/api/search');
	const { targetEntity, setTargetEntity } = targetEntityStore();

	const hashObjects = schema.objectclasses.reduce((acc: Record<string, IObjectClass>, el) => {
		acc[el.NAME] = el;
		return acc;
	}, {});

	function handlerSearch() {
		if (targetEntity) {
			request({ method: 'POST', body: { baseDn: targetEntity } });
		}
	}

	function handlerDownload() {
		const result = namesAttributes.sort().reduce((acc: [string, boolean][], el, i) => {
			for (const at of schema.attributes) {
				if (at.NAME.includes(el)) {
					acc[i] = [el, at.SINGLE_VALUE];
				}
			}

			return acc;
		}, []);
		const file = new File([JSON.stringify(result, null, 4)], `${targetEntity}.json`, {
			type: 'application/json',
		});

		const link = document.createElement('a');
		link.download = file.name;

		link.href = URL.createObjectURL(file);
		link.click();
		URL.revokeObjectURL(link.href);
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
				value={targetEntity}
				onInput={(e: ChangeEvent<HTMLInputElement>) => setTargetEntity(e.target.value)}
			/>
			<button
				title="просмотр объект классов выбранной записи"
				onClick={handlerSearch}
				className={cn(styles.icon_button, {
					[styles.off]: !targetEntity,
				})}
			>
				<Search />
			</button>
			<span className={styles.grow}></span>
			<button
				title="скачать файл с возможными атрибутами найденной записи"
				onClick={handlerDownload}
				className={cn(styles.icon_button, {
					[styles.off]: !targetEntity,
				})}
			>
				<Download />
			</button>
		</Section>
	);
}
