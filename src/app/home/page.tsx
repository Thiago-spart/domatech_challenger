"use client"

import { useState } from "react";
import { Button } from "@/components/action/Button";
import styles from "./page.module.sass";
import { Field, FieldLabel } from "@/components/action/Field";
import { Input } from "@/components/action/Input";
import { ResponsiveUserDrawer } from "@/components/Drawer/ResponsiveUserDrawer";
import { UserPlus } from "lucide-react";

export default function Page() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
						/>
					</Field>

					<Button className={styles.addButton} variant="primary" size="md" onClick={() => setIsDrawerOpen(true)}>
						<span className={styles.addIcon}>
							<UserPlus size={24} strokeWidth={2} />
						</span>
						<span className={styles.addButtonText}>Adicionar paciente</span>
					</Button>
				</div>
			</header>

			<main className={styles.content}>
				{/* Patients list will be rendered here */}
			</main>

			<ResponsiveUserDrawer open={isDrawerOpen} setOpen={setIsDrawerOpen} />
		</div>
	);
}
