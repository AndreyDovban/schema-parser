import styles from './ObjectClassesSection.module.css';
import cn from 'classnames';
import { useState, type DetailedHTMLProps, type HTMLAttributes, type MouseEvent } from 'react';
import { CheckBox, DebouncedInput, Section } from '@/ui';
import type { IHashIndexObject, IObjectClass } from '@/interfaces';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	type Column,
	type ColumnFiltersState,
	type SortingState,
} from '@tanstack/react-table';
import {
	choosedObjectClassesStore,
	namesAttributesStore,
	requiredAttrsStore,
	targetAttributeStore,
	targetPseudoObjectClassStore,
	useSchemaStore,
} from '@/store';
import Close from '@/assets/svg/bun.svg?react';
import Sort from '@/assets/svg/sort.svg?react';
import SortDown from '@/assets/svg/sort-down.svg?react';
import SortUp from '@/assets/svg/sort-up.svg?react';
import Refresh from '@/assets/svg/refresh.svg?react';

interface ObjectClassesSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

const defaultData: IObjectClass[] = [];
const columnHelper = createColumnHelper<IObjectClass>();

const columns = [
	columnHelper.accessor('NAME', {
		id: 'NAME',
		header: () => 'Название',
		cell: info => info.getValue(),
		filterFn: 'includesString',
	}),
];

function Filter({ column }: { column: Column<IObjectClass, unknown> }) {
	const columnFilterValue = column.getFilterValue();
	const { filterVariant } = column.columnDef.meta ?? {};

	if (filterVariant == 'select') {
		return (
			<select onChange={e => column.setFilterValue(e.target.value)} value={columnFilterValue?.toString()}>
				{/* See faceted column filters example for dynamic select options */}
				<option value=""></option>
				<option value="true">✓</option>
				<option value="false">✗</option>
			</select>
		);
	}

	return (
		<DebouncedInput
			onChange={value => column.setFilterValue(value)}
			placeholder={`Search...`}
			type="text"
			value={(columnFilterValue ?? '') as string}
		/>
	);
}

export function ObjectClassesSection({ className, ...props }: ObjectClassesSectionProps) {
	const { schema } = useSchemaStore();
	const { choosedObjectClasses, setChoosedObjectClasses } = choosedObjectClassesStore();
	const { setNamesAttributes } = namesAttributesStore();
	const { setTargetAttribute } = targetAttributeStore();
	const { setRequiredAttrs } = requiredAttrsStore();
	const { setTargetPseudoObjectClass } = targetPseudoObjectClassStore();

	const hashObjects = schema.objectclasses.reduce((acc: Record<string, IObjectClass>, el) => {
		acc[el.NAME] = el;
		return acc;
	}, {});

	function getAllSupers(name: string): string[] {
		const result: string[] = [];
		if (hashObjects[name]['SUP']) {
			result.push(hashObjects[name]['SUP'], ...getAllSupers(hashObjects[name]['SUP']));
		}

		return result;
	}

	const hashShcema = schema.objectclasses.reduce((acc: Record<string, IHashIndexObject>, el) => {
		acc[el.NAME] = {
			attrs: [],
			supers: getAllSupers(el.NAME),
		};
		return acc;
	}, {});

	const [sorting, setSorting] = useState<SortingState>([]); // Внутреннее состояние компонента объект сортиовка
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	// Объект таблица
	const table = useReactTable({
		data: schema ? schema.objectclasses : defaultData,
		columns,
		filterFns: {},
		state: {
			columnFilters,
			sorting,
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
	});

	if (!schema.attributes.length || !schema.attributes.length) {
		return <Section className={styles.error_message}>Данные схемы не получены</Section>;
	}

	function handleChooseObj(objcl: IObjectClass) {
		let objectClassesArr: IObjectClass[] = [];
		let namesArr: string[] = [];
		let req: string[] = [];

		if (choosedObjectClasses.includes(objcl)) {
			objectClassesArr = [...choosedObjectClasses].filter((el: IObjectClass) => el != objcl);
			const toDeleteChildten: string[] = [];
			for (const el of objectClassesArr) {
				if (hashShcema[el.NAME].supers.includes(objcl.NAME)) {
					toDeleteChildten.push(el.NAME);
				}
			}
			objectClassesArr = objectClassesArr.filter((el: IObjectClass) => !toDeleteChildten.includes(el.NAME));
		} else {
			const arr = [objcl];
			for (const el of hashShcema[objcl.NAME].supers) {
				if (!choosedObjectClasses.includes(hashObjects[el])) {
					arr.push(hashObjects[el]);
				}
			}
			objectClassesArr = [...choosedObjectClasses, ...arr];
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

	function handleClearChoose(e: MouseEvent) {
		e.stopPropagation();
		setChoosedObjectClasses([]);
		setNamesAttributes([]);
		setTargetAttribute(undefined);
		setTargetPseudoObjectClass({ name: '', attrs: [] });
	}

	// Функция сброса фильтрации
	function handleClearFilter(e: MouseEvent, column: Column<IObjectClass, unknown>) {
		e.stopPropagation();
		column.setFilterValue(undefined);
	}

	return (
		<Section className={cn(className, styles.object_classes_section)} {...props}>
			<table className={styles.table}>
				<thead className={styles.thead}>
					{table.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id} className={styles.tr}>
							{headerGroup.headers.map(header => {
								return (
									<th key={header.id} className={styles.th}>
										{header.isPlaceholder ? null : (
											<div
												className={styles.thblock}
												onClick={header.column.getToggleSortingHandler()}
												title={
													header.column.getCanSort()
														? header.column.getNextSortingOrder() === 'asc'
															? 'Sort ascending'
															: header.column.getNextSortingOrder() === 'desc'
															? 'Sort descending'
															: 'Clear sort'
														: undefined
												}
											>
												<span title="Поиск объекта класса">
													{header.column.getCanFilter() ? (
														<span onClick={e => e.stopPropagation()}>
															<Filter column={header.column} />
														</span>
													) : null}
												</span>

												<button
													title="Очистить фильтр"
													onClick={e => handleClearFilter(e, header.column)}
													className={cn(styles.icon_button, {
														[styles.active]: header.column.getFilterValue(),
													})}
												>
													<Close />
												</button>

												<button
													title="Сортировать по названию"
													className={cn(styles.icon_button, {
														[styles.active]: header.column.getIsSorted(),
													})}
												>
													{{
														asc: <SortDown />,
														desc: <SortUp />,
													}[header.column.getIsSorted() as string] ?? <Sort />}
												</button>

												<button
													title="Сбросить набор объект классов"
													className={styles.icon_button}
													onClick={handleClearChoose}
												>
													<Refresh />
												</button>
											</div>
										)}
									</th>
								);
							})}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map(row => {
						return (
							<tr key={row.id} className={styles.tr}>
								{row.getVisibleCells().map(cell => {
									const v = cell.getValue();
									return (
										<td
											title={v as string}
											key={cell.id}
											className={styles.td}
											// onClick={() => setFilterByCell(cell.column.id, v as string)}
										>
											<label className={styles.object_class}>
												<CheckBox
													checked={choosedObjectClasses.includes(cell.row.original)}
													onChange={() => handleChooseObj(cell.row.original)}
												/>
												<span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
											</label>
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</Section>
	);
}
