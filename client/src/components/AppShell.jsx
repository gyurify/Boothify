import { Link, useNavigate } from 'react-router-dom';
import { useBoothify } from '../context/BoothifyContext.jsx';
import SessionProgress from './SessionProgress.jsx';
import SketchButton from './ui/SketchButton.jsx';

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const { resetSession } = useBoothify();

  return (
    <div className="app-shell">
      <div className="paper-halo" aria-hidden="true" />
      <header className="topbar">
        <Link className="brand-mark" to="/">
          <span className="brand-badge">B</span>
          <div className="brand-copy">
            <p className="eyebrow">Sketchy photo booth + music lab</p>
            <h1>Boothify</h1>
            <p className="brand-note">Playful sessions, polished exports, and a little doodled swagger.</p>
          </div>
        </Link>

        <div className="topbar-note">
          <span className="pill pill--mint">Session flow</span>
          <span className="pill pill--paper">React + Vite</span>
          <SketchButton
            onClick={() => {
              resetSession();
              navigate('/');
            }}
            size="sm"
            type="button"
            variant="ghost"
          >
            Reset
          </SketchButton>
        </div>
      </header>

      <div className="page-frame">
        <SessionProgress />
      </div>

      <main className="page-frame">{children}</main>

      <footer className="site-footer">
        <p>Built for song-led photo sessions, sketched with a little extra charm.</p>
      </footer>
    </div>
  );
}
