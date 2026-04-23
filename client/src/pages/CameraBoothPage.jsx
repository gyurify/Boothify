import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
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
        <div className="page-card">
          <PageIntro
            eyebrow="Step 3"
            title="Camera booth"
            description="The real webcam capture layer comes next. For now, this screen owns capture-state architecture, shot limits, and navigation into review."
          />

          <div className="camera-stage">
            <strong>Camera viewport placeholder</strong>
            <p>Shot capture UI, countdown, flash, and webcam permissions land in the next step.</p>
          </div>

          <div className="action-row action-row--compact">
            <button
              className="primary-button"
              disabled={session.capturedShots.length >= appLimits.maxShots}
              type="button"
              onClick={addMockShot}
            >
              Add placeholder shot
            </button>
            <button
              className="secondary-button"
              disabled={session.capturedShots.length === 0}
              type="button"
              onClick={clearCapturedShots}
            >
              Clear shots
            </button>
          </div>

          <p className="helper-text">
            Captured {session.capturedShots.length} / {appLimits.maxShots}. You need at least{' '}
            {selectedLayout.photoCount} shots before composition makes sense.
          </p>

          <div className="shot-grid">
            {session.capturedShots.map((shot) => (
              <article key={shot.id} className="shot-card">
                <div className="shot-preview" style={{ backgroundColor: shot.tone }} />
                <div className="shot-meta">
                  <strong>{shot.label}</strong>
                  <button
                    className="tertiary-button"
                    type="button"
                    onClick={() => removeCapturedShot(shot.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <button
          className="secondary-button"
          type="button"
          onClick={() => navigate(APP_ROUTES.stripSelection)}
        >
          Back
        </button>
        <button
          className="primary-button"
          disabled={!progress.hasEnoughShotsForLayout}
          type="button"
          onClick={() => navigate(APP_ROUTES.review)}
        >
          Continue to photo review
        </button>
      </div>
    </div>
  );
}

