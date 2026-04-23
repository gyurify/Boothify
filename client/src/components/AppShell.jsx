import { Link } from 'react-router-dom';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand-mark" to="/">
          <span className="brand-badge">B</span>
          <div>
            <p className="eyebrow">Sketchy photo booth + music lab</p>
            <h1>Boothify</h1>
          </div>
        </Link>

        <div className="topbar-note">
          <span className="pill">React + Vite</span>
          <span className="pill">Express API</span>
        </div>
      </header>

      <main className="page-frame">{children}</main>

      <footer className="site-footer">
        <p>Base scaffold ready for capture, Spotify, strip builder, and export flows.</p>
      </footer>
    </div>
  );
}

