import { useRequest } from '@/hooks/useRequest';
import styles from './TableSection.module.css';
import { Section } from '@/ui';
import { type InputHTMLAttributes, type MouseEvent, useEffect, useState } from 'react';
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
import type { IClient, IAttribute } from '@/interfaces';
import Close from '@/assets/svg/close.svg?react';
import Sort from '@/assets/svg/sort.svg?react';
import SortDown from '@/assets/svg/sort-down.svg?react';
import SortUp from '@/assets/svg/sort-up.svg?react';

declare module '@tanstack/react-table' {
	//allows us to define custom properties for our columns
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: 'text' | 'range' | 'select';
	}
}

const defaultData: IAttribute[] = [];
const columnHelper = createColumnHelper<IAttribute>();

const columns = [
	columnHelper.accessor('NAME', {
		id: 'NAME',
		header: () => 'Название',
		cell: info => info.getValue(),
		filterFn: 'includesString',
	}),
	columnHelper.accessor('SINGLE_VALUE', {
		header: () => 'Однозначный',
		cell: ({ getValue }) => (getValue() ? '✓' : '✗'),
		// sortingFn: 'textCaseSensitive',
		filterFn: 'includesString',
		meta: {
			filterVariant: 'select',
		},
	}),
	columnHelper.accessor('USAGE', {
		header: () => 'Использование',
		cell: info => info.renderValue(),
		sortingFn: 'textCaseSensitive',
		filterFn: 'includesString',
	}),
	columnHelper.accessor('DESC', {
		header: () => 'Описание',
		cell: info => info.getValue(),
		sortingFn: 'textCaseSensitive',
		filterFn: 'includesString',
	}),
];

function Filter({ column }: { column: Column<IAttribute, unknown> }) {
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

// A typical debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return <input {...props} value={value} onChange={e => setValue(e.target.value)} />;
}

export function TableSection() {
	const { data, loading, error, info, request } = useRequest<IClient>('/api/test'); // Хук запроса к серверу
	const [columnOrder] = useState(['NAME', 'SINGLE_VALUE', 'USAGE', 'DESC']);
	const [sorting, setSorting] = useState<SortingState>([]); // Внутреннее состояние компонента объект сортиовка
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	// Объект таблица
	const table = useReactTable({
		data: data ? data.attributes : defaultData,
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

	// В эффекте идёт запрос за списко клиентов
	useEffect(() => {
		request();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// В эффекте выводится инвормаци ответа сервере
	useEffect(() => {
		if (info) {
			console.log('INFO', info);
		}
	}, [info]);

	// Вывод лоадера при ожидании ответа
	if (loading) {
		console.log('Загрузка');
		<Section className={styles.table_section} classNameContent={styles.content}>
			LOADING...
		</Section>;
	}

	// Вывод инфорамции об ошибке
	if (error) {
		return (
			<Section className={styles.table_section} classNameContent={styles.content}>
				Ошибка: {error.message}
			</Section>
		);
	}

	// Функция перерисовки таблицы
	function rerender() {
		request();
	}

	// Функция сброса фильтрации
	function clearFilter(e: MouseEvent, column: Column<IAttribute, unknown>) {
		e.stopPropagation();
		column.setFilterValue(undefined);
	}

	// Функция установки фильтра по клику на ячейку
	function setFilterByCell(column_id: string, value: string) {
		table.getColumn(column_id)?.setFilterValue(value);
	}

	return (
		<Section className={styles.table_section} classNameContent={styles.content}>
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
			<button onClick={rerender}>Rerender</button>
		</Section>
	);
}
