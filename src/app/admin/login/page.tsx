import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.wordmark}>
          <span className={styles.logoMark}>AO</span>
          <span className={styles.title}>Architecture ONE Admin</span>
        </div>
        <p className={styles.subtitle}>Sign in to manage site content.</p>
        <LoginForm />
      </div>
    </div>
  );
}
