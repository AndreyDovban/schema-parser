import styles from './PermissionsTableSection.module.css';
import cn from 'classnames';
import { Section, DebouncedInput } from '@/ui';
import { type DetailedHTMLProps, type HTMLAttributes, type MouseEvent, useState } from 'react';
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
import type { IPermission } from '@/interfaces';
import Close from '@/assets/svg/close.svg?react';
import Sort from '@/assets/svg/sort.svg?react';
import SortDown from '@/assets/svg/sort-down.svg?react';
import SortUp from '@/assets/svg/sort-up.svg?react';
import { listPermissionsStore } from '@/store';

interface OutBlockSectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
}

declare module '@tanstack/react-table' {
	//allows us to define custom properties for our columns
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: 'text' | 'range' | 'select';
	}
}

const defaultData: IPermission[] = [];
const columnHelper = createColumnHelper<IPermission>();

const columns = [
	columnHelper.accessor('cn', {
		header: () => 'Название',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
	columnHelper.accessor('ipa_perm_bind_rule_type', {
		header: () => 'ipa_perm_bind_rule_type',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
	columnHelper.accessor('ipa_perm_included_attr', {
		header: () => 'ipa_perm_included_attr',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
	columnHelper.accessor('ipa_perm_location', {
		header: () => 'ipa_perm_location',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
	columnHelper.accessor('ipa_perm_right', {
		header: () => 'ipa_perm_right',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
	columnHelper.accessor('ipa_perm_target', {
		header: () => 'ipa_perm_target',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
	columnHelper.accessor('ipa_permission_type', {
		header: () => 'ipa_permission_type',
		cell: info => {
			if (info.getValue()) {
				return info.getValue().join('\n');
			}
			return info.getValue();
		},
		filterFn: 'includesString',
	}),
];

function Filter({ column }: { column: Column<IPermission, unknown> }) {
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

export function PermissionsTableSection({ className, ...props }: OutBlockSectionProps) {
	const { listPermissions } = listPermissionsStore();
	const [columnOrder] = useState(['cn']);
	const [sorting, setSorting] = useState<SortingState>([]); // Внутреннее состояние компонента объект сортиовка
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	// Объект таблица
	const table = useReactTable({
		data: listPermissions ? listPermissions : defaultData,
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
	function clearFilter(e: MouseEvent, column: Column<IPermission, unknown>) {
		e.stopPropagation();
		column.setFilterValue(undefined);
	}

	// Функция установки фильтра по клику на ячейку
	function setFilterByCell(column_id: string, value: string) {
		table.getColumn(column_id)?.setFilterValue(value);
	}

	if (!listPermissions.length) {
		return <Section className={styles.error_message}>Данные списка разрешений не получены</Section>;
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
