import { useBoothify } from '../context/BoothifyContext.jsx';
import PhotoboothStripPreview from './PhotoboothStripPreview.jsx';
import SketchCard from './ui/SketchCard.jsx';

export default function StripLayoutGallery() {
  const { availableLayouts, selectLayout, session } = useBoothify();

  return (
    <div className="layout-gallery-grid">
      {availableLayouts.map((layout, index) => {
        const isActive = layout.id === session.selectedLayoutId;

        return (
          <SketchCard
            as="button"
            key={layout.id}
            className={`layout-gallery-card ${isActive ? 'is-active' : ''}`.trim()}
            interactive
            onClick={() => selectLayout(layout.id)}
            aria-pressed={isActive}
            tilt={index % 2 === 0 ? -0.8 : 0.8}
            tone={isActive ? 'sky' : 'paper'}
            type="button"
          >
            <div className="layout-gallery-card__header">
              <div className="layout-gallery-card__copy">
                <strong>{layout.label}</strong>
                <span>{layout.stripSizeLabel}</span>
              </div>
              <span className="layout-gallery-card__count">{layout.photoCount} photos</span>
            </div>

            <PhotoboothStripPreview layout={layout} variant="card" />

            <div className="layout-gallery-card__meta">
              <span>{layout.photoSizeLabel} per photo</span>
              <span>{isActive ? 'selected' : 'tap to select'}</span>
            </div>
          </SketchCard>
        );
      })}
    </div>
  );
}
