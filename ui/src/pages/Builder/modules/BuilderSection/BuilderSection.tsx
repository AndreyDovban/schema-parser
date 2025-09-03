import styles from './BuilderSection.module.css';
import cn from 'classnames';
import { CheckBox, DebouncedInput, Section } from '@/ui';
import { useSchemaStore } from '@/store/useSchemaStore';
import { choosedObjectClassesStore, targetAttributeStore, namesAttributesStore } from '@/store';
import type { IObjectClass, IAttribute } from '@/interfaces';
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
import { useState } from 'react';
import Close from '@/assets/svg/bun.svg?react';
import Sort from '@/assets/svg/sort.svg?react';
import SortDown from '@/assets/svg/sort-down.svg?react';
import SortUp from '@/assets/svg/sort-up.svg?react';
import Refresh from '@/assets/svg/refresh.svg?react';
import { type MouseEvent } from 'react';

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

export function BuilderSection() {
	const { schema } = useSchemaStore();
	const { choosedObjectClasses, setChoosedObjectClasses } = choosedObjectClassesStore();
	const { namesAttributes, setNamesAttributes } = namesAttributesStore();
	const { targetAttribute, setTargetAttribute } = targetAttributeStore();

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

		// console.log(objcl.SUP);
		if (choosedObjectClasses.includes(objcl)) {
			objectClassesArr = [...choosedObjectClasses].filter((el: IObjectClass) => el != objcl);
		} else {
			objectClassesArr = [...choosedObjectClasses, objcl];
		}

		for (const el of objectClassesArr) {
			if (el.MUST) {
				for (const m of el.MUST) {
					namesArr.push(m);
				}
			}

			if (el.MAY) {
				for (const m of el.MAY) {
					namesArr.push(m);
				}
			}
		}

		namesArr = [...new Set(namesArr)];
		setNamesAttributes(namesArr);

		setChoosedObjectClasses(objectClassesArr);
	}

	function handleClearChoose(e: MouseEvent) {
		e.stopPropagation();
		setChoosedObjectClasses([]);
		setNamesAttributes([]);
		setTargetAttribute(undefined);
	}

	function handleChooseAttribute(attribute: IAttribute) {
		setTargetAttribute(attribute);
	}

	// Функция сброса фильтрации
	function clearFilter(e: MouseEvent, column: Column<IObjectClass, unknown>) {
		e.stopPropagation();
		column.setFilterValue(undefined);
	}

	return (
		<Section className={styles.table_section}>
			<div className={styles.object_classes}>
				{/* <button className={styles.clear} onClick={handleClearChoose}>
					очистить
				</button> */}
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
														title="Очистить фильтр"
														onClick={e => clearFilter(e, header.column)}
														className={cn(styles.icon_button, {
															[styles.active]: header.column.getFilterValue(),
														})}
													>
														<Close />
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
													<span>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</span>
												</label>
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className={styles.tree_object_classes}>
				{choosedObjectClasses.map((el, i) => {
					return (
						<div key={i} className={styles.tree_object_class}>
							{el.NAME}
						</div>
					);
				})}
			</div>

			<div className={styles.attributes}>
				{schema.attributes.map((el, i) => {
					for (const n of el.NAME) {
						if (namesAttributes.includes(n)) {
							return (
								<button onClick={() => handleChooseAttribute(el)} key={i} className={styles.attribute}>
									{el.NAME}
								</button>
							);
						}
					}
				})}
			</div>

			<div className={styles.out_attribute}>
				{targetAttribute && <pre>{JSON.stringify(targetAttribute, null, 4)}</pre>}
			</div>
		</Section>
	);
}
