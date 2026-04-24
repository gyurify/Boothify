import { useNavigate } from 'react-router-dom';
import PhotoboothStripPreview from '../components/PhotoboothStripPreview.jsx';
import StripLayoutGallery from '../components/StripLayoutGallery.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

const STRIP_SELECTION_STEPS = [
  'Choose between a classic strip or a taller frame with the arrows.',
  'Look for the photo count that matches how many poses you want to take.',
  'Press the green select button to step into the camera booth.'
];

export default function StripSelectionPage() {
  const navigate = useNavigate();
  const { availableLayouts, selectedLayout, selectLayout } = useBoothify();

  const selectedIndex = Math.max(
    availableLayouts.findIndex((layout) => layout.id === selectedLayout.id),
    0
  );

  function cycleLayout(direction) {
    const nextIndex =
      (selectedIndex + direction + availableLayouts.length) % availableLayouts.length;
    selectLayout(availableLayouts[nextIndex].id);
  }

  return (
    <div className="page-stack booth-kiosk-page">
      <section className="booth-kiosk-scene">
        <div className="booth-kiosk__marquee" aria-hidden="true" />

        <div className="scene-copy">
          <p className="eyebrow">Step 2</p>
          <h2>Choose your strip frame.</h2>
          <p>
            Spin through the layouts, then hit the green select button when the strip feels right.
          </p>
        </div>

        <div className="booth-kiosk__stage">
          <p className="scene-annotation scene-annotation--left">eye level -&gt;</p>

          <div className="kiosk-machine">
            <div className="kiosk-machine__screen">
              <div className="layout-selector">
                <button
                  aria-label="Show previous layout"
                  className="layout-arrow"
                  onClick={() => cycleLayout(-1)}
                  type="button"
                >
                  &lt;
                </button>

                <div className="layout-selector__preview">
                  <PhotoboothStripPreview layout={selectedLayout} variant="screen" />

                  <div className="layout-selector__copy">
                    <strong>{selectedLayout.label}</strong>
                    <span>
                      {selectedLayout.stripSizeLabel} strip - {selectedLayout.photoCount} photos
                    </span>
                    <span>{selectedLayout.photoSizeLabel} each</span>
                  </div>
                </div>

                <button
                  aria-label="Show next layout"
                  className="layout-arrow"
                  onClick={() => cycleLayout(1)}
                  type="button"
                >
                  &gt;
                </button>
              </div>
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
            {STRIP_SELECTION_STEPS.map((step, index) => (
              <div key={`strip-step-${index + 1}`} className="instruction-step">
                <span className="instruction-step__number">{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="control-tower">
            <span className="control-tower__label">select</span>
            <button
              aria-label="Continue to camera booth"
              className="control-tower__indicator control-tower__indicator--green"
              onClick={() => navigate(APP_ROUTES.camera)}
              type="button"
            />
            <span className="control-tower__slot" aria-hidden="true" />
            <span className="control-tower__tray" aria-hidden="true" />
            <button
              className="control-tower__back"
              onClick={() => navigate(APP_ROUTES.spotify)}
              type="button"
            >
              back
            </button>
          </div>
        </div>
      </section>

      <section className="strip-gallery-section">
        <div className="strip-gallery-section__copy">
          <p className="eyebrow">All strip options</p>
          <h3>Preview every layout before you lock one in.</h3>
          <p>
            Each card shows the strip dimensions, photo count, and a photobooth-style paper preview.
          </p>
        </div>

        <StripLayoutGallery />
      </section>
    </div>
  );
}
