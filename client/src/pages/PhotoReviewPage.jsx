import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
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
        <div className="page-card">
          <PageIntro
            eyebrow="Step 4"
            title="Photo review and strip composer"
            description="This page owns the exact strip composition. Users can choose which captured photos fill the selected layout."
          />

          <p className="helper-text">
            Pick exactly {selectedLayout.photoCount} shot{selectedLayout.photoCount > 1 ? 's' : ''}{' '}
            for the {selectedLayout.label}.
          </p>

          <div className="shot-grid">
            {session.capturedShots.map((shot) => {
              const isSelected = session.selectedStripPhotoIds.includes(shot.id);
              const disableAdd = !isSelected && selectionIsFull;

              return (
                <button
                  key={shot.id}
                  className={`shot-card shot-card--selectable ${isSelected ? 'is-selected' : ''}`.trim()}
                  disabled={disableAdd}
                  type="button"
                  onClick={() => toggleStripPhoto(shot.id)}
                >
                  <div className="shot-preview" style={{ backgroundColor: shot.tone }} />
                  <div className="shot-meta">
                    <strong>{shot.label}</strong>
                    <span>{isSelected ? 'In strip' : 'Tap to use'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="composer-strip">
            {Array.from({ length: selectedLayout.photoCount }).map((_, index) => {
              const shot = selectedStripShots[index];

              return (
                <div key={`slot-${index + 1}`} className="slot-card">
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
                </div>
              );
            })}
          </div>

          <div className="action-row action-row--compact">
            <button
              className="secondary-button"
              disabled={selectedStripShots.length === 0}
              type="button"
              onClick={clearStripSelection}
            >
              Clear selection
            </button>
          </div>
        </div>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <button className="secondary-button" type="button" onClick={() => navigate(APP_ROUTES.camera)}>
          Back
        </button>
        <button
          className="primary-button"
          disabled={!selectionIsFull}
          type="button"
          onClick={() => navigate(APP_ROUTES.generation)}
        >
          Continue to generation
        </button>
      </div>
    </div>
  );
}

