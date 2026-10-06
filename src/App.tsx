import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { PokemonProvider } from "./PokemonContext";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import styles from "./App.module.css";

function linkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

export default function App() {
  return (
    <PokemonProvider>
      <header className={styles.header}>
        <span className={styles.brand}>Pokédex</span>
        <nav className={styles.nav}>
          <NavLink to="/" end className={linkClass}>
            List
          </NavLink>
          <NavLink to="/gallery" className={linkClass}>
            Gallery
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:id" element={<DetailView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </PokemonProvider>
  );
}