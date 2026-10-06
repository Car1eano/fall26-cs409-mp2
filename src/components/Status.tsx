import { usePokemon } from "../PokemonContext";
import styles from "../styles/ui.module.css";

// Shows loading / error state. Returns null when data is ready.
export default function Status() {
  const { loading, error, reload } = usePokemon();
  if (loading) return <p className={styles.state}>Loading Pokemon...</p>;
  if (error) {
    return (
      <div className={styles.state}>
        <p>{error}</p>
        <button className={styles.btn} onClick={reload}>
          Retry
        </button>
      </div>
    );
  }
  return null;
}