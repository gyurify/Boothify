import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import ProgressMeter from '../components/ui/ProgressMeter.jsx';
import SketchButton from '../components/ui/SketchButton.jsx';
import SketchCard from '../components/ui/SketchCard.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function GenerationPage() {
  const navigate = useNavigate();
  const { generatePreviewPlaceholder, generation, selectedLayout, selectedTrack, session } =
    useBoothify();

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <SketchCard className="page-card" tone="mint">
          <PageIntro
            eyebrow="Step 5"
            title="Generation screen"
            description="Bundle the strip with motion, timing, and soundtrack into one preview-ready session."
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

          <ProgressMeter
            hint="This becomes the real render state once the media pipeline is wired."
            label="Preview status"
            max={1}
            tone="sky"
            value={generation.status === 'ready' ? 1 : 0}
          />

          <div className="action-row action-row--compact">
            <SketchButton onClick={generatePreviewPlaceholder} type="button" variant="primary">
              Generate placeholder preview
            </SketchButton>
          </div>

          {generation.previewAsset ? (
            <SketchCard className="preview-panel" tone="paper">
              <strong>{generation.previewAsset.label}</strong>
              <p>{generation.previewAsset.soundtrackLabel}</p>
              <p>{generation.previewAsset.note}</p>
            </SketchCard>
          ) : (
            <p className="helper-text">
              Generate a preview to see how this session wants to come together.
            </p>
          )}
        </SketchCard>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <SketchButton onClick={() => navigate(APP_ROUTES.review)} type="button" variant="ghost">
          Back
        </SketchButton>
        <SketchButton
          disabled={generation.status !== 'ready'}
          type="button"
          variant="primary"
          onClick={() => navigate(APP_ROUTES.download)}
        >
          Continue to downloads
        </SketchButton>
      </div>
    </div>
  );
}
