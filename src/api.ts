import axios from "axios";
import type { Pokemon } from "./types";

const BASE_URL = "https://pokeapi.co/api/v2";
const TOTAL = 151;
const CACHE_KEY = "pokemon-cache-v1";

interface RawPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

function getStat(raw: RawPokemon, name: string): number {
  return raw.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
}

function toPokemon(raw: RawPokemon): Pokemon {
  return {
    id: raw.id,
    name: raw.name,
    height: raw.height,
    weight: raw.weight,
    types: raw.types.map((t) => t.type.name),
    abilities: raw.abilities.map((a) => a.ability.name),
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${raw.id}.png`,
    stats: {
      hp: getStat(raw, "hp"),
      attack: getStat(raw, "attack"),
      defense: getStat(raw, "defense"),
      speed: getStat(raw, "speed"),
    },
  };
}

function readCache(): Pokemon[] | null {
  try {
    const text = localStorage.getItem(CACHE_KEY);
    if (!text) return null;
    const data = JSON.parse(text) as Pokemon[];
    return data.length === TOTAL ? data : null;
  } catch {
    return null;
  }
}

function writeCache(data: Pokemon[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

let inflight: Promise<Pokemon[]> | null = null;

export function fetchAllPokemon(): Promise<Pokemon[]> {
  const cached = readCache();
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;

  const ids = Array.from({ length: TOTAL }, (_, i) => i + 1);
  inflight = Promise.all(
    ids.map((id) => axios.get<RawPokemon>(`${BASE_URL}/pokemon/${id}`))
  )
    .then((responses) => {
      const data = responses.map((r) => toPokemon(r.data));
      writeCache(data);
      return data;
    })
    .catch((err) => {
      inflight = null;
      throw err;
    });
  return inflight;
}