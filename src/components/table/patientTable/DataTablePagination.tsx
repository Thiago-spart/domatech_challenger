"use client"

import { type Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronDown } from "lucide-react"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/dropdown"

import styles from "./pagination.module.sass"

const PAGE_SIZES = [10, 20, 25, 30, 40, 50]

interface DataTablePaginationProps<TData> {
	table: Table<TData>
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const pageIndex = table.getState().pagination.pageIndex
	const pageSize = table.getState().pagination.pageSize
	const pageCount = table.getPageCount()

	return (
		<div className={styles.pagination}>
			<div className={styles.paginationLeft}>
				<button
					type="button"
					className={styles.navButton}
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
					aria-label="Página anterior"
				>
					<ChevronLeft size={20} />
				</button>
				<span className={styles.pageInfo}>
					{pageIndex + 1}/{pageCount || 1}
				</span>
				<button
					type="button"
					className={styles.navButton}
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
					aria-label="Próxima página"
				>
					<ChevronLeft size={20} className={styles.chevronRight} />
				</button>
			</div>

			<div className={styles.paginationRight}>
				<span className={styles.rowsLabel}>Linhas por página:</span>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className={styles.pageSizeTrigger}
							aria-label="Selecionar linhas por página"
						>
							<span>{pageSize}</span>
							<ChevronDown size={16} />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" sideOffset={4}>
						{PAGE_SIZES.map((size) => (
							<DropdownMenuItem
								key={size}
								onClick={() => table.setPageSize(size)}
							>
								{size}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}
