export interface Pokemon {
  id: number;
  name: string;
  height: number; // decimetres
  weight: number; // hectograms
  types: string[];
  abilities: string[];
  image: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}