import styles from './ObjectClassTableSection.module.css';
import { Section, DebouncedInput } from '@/ui';
import { type MouseEvent, useState } from 'react';
import {
	createColumnHelper,
	flexRender,
	type RowData,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	getFilteredRowModel,
	useReactTable,
	type ColumnFiltersState,
	type Column,
} from '@tanstack/react-table';
import type { IObjectClass } from '@/interfaces';
import Close from '@/assets/svg/close.svg?react';
import Sort from '@/assets/svg/sort.svg?react';
import SortDown from '@/assets/svg/sort-down.svg?react';
import SortUp from '@/assets/svg/sort-up.svg?react';
import { useSchemaStore } from '@/store/schema/useSchemaStore';

declare module '@tanstack/react-table' {
	//allows us to define custom properties for our columns
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: 'text' | 'range' | 'select';
	}
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
	columnHelper.accessor('MUST', {
		id: 'MUST',
		header: () => 'Обязательные атрибуты',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
	columnHelper.accessor('MAY', {
		id: 'MAY',
		header: () => 'Необязательные атрибуты',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
	columnHelper.accessor('SUP', {
		header: () => 'Супер объект класс',
		cell: info => info.renderValue(),
		sortingFn: 'textCaseSensitive',
		filterFn: 'includesString',
	}),
	columnHelper.accessor('STRUCTURAL', {
		header: () => 'Структурный',
		cell: ({ getValue }) => (getValue() ? '✓' : '✗'),
		// sortingFn: 'textCaseSensitive',
		filterFn: 'includesString',
		meta: {
			filterVariant: 'select',
		},
	}),
	columnHelper.accessor('DESC', {
		header: () => 'Описание',
		cell: info => info.getValue(),
		sortingFn: 'textCaseSensitive',
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

export function ObjectClassTableSection() {
	const { schema } = useSchemaStore();
	const [columnOrder] = useState(['NAME', 'SINGLE_VALUE', 'USAGE', 'DESC']);
	const [sorting, setSorting] = useState<SortingState>([]); // Внутреннее состояние компонента объект сортиовка
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	// Объект таблица
	const table = useReactTable({
		data: schema ? schema.objectclasses : defaultData,
		columns,
		filterFns: {},
		state: {
			columnOrder,
			columnFilters,
			sorting,
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
	});

	// Функция сброса фильтрации
	function clearFilter(e: MouseEvent, column: Column<IObjectClass, unknown>) {
		e.stopPropagation();
		column.setFilterValue(undefined);
	}

	// Функция установки фильтра по клику на ячейку
	function setFilterByCell(column_id: string, value: string) {
		table.getColumn(column_id)?.setFilterValue(value);
	}

	if (!schema.attributes.length) {
		return <Section className={styles.error_message}>Данные схемы не получены</Section>;
	}

	return (
		<Section className={styles.table_section}>
			<div className={styles.table_wrap}>
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
													<span>
														{flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
													</span>

													<button className={styles.icon_button}>
														{{
															asc: <SortDown />,
															desc: <SortUp />,
														}[header.column.getIsSorted() as string] ?? <Sort />}
													</button>

													<span>
														{header.column.getCanFilter() ? (
															<span onClick={e => e.stopPropagation()}>
																<Filter column={header.column} />
															</span>
														) : null}
													</span>

													{header.column.getFilterValue() != undefined ? (
														<button
															onClick={e => clearFilter(e, header.column)}
															className={styles.icon_button}
														>
															<Close />
														</button>
													) : null}
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
												title={typeof v != 'boolean' ? (v as string) : ''}
												key={cell.id}
												className={styles.td}
												onClick={() => setFilterByCell(cell.column.id, v as string)}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</Section>
	);
}
