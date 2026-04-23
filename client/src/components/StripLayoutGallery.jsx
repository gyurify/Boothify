import { useBoothify } from '../context/BoothifyContext.jsx';

export default function StripLayoutGallery() {
  const { availableLayouts, selectedLayoutId, selectLayout } = useBoothify();

  return (
    <div className="layout-grid">
      {availableLayouts.map((layout, index) => {
        const isActive = layout.id === selectedLayoutId;

        return (
          <button
            key={layout.id}
            type="button"
            className={`layout-card tilt-card ${isActive ? 'is-active' : ''}`}
            onClick={() => selectLayout(layout.id)}
            aria-pressed={isActive}
            style={{ '--tilt': `${index % 2 === 0 ? -1.2 : 1.2}deg` }}
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
          </button>
        );
      })}
    </div>
  );
}

