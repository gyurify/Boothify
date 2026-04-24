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
      <header className="utility-bar">
        <Link className="utility-home" to="/">
          <span className="utility-home__title">Boothify</span>
          <span className="utility-home__note">hand-drawn photo booth flow</span>
        </Link>

        <div className="utility-actions">
          <span className="utility-chip">sketch kiosk</span>
          <SketchButton
            onClick={() => {
              resetSession();
              navigate('/');
            }}
            size="sm"
            type="button"
            variant="ghost"
          >
            reset session
          </SketchButton>
        </div>
      </header>

      <div className="page-frame page-frame--workflow">
        <SessionProgress />
      </div>

      <main className="page-frame">{children}</main>

      <footer className="site-footer">
        <p>built for quick strips, music cues, and a booth flow that still feels handmade.</p>
      </footer>
    </div>
  );
}
