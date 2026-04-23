import { useBoothify } from '../context/BoothifyContext.jsx';
import SketchCard from './ui/SketchCard.jsx';

export default function StripLayoutGallery() {
  const { availableLayouts, selectLayout, session } = useBoothify();

  return (
    <div className="layout-grid">
      {availableLayouts.map((layout, index) => {
        const isActive = layout.id === session.selectedLayoutId;

        return (
          <SketchCard
            as="button"
            key={layout.id}
            className={`layout-card tilt-card ${isActive ? 'is-active' : ''}`}
            interactive
            onClick={() => selectLayout(layout.id)}
            aria-pressed={isActive}
            tilt={index % 2 === 0 ? -1.2 : 1.2}
            type="button"
          >
            <div className="layout-card__header">
              <strong>{layout.label}</strong>
              <span>{layout.photoCount} shots</span>
            </div>

            <div
              className="strip-preview"
              style={{
                gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
                gridTemplateRows: `repeat(${layout.rows}, 1fr)`
              }}
            >
              {Array.from({ length: layout.photoCount }).map((_, cellIndex) => (
                <span key={`${layout.id}-${cellIndex}`} className="strip-preview__cell" />
              ))}
            </div>

            <div className="layout-card__meta">
              <span>{layout.stripSizeLabel}</span>
              <span>{layout.photoSizeLabel}</span>
            </div>
          </SketchCard>
        );
      })}
    </div>
  );
}
