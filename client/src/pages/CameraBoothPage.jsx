import { useNavigate } from 'react-router-dom';
import SketchButton from '../components/ui/SketchButton.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

const CAMERA_STEPS = [
  'Pick the mood, square up with the screen, and start snapping.',
  'Take as many practice frames as you need until the strip feels right.',
  'When you have enough shots, press the green review button to keep moving.'
];

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

  const canAddShot = session.capturedShots.length < appLimits.maxShots;

  return (
    <div className="page-stack booth-kiosk-page">
      <section className="booth-kiosk-scene booth-kiosk-scene--camera">
        <div className="booth-kiosk__marquee" aria-hidden="true" />

        <div className="scene-copy">
          <p className="eyebrow">Step 3</p>
          <h2>Step into the booth and build the reel.</h2>
          <p>
            The live camera can slide into this screen later. For now the booth lets you stack
            sample frames and move through the flow like the real machine.
          </p>
        </div>

        <div className="booth-kiosk__stage">
          <p className="scene-annotation scene-annotation--left">eye level -&gt;</p>

          <div className="kiosk-machine">
            <div className="kiosk-machine__screen">
              <div className="screen-button-stack">
                <SketchButton
                  className="screen-action"
                  disabled={!canAddShot}
                  onClick={addMockShot}
                  type="button"
                  variant="primary"
                >
                  take photo
                </SketchButton>
                <SketchButton
                  className="screen-action"
                  disabled={session.capturedShots.length === 0}
                  onClick={clearCapturedShots}
                  type="button"
                  variant="ghost"
                >
                  clear reel
                </SketchButton>
              </div>

              <p className="screen-status">
                captured {session.capturedShots.length} / {appLimits.maxShots} - need{' '}
                {selectedLayout.photoCount} frames for {selectedLayout.label}
              </p>
            </div>
          </div>

          <div className="scene-price-badge">
            <strong>$0</strong>
            <span>= {selectedLayout.photoCount} pics</span>
          </div>

          <div className="scene-toggle" aria-hidden="true">
            <span>b&amp;w</span>
            <span className="scene-toggle__switch" />
            <span>color</span>
          </div>

          <div className="instruction-board">
            {CAMERA_STEPS.map((step, index) => (
              <div key={`camera-step-${index + 1}`} className="instruction-step">
                <span className="instruction-step__number">{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="control-tower">
            <span className="control-tower__label">
              {progress.hasEnoughShotsForLayout ? 'review' : 'wait'}
            </span>
            <button
              aria-label="Continue to photo review"
              className={`control-tower__indicator ${
                progress.hasEnoughShotsForLayout
                  ? 'control-tower__indicator--green'
                  : 'control-tower__indicator--red'
              }`.trim()}
              disabled={!progress.hasEnoughShotsForLayout}
              onClick={() => navigate(APP_ROUTES.review)}
              type="button"
            />
            <span className="control-tower__slot" aria-hidden="true" />
            <span className="control-tower__tray" aria-hidden="true" />
            <button
              className="control-tower__back"
              onClick={() => navigate(APP_ROUTES.stripSelection)}
              type="button"
            >
              back
            </button>
          </div>
        </div>
      </section>

      <section className="capture-reel-section">
        <div className="capture-reel__header">
          <div>
            <p className="eyebrow">Captured reel</p>
            <strong>
              {session.capturedShots.length} frame{session.capturedShots.length === 1 ? '' : 's'} on
              deck
            </strong>
          </div>
          <span className="capture-reel__hint">
            remove any frame before you lock the final strip
          </span>
        </div>

        {session.capturedShots.length === 0 ? (
          <p className="helper-text">
            The reel is empty right now. Tap take photo to start collecting booth frames.
          </p>
        ) : (
          <div className="capture-reel">
            {session.capturedShots.map((shot) => (
              <article key={shot.id} className="capture-ticket">
                <div className="capture-ticket__preview" style={{ backgroundColor: shot.tone }} />
                <div className="capture-ticket__meta">
                  <strong>{shot.label}</strong>
                  <button
                    className="capture-ticket__remove"
                    onClick={() => removeCapturedShot(shot.id)}
                    type="button"
                  >
                    remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
