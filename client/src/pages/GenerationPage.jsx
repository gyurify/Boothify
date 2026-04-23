import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function GenerationPage() {
  const navigate = useNavigate();
  const { generatePreviewPlaceholder, generation, selectedLayout, selectedTrack, session } =
    useBoothify();

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <div className="page-card">
          <PageIntro
            eyebrow="Step 5"
            title="Generation screen"
            description="This route owns render status, preview metadata, and the handoff to download delivery. Actual media generation lands in a later step."
          />

          <div className="summary-grid">
            <div className="summary-block">
              <span>Track</span>
              <strong>
                {selectedTrack ? `${selectedTrack.title} - ${selectedTrack.artist}` : 'Not selected'}
              </strong>
            </div>
            <div className="summary-block">
              <span>Layout</span>
              <strong>{selectedLayout.label}</strong>
            </div>
            <div className="summary-block">
              <span>Clip length</span>
              <strong>{session.clipLengthSeconds}s</strong>
            </div>
          </div>

          <div className="action-row action-row--compact">
            <button className="primary-button" type="button" onClick={generatePreviewPlaceholder}>
              Generate placeholder preview
            </button>
          </div>

          {generation.previewAsset ? (
            <div className="preview-panel">
              <strong>{generation.previewAsset.label}</strong>
              <p>{generation.previewAsset.soundtrackLabel}</p>
              <p>{generation.previewAsset.note}</p>
            </div>
          ) : (
            <p className="helper-text">
              No preview exists yet. This screen is now responsible for generation state.
            </p>
          )}
        </div>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <button className="secondary-button" type="button" onClick={() => navigate(APP_ROUTES.review)}>
          Back
        </button>
        <button
          className="primary-button"
          disabled={generation.status !== 'ready'}
          type="button"
          onClick={() => navigate(APP_ROUTES.download)}
        >
          Continue to downloads
        </button>
      </div>
    </div>
  );
}

