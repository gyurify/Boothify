const PREVIEW_TONES = [
  ['#d9d9d9', '#b6b6b6'],
  ['#d1b49c', '#b87e67'],
  ['#181818', '#535353'],
  ['#d8d3c8', '#9f9b96'],
  ['#cab0a2', '#896759'],
  ['#d0d0d0', '#7a7a7a']
];

export default function PhotoboothStripPreview({ layout, className = '', variant = 'card' }) {
  const cells = Array.from({ length: layout.photoCount }).map((_, index) => {
    const palette = PREVIEW_TONES[index % PREVIEW_TONES.length];

    return (
      <span
        key={`${layout.id}-photo-${index + 1}`}
        className="photobooth-strip__frame"
        style={{
          background: `linear-gradient(160deg, ${palette[0]} 0%, ${palette[1]} 100%)`
        }}
      >
        <span className="photobooth-strip__flash" />
      </span>
    );
  });

  return (
    <div
      className={`photobooth-strip photobooth-strip--${variant} ${
        layout.columns > 1 ? 'photobooth-strip--grid' : ''
      } ${className}`.trim()}
    >
      <div className="photobooth-strip__paper">
        <div className="photobooth-strip__brand">Boothify</div>
        <div
          className="photobooth-strip__photos"
          style={{
            gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, 1fr)`
          }}
        >
          {cells}
        </div>
        <div className="photobooth-strip__footer">
          <span className="photobooth-strip__mark" />
          <span className="photobooth-strip__caption">{layout.stripSizeLabel}</span>
          <span className="photobooth-strip__mark" />
        </div>
      </div>
    </div>
  );
}
