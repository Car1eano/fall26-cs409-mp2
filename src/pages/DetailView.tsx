import { Link, useParams } from "react-router-dom";
import { usePokemon } from "../PokemonContext";
import Status from "../components/Status";
import TypeBadge from "../components/TypeBadge";
import styles from "../styles/ui.module.css";

export default function DetailView() {
  const { id } = useParams();
  const { pokemon, loading, error, navIds } = usePokemon();
  const currentId = Number(id);

  if (loading || error) return <Status />;

  const current = pokemon.find((p) => p.id === currentId);
  if (!current) {
    return (
      <div className={styles.state}>
        <p>Pokemon not found.</p>
        <Link to="/" className={styles.btn}>
          Back to list
        </Link>
      </div>
    );
  }

  // Cycle through the list the user came from; fall back to all Pokemon on direct URL access
  const ids = navIds.includes(currentId) ? navIds : pokemon.map((p) => p.id);
  const idx = ids.indexOf(currentId);
  const prevId = ids[(idx - 1 + ids.length) % ids.length];
  const nextId = ids[(idx + 1) % ids.length];

  const statEntries: [string, number][] = [
    ["HP", current.stats.hp],
    ["Attack", current.stats.attack],
    ["Defense", current.stats.defense],
    ["Speed", current.stats.speed],
  ];

  return (
    <section className={styles.detail}>
      <div className={styles.navRow}>
        <Link to={`/pokemon/${prevId}`} className={styles.btn}>
          ← Previous
        </Link>
        <Link to="/" className={styles.btn}>
          Back to list
        </Link>
        <Link to={`/pokemon/${nextId}`} className={styles.btn}>
          Next →
        </Link>
      </div>

      <h1 className={styles.title}>
        #{String(current.id).padStart(3, "0")} {current.name}
      </h1>
      <img className={styles.detailImg} src={current.image} alt={current.name} />

      <dl className={styles.info}>
        <dt>Types</dt>
        <dd>
          {current.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </dd>
        <dt>Height</dt>
        <dd>{current.height / 10} m</dd>
        <dt>Weight</dt>
        <dd>{current.weight / 10} kg</dd>
        <dt>Abilities</dt>
        <dd>{current.abilities.join(", ")}</dd>
      </dl>

      <h2 className={styles.subtitle}>Base Stats</h2>
      <ul className={styles.stats}>
        {statEntries.map(([label, value]) => (
          <li key={label} className={styles.statRow}>
            <span>{label}</span>
            <progress className={styles.progress} value={value} max={255} />
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}