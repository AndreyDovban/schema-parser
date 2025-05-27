import styles from './Table.module.css';
import data_json from './data.json';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { columns_template } from './colunns';
import { useMemo, useState } from 'react';

export function Table() {
	const [columnOrder] = useState(['NAME', 'SINGLE_VALUE', 'USAGE', 'DESC']);
	const [sorting, setSorting] = useState([]);
	const [data] = useState(data_json.attributes);

	const columns = useMemo(() => columns_template, []);

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,

		state: {
			columnOrder,
			sorting,
		},
	});

	return (
		<div className={styles.block}>
			<div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
			<table>
				<thead>
					{table.getHeaderGroups().map(headerGroup => {
						return (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<th key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder ? null : (
												<div
													className={
														header.column.getCanSort() ? 'cursor-pointer select-none' : ''
													}
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
													{flexRender(header.column.columnDef.header, header.getContext())}
													{{
														asc: ' 🔼',
														desc: ' 🔽',
													}[header.column.getIsSorted()] ?? null}
												</div>
											)}
										</th>
									);
								})}
							</tr>
						);
					})}
				</thead>
				<tbody>
					{table
						.getRowModel()
						.rows.slice(0, 20)
						.map(row => {
							return (
								<tr key={row.id}>
									{row.getVisibleCells().map(cell => {
										return (
											<td className={styles.td} key={cell.id} title={cell.getValue()}>
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
	);
}
