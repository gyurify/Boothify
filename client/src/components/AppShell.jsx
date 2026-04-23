import { Link, useNavigate } from 'react-router-dom';
import { useBoothify } from '../context/BoothifyContext.jsx';
import SessionProgress from './SessionProgress.jsx';

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const { resetSession } = useBoothify();

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
          <span className="pill">Session flow</span>
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              resetSession();
              navigate('/');
            }}
          >
            Reset
          </button>
        </div>
      </header>

      <div className="page-frame">
        <SessionProgress />
      </div>

      <main className="page-frame">{children}</main>

      <footer className="site-footer">
        <p>Step 2 focuses on routing, session architecture, and screen ownership.</p>
      </footer>
    </div>
  );
}
