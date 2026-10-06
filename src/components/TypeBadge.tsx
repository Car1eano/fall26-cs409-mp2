import styles from "../styles/ui.module.css";

export default function TypeBadge({ type }: { type: string }) {
  return <span className={`${styles.badge} ${styles[type] ?? ""}`}>{type}</span>;
}