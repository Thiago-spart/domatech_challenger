import Image from "next/image";
import styles from "./style.module.sass";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={styles.container}>
			{children}

			<section className={styles.imageSection}>
				<Image
					src="/doctor_login.png"
					alt="Profissional de saúde"
					fill
					className={styles.imageCover}
					sizes="(max-width: 720px) 0vw, 50vw"
					priority
				/>
				<Image
					src="/image_mask_login.png"
					alt="Efeito visual de login"
					fill
					className={styles.imageOverlay}
					sizes="(max-width: 720px) 0vw, 50vw"
					priority
				/>
			</section>
		</div>
	);
}
