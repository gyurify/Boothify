import SketchCard from './ui/SketchCard.jsx';

export default function StepCard({ step, title, description }) {
  return (
    <SketchCard as="article" className="step-card" tilt={step.endsWith('1') || step.endsWith('3') ? -1.2 : 1.2}>
      <span className="step-number">{step}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </SketchCard>
  );
}
