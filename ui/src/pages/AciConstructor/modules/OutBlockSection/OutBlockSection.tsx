import { DebouncedInput, Section } from '@/ui';
import cn from 'classnames';
import styles from './OutBlockSection.module.css';
import { type MouseEvent, useState, type DetailedHTMLProps, type HTMLAttributes } from 'react';
import Close from '@/assets/svg/close.svg?react';
import Sort from '@/assets/svg/sort.svg?react';
import SortDown from '@/assets/svg/sort-down.svg?react';
import SortUp from '@/assets/svg/sort-up.svg?react';
import { listAciEntityStore } from '@/store';
import type { IAciForEntity } from '@/interfaces';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	type Column,
	type ColumnFiltersState,
	type RowData,
	type SortingState,
} from '@tanstack/react-table';

interface SearchSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

declare module '@tanstack/react-table' {
	//allows us to define custom properties for our columns
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: 'text' | 'range' | 'select';
	}
}

const defaultData: IAciForEntity[] = [];
const columnHelper = createColumnHelper<IAciForEntity>();

const columns = [
	columnHelper.accessor('acl', {
		id: 'acl',
		header: () => 'Название',
		cell: info => info.renderValue(),
		sortingFn: 'textCaseSensitive',
		filterFn: 'includesString',
	}),
	// columnHelper.accessor('version', {
	// 	header: () => 'Версия',
	// 	cell: info => info.renderValue(),
	// 	sortingFn: 'textCaseSensitive',
	// 	filterFn: 'includesString',
	// }),
	columnHelper.accessor('allow', {
		header: () => 'Предоставленные права',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
	columnHelper.accessor('target', {
		header: () => 'Целевой узел',
		cell: info => info.renderValue(),
		sortingFn: 'textCaseSensitive',
		filterFn: 'includesString',
	}),
	columnHelper.accessor('targetattr', {
		header: () => 'Действующие атрибуты',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
];

function Filter({ column }: { column: Column<IAciForEntity, unknown> }) {
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

export function OutBlockSection({ className, ...props }: SearchSectionProps) {
	const { listAciEntity } = listAciEntityStore();
	const [columnOrder] = useState(['Acl', 'Version', 'Allow', 'Target', 'Targetattr']);
	const [sorting, setSorting] = useState<SortingState>([]); // Внутреннее состояние компонента объект сортиовка
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	// Объект таблица
	const table = useReactTable({
		data: listAciEntity ? listAciEntity : defaultData,
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
	function clearFilter(e: MouseEvent, column: Column<IAciForEntity, unknown>) {
		e.stopPropagation();
		column.setFilterValue(undefined);
	}

	// Функция установки фильтра по клику на ячейку
	function setFilterByCell(column_id: string, value: string) {
		table.getColumn(column_id)?.setFilterValue(value);
	}

	if (!listAciEntity.length) {
		return <Section className={styles.error_message}>Данные aci не получены</Section>;
	}

	return (
		<Section className={cn(className, styles.table_section)} {...props}>
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
