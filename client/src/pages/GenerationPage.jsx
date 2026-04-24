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
  const {
    generatePreviewPlaceholder,
    generation,
    selectedLayout,
    selectedStripShots,
    selectedTrack,
    songClip
  } = useBoothify();

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <SketchCard className="page-card generation-studio" tone="paper">
          <PageIntro
            eyebrow="Step 5"
            title="Develop the booth preview."
            description="Bundle the strip, motion, and soundtrack into a single preview card before the final pickup screen."
          />

          <div className="generation-studio__grid">
            <div className="generation-sheet">
              <div className="summary-grid">
                <div className="summary-block">
                  <span>Track</span>
                  <strong>
                    {selectedTrack
                      ? `${selectedTrack.title} - ${selectedTrack.artist}`
                      : 'Not selected'}
                  </strong>
                </div>
                <div className="summary-block">
                  <span>Layout</span>
                  <strong>{selectedLayout.label}</strong>
                </div>
                <div className="summary-block">
                  <span>Clip window</span>
                  <strong>{songClip.timingLabel}</strong>
                </div>
                <div className="summary-block">
                  <span>Frames in strip</span>
                  <strong>
                    {selectedStripShots.length} / {selectedLayout.photoCount}
                  </strong>
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
                  generate preview
                </SketchButton>
              </div>
            </div>

            <div className="generation-preview-sheet">
              <div
                className={`generation-preview-sheet__strip ${
                  selectedLayout.columns > 1 ? 'generation-preview-sheet__strip--grid' : ''
                }`.trim()}
                style={{
                  gridTemplateColumns: `repeat(${selectedLayout.columns}, 1fr)`,
                  gridTemplateRows: `repeat(${selectedLayout.rows}, 1fr)`
                }}
              >
                {Array.from({ length: selectedLayout.photoCount }).map((_, index) => {
                  const shot = selectedStripShots[index];

                  return (
                    <span
                      key={`generation-cell-${index + 1}`}
                      className={`generation-preview-sheet__cell ${
                        shot ? 'is-filled' : ''
                      }`.trim()}
                      style={shot ? { backgroundColor: shot.tone } : undefined}
                    />
                  );
                })}
              </div>

              {generation.previewAsset ? (
                <div className="preview-panel">
                  <strong>{generation.previewAsset.label}</strong>
                  <p>{generation.previewAsset.soundtrackLabel}</p>
                  <p>{generation.previewAsset.clipWindowLabel}</p>
                  <p>{generation.previewAsset.note}</p>
                </div>
              ) : (
                <p className="helper-text">
                  Generate a preview to see how this session wants to come together.
                </p>
              )}
            </div>
          </div>
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
          Continue to song clip picker
        </SketchButton>
      </div>
    </div>
  );
}
