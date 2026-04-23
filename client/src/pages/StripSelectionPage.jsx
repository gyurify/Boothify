import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import StripLayoutGallery from '../components/StripLayoutGallery.jsx';
import SketchButton from '../components/ui/SketchButton.jsx';
import SketchCard from '../components/ui/SketchCard.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function StripSelectionPage() {
  const navigate = useNavigate();
  const { selectedLayout } = useBoothify();

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <SketchCard className="page-card" tone="gold">
          <PageIntro
            eyebrow="Step 2"
            title="Strip selection"
            description="Choose the strip shape that frames the session and sets the photo count."
          />

          <StripLayoutGallery />

          <p className="helper-text">
            Current layout: {selectedLayout.label} - {selectedLayout.photoCount} required photos.
          </p>
        </SketchCard>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <SketchButton onClick={() => navigate(APP_ROUTES.spotify)} type="button" variant="ghost">
          Back
        </SketchButton>
        <SketchButton onClick={() => navigate(APP_ROUTES.camera)} type="button" variant="primary">
          Continue to camera booth
        </SketchButton>
      </div>
    </div>
  );
}
