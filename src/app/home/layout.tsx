import { Sidebar } from "@/components/Sidebar";
import styles from "./page.module.sass";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}
