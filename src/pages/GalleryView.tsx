import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePokemon } from "../PokemonContext";
import Status from "../components/Status";
import styles from "../styles/ui.module.css";

export default function GalleryView() {
  const { pokemon, loading, error, setNavIds } = usePokemon();
  const [selected, setSelected] = useState<string[]>([]);

  const allTypes = useMemo(
    () => Array.from(new Set(pokemon.flatMap((p) => p.types))).sort(),
    [pokemon]
  );

  const visible = useMemo(
    () =>
      selected.length === 0
        ? pokemon
        : pokemon.filter((p) => p.types.some((t) => selected.includes(t))),
    [pokemon, selected]
  );

  useEffect(() => {
    setNavIds(visible.map((p) => p.id));
  }, [visible, setNavIds]);

  const toggle = (type: string) =>
    setSelected((cur) =>
      cur.includes(type) ? cur.filter((t) => t !== type) : [...cur, type]
    );

  return (
    <section>
      <h1 className={styles.title}>Pokemon Gallery</h1>
      <Status />
      {!loading && !error && (
        <>
          <div className={styles.filters}>
            {allTypes.map((t) => (
              <button
                key={t}
                aria-pressed={selected.includes(t)}
                className={`${styles.chip} ${styles[t] ?? ""} ${
                  selected.includes(t) ? styles.chipActive : ""
                }`}
                onClick={() => toggle(t)}
              >
                {t}
              </button>
            ))}
            {selected.length > 0 && (
              <button className={styles.btn} onClick={() => setSelected([])}>
                Clear
              </button>
            )}
          </div>
          <p className={styles.count}>{visible.length} results</p>
          <div className={styles.grid}>
            {visible.map((p) => (
              <Link key={p.id} to={`/pokemon/${p.id}`} className={styles.card}>
                <img className={styles.cardImg} src={p.image} alt={p.name} loading="lazy" />
                <span className={styles.cardName}>
                  #{String(p.id).padStart(3, "0")} {p.name}
                </span>
              </Link>
            ))}
          </div>
          {visible.length === 0 && <p className={styles.state}>No Pokemon found.</p>}
        </>
      )}
    </section>
  );
}