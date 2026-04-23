import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import ProgressMeter from '../components/ui/ProgressMeter.jsx';
import SketchButton from '../components/ui/SketchButton.jsx';
import SketchCard from '../components/ui/SketchCard.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function CameraBoothPage() {
  const navigate = useNavigate();
  const {
    addMockShot,
    appLimits,
    clearCapturedShots,
    progress,
    removeCapturedShot,
    selectedLayout,
    session
  } = useBoothify();

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <SketchCard className="page-card" tone="paper">
          <PageIntro
            eyebrow="Step 3"
            title="Camera booth"
            description="Step into the booth, collect your frames, and build momentum for the final strip."
          />

          <div className="camera-stage">
            <strong>Camera viewport placeholder</strong>
            <p>The live booth view lands here next, with countdown, flash, and capture controls.</p>
          </div>

          <ProgressMeter
            hint={`You need at least ${selectedLayout.photoCount} captured shots before review.`}
            label="Capture progress"
            max={appLimits.maxShots}
            tone="teal"
            value={session.capturedShots.length}
          />

          <div className="action-row action-row--compact">
            <SketchButton
              disabled={session.capturedShots.length >= appLimits.maxShots}
              type="button"
              variant="primary"
              onClick={addMockShot}
            >
              Add placeholder shot
            </SketchButton>
            <SketchButton
              disabled={session.capturedShots.length === 0}
              type="button"
              variant="ghost"
              onClick={clearCapturedShots}
            >
              Clear shots
            </SketchButton>
          </div>

          <p className="helper-text">
            Captured {session.capturedShots.length} / {appLimits.maxShots}. You need at least{' '}
            {selectedLayout.photoCount} shots before you can fill this layout.
          </p>

          <div className="shot-grid">
            {session.capturedShots.map((shot) => (
              <SketchCard as="article" key={shot.id} className="shot-card" tone="paper">
                <div className="shot-preview" style={{ backgroundColor: shot.tone }} />
                <div className="shot-meta">
                  <strong>{shot.label}</strong>
                  <SketchButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCapturedShot(shot.id)}
                  >
                    Remove
                  </SketchButton>
                </div>
              </SketchCard>
            ))}
          </div>
        </SketchCard>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <SketchButton
          onClick={() => navigate(APP_ROUTES.stripSelection)}
          type="button"
          variant="ghost"
        >
          Back
        </SketchButton>
        <SketchButton
          disabled={!progress.hasEnoughShotsForLayout}
          type="button"
          variant="primary"
          onClick={() => navigate(APP_ROUTES.review)}
        >
          Continue to photo review
        </SketchButton>
      </div>
    </div>
  );
}
