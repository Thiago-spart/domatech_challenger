"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/Dialog"
import { Button } from "@/components/action/Button"
import { PatientListResponseItem } from "@/app/home/actions"

interface DeletePatientDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	patient: PatientListResponseItem | null
	onConfirm: () => void
	isDeleting?: boolean
}

export function DeletePatientDialog({
	open,
	onOpenChange,
	patient,
	onConfirm,
	isDeleting = false,
}: DeletePatientDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={true}>
				<DialogHeader>
					<DialogTitle>Excluir paciente</DialogTitle>
					<DialogDescription>
						{patient
							? `Tem certeza que deseja excluir o paciente ${patient.fullName}? Esta ação não pode ser desfeita.`
							: ""}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter showCloseButton={false}>
					<Button
						variant="ghost"
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
					>
						Cancelar
					</Button>
					<Button
						variant="primary"
						onClick={onConfirm}
						disabled={isDeleting}
						isLoading={isDeleting}
					>
						Excluir
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
