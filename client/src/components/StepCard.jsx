export default function StepCard({ step, title, description }) {
  return (
    <article className="step-card tilt-card">
      <span className="step-number">{step}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

