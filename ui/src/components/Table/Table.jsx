import styles from './Table.module.css';
import data_json from './data.json';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { columns_template } from './colunns';
import { useMemo, useState } from 'react';

export function Table() {
	const [columnOrder] = useState(['NAME', 'SINGLE_VALUE', 'USAGE', 'DESC']);
	const [data] = useState(data_json.attributes);

	const columns = useMemo(() => columns_template, []);

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		initialState: {
			columnOrder,
		},
	});

	return (
		<div className={styles.block}>
			<table>
				<thead>
					{table.getHeaderGroups().map(headerGroup => {
						return (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<th id={header.id} key={header.id}>
											{header.id}
										</th>
									);
								})}
							</tr>
						);
					})}
				</thead>
				<tbody>
					{table.getCoreRowModel().rows.map(row => (
						<tr key={row.id}>
							{row.getVisibleCells().map(cell => {
								return (
									<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
