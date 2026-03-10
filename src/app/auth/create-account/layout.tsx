import styles from "./page.module.sass";
import Link from "next/link";

import { Metadata } from "next";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { FacebookIcon } from "@/components/icons/FacebookIcon";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie conta na domatech",
};

export default function CreateAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={styles.formSection}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Acesse com:</h1>

        <div className={styles.socialButtons}>
          <button type="button" className={styles.socialBtn} disabled aria-label="Criar conta com Google">
            <GoogleIcon />
            <span>Google</span>
          </button>
          <button type="button" className={styles.socialBtn} disabled aria-label="Criar conta com Facebook">
            <FacebookIcon />
            <span>Facebook</span>
          </button>
        </div>

        <div className={styles.divider}>
          <span>ou cadastre-se com seu e-mail</span>
        </div>

        {children}

        <div className={styles.signupText}>
          Já tem cadastro?{" "}
          <Link href="/auth/login" prefetch className={styles.signupLink}>
            Faça o login
          </Link>
        </div>
      </div>
    </section>
  );
}
