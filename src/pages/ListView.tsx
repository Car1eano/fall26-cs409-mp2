import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePokemon } from "../PokemonContext";
import Status from "../components/Status";
import TypeBadge from "../components/TypeBadge";
import type { Pokemon } from "../types";
import styles from "../styles/ui.module.css";

type SortKey = "id" | "name" | "hp" | "attack" | "height" | "weight";
type Order = "asc" | "desc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "id", label: "Number" },
  { key: "name", label: "Name" },
  { key: "hp", label: "HP" },
  { key: "attack", label: "Attack" },
  { key: "height", label: "Height" },
  { key: "weight", label: "Weight" },
];

function getNumber(p: Pokemon, key: Exclude<SortKey, "name">): number {
  switch (key) {
    case "hp":
      return p.stats.hp;
    case "attack":
      return p.stats.attack;
    default:
      return p[key];
  }
}

export default function ListView() {
  const { pokemon, loading, error, setNavIds } = usePokemon();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [order, setOrder] = useState<Order>("asc");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = pokemon.filter(
      (p) => p.name.includes(q) || String(p.id) === q
    );
    const dir = order === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      return (getNumber(a, sortKey) - getNumber(b, sortKey)) * dir;
    });
  }, [pokemon, query, sortKey, order]);

  // Prev/Next in the detail view cycles through exactly what the list shows
  useEffect(() => {
    setNavIds(visible.map((p) => p.id));
  }, [visible, setNavIds]);

  return (
    <section>
      <h1 className={styles.title}>Pokemon List</h1>
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search by name or number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className={styles.sortLabel}>
          Sort by
          <select
            className={styles.select}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button
          className={styles.btn}
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
        >
          {order === "asc" ? "Ascending ↑" : "Descending ↓"}
        </button>
      </div>

      <Status />
      {!loading && !error && (
        <>
          <p className={styles.count}>{visible.length} results</p>
          <ul className={styles.list}>
            {visible.map((p) => (
              <li key={p.id}>
                <Link to={`/pokemon/${p.id}`} className={styles.row}>
                  <img className={styles.rowImg} src={p.image} alt={p.name} loading="lazy" />
                  <span className={styles.rowId}>#{String(p.id).padStart(3, "0")}</span>
                  <span className={styles.rowName}>{p.name}</span>
                  <span className={styles.rowTypes}>
                    {p.types.map((t) => (
                      <TypeBadge key={t} type={t} />
                    ))}
                  </span>
                  <span className={styles.rowStats}>
                    HP {p.stats.hp} · ATK {p.stats.attack} · {p.height / 10}m · {p.weight / 10}kg
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {visible.length === 0 && <p className={styles.state}>No Pokemon found.</p>}
        </>
      )}
    </section>
  );
}