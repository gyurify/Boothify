import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import ProgressMeter from '../components/ui/ProgressMeter.jsx';
import SketchButton from '../components/ui/SketchButton.jsx';
import SketchCard from '../components/ui/SketchCard.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function PhotoReviewPage() {
  const navigate = useNavigate();
  const {
    clearStripSelection,
    selectedLayout,
    selectedStripShots,
    session,
    toggleStripPhoto
  } = useBoothify();

  const selectionIsFull = selectedStripShots.length === selectedLayout.photoCount;

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <SketchCard className="page-card" tone="blush">
          <PageIntro
            eyebrow="Step 4"
            title="Photo review and strip composer"
            description="Choose the exact frames that deserve a spot in the finished strip."
          />

          <p className="helper-text">
            Pick exactly {selectedLayout.photoCount} shot{selectedLayout.photoCount > 1 ? 's' : ''}{' '}
            for the {selectedLayout.label}.
          </p>

          <ProgressMeter
            hint="Tap cards to add or remove them from the final strip."
            label="Composer fill"
            max={selectedLayout.photoCount}
            tone="pink"
            value={selectedStripShots.length}
          />

          <div className="shot-grid">
            {session.capturedShots.map((shot) => {
              const isSelected = session.selectedStripPhotoIds.includes(shot.id);
              const disableAdd = !isSelected && selectionIsFull;

              return (
                <SketchCard
                  as="button"
                  key={shot.id}
                  className={`shot-card shot-card--selectable ${isSelected ? 'is-selected' : ''}`.trim()}
                  disabled={disableAdd}
                  interactive
                  onClick={() => toggleStripPhoto(shot.id)}
                  type="button"
                >
                  <div className="shot-preview" style={{ backgroundColor: shot.tone }} />
                  <div className="shot-meta">
                    <strong>{shot.label}</strong>
                    <span>{isSelected ? 'In strip' : 'Tap to use'}</span>
                  </div>
                </SketchCard>
              );
            })}
          </div>

          <div className="composer-strip">
            {Array.from({ length: selectedLayout.photoCount }).map((_, index) => {
              const shot = selectedStripShots[index];

              return (
                <SketchCard key={`slot-${index + 1}`} className="slot-card" tone="paper">
                  {shot ? (
                    <>
                      <div className="shot-preview" style={{ backgroundColor: shot.tone }} />
                      <strong>{shot.label}</strong>
                    </>
                  ) : (
                    <>
                      <div className="shot-preview shot-preview--empty" />
                      <strong>Slot {index + 1}</strong>
                    </>
                  )}
                </SketchCard>
              );
            })}
          </div>

          <div className="action-row action-row--compact">
            <SketchButton
              disabled={selectedStripShots.length === 0}
              type="button"
              variant="ghost"
              onClick={clearStripSelection}
            >
              Clear selection
            </SketchButton>
          </div>
        </SketchCard>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <SketchButton onClick={() => navigate(APP_ROUTES.camera)} type="button" variant="ghost">
          Back
        </SketchButton>
        <SketchButton
          disabled={!selectionIsFull}
          type="button"
          variant="primary"
          onClick={() => navigate(APP_ROUTES.generation)}
        >
          Continue to generation
        </SketchButton>
      </div>
    </div>
  );
}
