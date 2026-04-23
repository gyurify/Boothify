import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import StripLayoutGallery from '../components/StripLayoutGallery.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function StripSelectionPage() {
  const navigate = useNavigate();
  const { selectedLayout } = useBoothify();

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <div className="page-card">
          <PageIntro
            eyebrow="Step 2"
            title="Strip selection"
            description="This screen stores the chosen layout and sets the exact number of photos required for the composition step."
          />

          <StripLayoutGallery />

          <p className="helper-text">
            Current layout: {selectedLayout.label} - {selectedLayout.photoCount} required photos.
          </p>
        </div>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <button
          className="secondary-button"
          type="button"
          onClick={() => navigate(APP_ROUTES.spotify)}
        >
          Back
        </button>
        <button
          className="primary-button"
          type="button"
          onClick={() => navigate(APP_ROUTES.camera)}
        >
          Continue to camera booth
        </button>
      </div>
    </div>
  );
}
