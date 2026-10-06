import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchAllPokemon } from "./api";
import type { Pokemon } from "./types";

interface PokemonContextValue {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  navIds: number[];
  setNavIds: (ids: number[]) => void;
}

const PokemonContext = createContext<PokemonContextValue | null>(null);

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navIds, setNavIds] = useState<number[]>([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAllPokemon()
      .then((data) => {
        if (!cancelled) setPokemon(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load Pokemon data. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = () => setAttempt((n) => n + 1);

  return (
    <PokemonContext.Provider
      value={{ pokemon, loading, error, reload, navIds, setNavIds }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon(): PokemonContextValue {
  const ctx = useContext(PokemonContext);
  if (!ctx) throw new Error("usePokemon must be used inside PokemonProvider");
  return ctx;
}