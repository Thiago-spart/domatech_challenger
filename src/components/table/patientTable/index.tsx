"use client"

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/table"

import * as React from "react"

import { DataTablePagination } from "./DataTablePagination"
import styles from "./style.module.sass"


interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	pageCount?: number
	pageIndex?: number
	pageSize?: number
	onPageChange?: (pageIndex: number) => void
	onPageSizeChange?: (pageSize: number) => void
}

export function DataTable<TData, TValue>({
	columns,
	data,
	pageCount,
	pageIndex = 0,
	pageSize = 10,
	onPageChange,
	onPageSizeChange,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [rowSelection, setRowSelection] = React.useState({})

	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})

	const isServerSide = pageCount != null

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualPagination: isServerSide,
		pageCount: isServerSide ? pageCount : undefined,
		onPaginationChange: isServerSide && (onPageChange || onPageSizeChange)
			? (updater) => {
					const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater
					onPageChange?.(next.pageIndex)
					onPageSizeChange?.(next.pageSize)
				}
			: undefined,
		initialState: {
			pagination: {
				pageIndex,
				pageSize,
			},
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: isServerSide
				? { pageIndex, pageSize }
				: undefined,
		},
	})
	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className={styles.emptyCell}>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<DataTablePagination table={table} />
			</div>
		</div>
	)
}
