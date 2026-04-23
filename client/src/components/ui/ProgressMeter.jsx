export default function ProgressMeter({ label, value, max, hint, tone = 'teal' }) {
  const safeMax = Math.max(max, 1);
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = Math.round((safeValue / safeMax) * 100);

  return (
    <div className={`progress-meter progress-meter--${tone}`}>
      <div className="progress-meter__header">
        <span>{label}</span>
        <strong>
          {safeValue} / {safeMax}
        </strong>
      </div>

      <div
        aria-label={label}
        aria-valuemax={safeMax}
        aria-valuemin="0"
        aria-valuenow={safeValue}
        className="progress-meter__track"
        role="progressbar"
      >
        <span className="progress-meter__fill" style={{ width: `${percentage}%` }} />
      </div>

      {hint ? <p className="progress-meter__hint">{hint}</p> : null}
    </div>
  );
}

