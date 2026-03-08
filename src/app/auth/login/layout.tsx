import Image from "next/image";
import styles from "./page.module.sass";
import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Entrar",
	description: "Acesse sua conta na Domatech para gerenciar suas consultas.",
};

export default function LoginLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className={styles.formSection}>
			<div className={styles.formWrapper}>
				<div className={styles.logoContainer}>
					<Image
						src="/logo.svg"
						alt="Logo"
						width={70}
						height={125}
						className={styles.logo}
						priority
					/>
				</div>

				<h1 className={styles.title}>Bem-vindo de volta!</h1>
				<p className={styles.subtitle}>Entre com:</p>

				<div className={styles.divider}>
					<span>ou acesse com seu e-mail:</span>
				</div>

				{children}

				<div className={styles.signupText}>
					Não possui cadastro?{' '}
					<Link href="/auth/create-account" className={styles.signupLink}>
						Criar conta
					</Link>
				</div>
			</div>
		</section>
	);
}
