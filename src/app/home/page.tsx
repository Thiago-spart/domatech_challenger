"use client"

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/action/Button";
import styles from "./page.module.sass";
import { Field, FieldLabel } from "@/components/action/Field";
import { Input } from "@/components/action/Input";
import { ResponsiveUserDrawer } from "@/components/Drawer/ResponsiveUserDrawer";
import { DeletePatientDialog } from "@/components/Dialog/DeletePatientDialog";
import { UserPlus } from "lucide-react";
import { DataTable } from "@/components/table/patientTable";
import { createColumns } from "@/components/table/patientTable/columns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPatients, deletePatient } from "./actions";
import type { PatientListResponseItem } from "./actions";
import { toast } from "sonner";

const SEARCH_DEBOUNCE_MS = 400;

export default function Page() {
	const queryClient = useQueryClient();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [patientToEdit, setPatientToEdit] = useState<PatientListResponseItem | null>(null);
	const [patientToDelete, setPatientToDelete] = useState<PatientListResponseItem | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearch(searchInput);
			setPage(1);
		}, SEARCH_DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [searchInput]);

	const { data: patientsData } = useQuery({
		queryKey: ["patients", page, pageSize, search],
		queryFn: () => getPatients({ page, limit: pageSize, search: search || undefined }),
	})

	const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(event.target.value);
	}, []);

	const handleConfirmDelete = useCallback(async () => {
		if (!patientToDelete) return;
		setIsDeleting(true);
		try {
			await deletePatient(patientToDelete._id);
			toast.success("Paciente excluído com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["patients"] });
			setPatientToDelete(null);
		} catch {
			toast.error("Erro ao excluir paciente, tente novamente.");
		} finally {
			setIsDeleting(false);
		}
	}, [patientToDelete, queryClient]);

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1 className={styles.title}>Pacientes</h1>

				<div className={styles.actions}>
					<Field className={styles.fieldSpacing}>
						<FieldLabel htmlFor="search" isVisible={false}>Buscar</FieldLabel>
						<Input
							type="search"
							id="search"
							placeholder="Busque por pacientes"
							value={searchInput}
							onChange={handleSearchChange}
						/>
					</Field>

					<Button className={styles.addButton} variant="primary" size="md" onClick={() => { setPatientToEdit(null); setIsDrawerOpen(true); }}>
						<span className={styles.addIcon}>
							<UserPlus size={24} strokeWidth={2} />
						</span>
						<span className={styles.addButtonText}>Adicionar paciente</span>
					</Button>
				</div>
			</header>

			<main className={styles.content}>
				<DataTable
					columns={createColumns(
						(patient) => {
							setPatientToEdit(patient);
							setIsDrawerOpen(true);
						},
						(patient) => setPatientToDelete(patient)
					)}
					data={patientsData?.items || []}
					pageCount={Math.max(1, patientsData?.paging?.totalPages ?? 1)}
					pageIndex={page - 1}
					pageSize={pageSize}
					onPageChange={(index) => setPage(index + 1)}
					onPageSizeChange={(size) => {
						setPageSize(size)
						setPage(1)
					}}
				/>
			</main>

			<ResponsiveUserDrawer
				open={isDrawerOpen}
				setOpen={(open) => {
					setIsDrawerOpen(open);
					if (!open) setPatientToEdit(null);
				}}
				patientToEdit={patientToEdit}
				onEditComplete={() => setPatientToEdit(null)}
			/>

			<DeletePatientDialog
				open={!!patientToDelete}
				onOpenChange={(open) => !open && setPatientToDelete(null)}
				patient={patientToDelete}
				onConfirm={handleConfirmDelete}
				isDeleting={isDeleting}
			/>
		</div>
	);
}

