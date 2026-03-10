"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect, RedirectType, usePathname } from "next/navigation";
import { LogOut, Contact } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { logoutAction } from "./actions";
import styles from "./style.module.sass";

export function Sidebar() {
	const pathname = usePathname();

	const isActive = (path: string) => pathname.startsWith(path);

	const queryClient = useQueryClient();

	const handleLogout = async () => {
		await logoutAction();
		queryClient.clear();
		redirect('/auth/login', RedirectType.push)
	};

	return (
		<aside className={styles.sidebar}>
			<div className={styles.logoContainer}>
				<div className={styles.logoWrapper}>
					<Image
						src="/logo.svg"
						alt="Domatech Logo"
						width={40}
						height={40}
						priority
					/>
				</div>
			</div>

			<div className={styles.divider} />

			<nav className={styles.nav}>
				<Link
					href="/patients"
					className={styles.navItem}
					data-active={isActive("/home")}
				>
					<div className={styles.iconWrapper}>
						<Contact strokeWidth={1.5} />
					</div>
					<span className={styles.navLabel}>Pacientes</span>
				</Link>
			</nav>

			<div className={styles.bottomNav}>
				<button
					type="button"
					className={styles.navItem}
					data-active={false}
					onClick={handleLogout}
				>
					<div className={styles.iconWrapper}>
						<LogOut strokeWidth={1.5} />
					</div>
					<span className={styles.navLabel}>Sair</span>
				</button>
			</div>
		</aside>
	);
}
