"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTableColumnHeader } from "./dataTableColumnHeader"
import { PatientListResponseItem, updatePatient } from "@/app/home/actions"
import styles from "./columns.module.sass"
import Image from "next/image"
import { Switch } from "@/components/switch"

function StatusCell({ patient }: { patient: PatientListResponseItem }) {
	const queryClient = useQueryClient()
	const active = patient.active ?? true

	const { mutate: updateStatus, isPending } = useMutation({
		mutationFn: (newActive: boolean) =>
			updatePatient(patient._id, { active: newActive }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["patients"] })
		},
	})

	return (
		<div className={styles.statusWrapper}>
			<Switch
				checked={active}
				disabled={isPending}
				onCheckedChange={(checked) => updateStatus(!!checked)}
			/>
		</div>
	)
}

export function createColumns(
	onPatientClick?: (patient: PatientListResponseItem) => void
): ColumnDef<PatientListResponseItem>[] {
	return [
		{
			accessorKey: "fullName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Paciente" />
			),
			cell: ({ row }) => {
				const name = row.getValue("fullName") as string
				const patient = row.original
				const content = (
					<>
						<div className={styles.avatar}>
							<Image
								src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}&backgroundColor=e2e8f0`}
								alt={name}
								width={40}
								height={40}
								unoptimized
								className={styles.avatarImage}
							/>
						</div>
						<span className={styles.authorName}>{name}</span>
					</>
				)
				return (
					<div className={styles.authorCell}>
						{onPatientClick ? (
							<button
								type="button"
								className={styles.patientNameButton}
								onClick={() => onPatientClick(patient)}
							>
								{content}
							</button>
						) : (
							content
						)}
					</div>
				)
			}
		},
		{
			accessorKey: "updatedAtDateTime",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Última Interação" />
			),
			cell: ({ row }) => {
			const dateValue = row.getValue("updatedAtDateTime") as string;
			let formatted = "-";
			if (dateValue) {
				formatted = new Intl.DateTimeFormat("pt-BR", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric"
				}).format(new Date(dateValue));
			}

					return <div className={styles.dateCell}>{formatted}</div>
			},
		},
		{
			accessorKey: "tags",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Tag" />
			),
			cell: ({ row }) => {
			const tags = row.getValue("tags") as string[] | undefined;
			const tag = (tags && tags.length > 0) ? tags[0] : "Prioridade";
			return (
				<div className={styles.tagWrapper}>
					<span className={styles.tag}>
						{tag}
					</span>
				</div>
			)
			},
		},
		{
			accessorKey: "active",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Status" />
			),
			cell: ({ row }) => <StatusCell patient={row.original} />,
		},
	]
}

export const columns = createColumns()
