import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import StepCard from '../components/StepCard.jsx';
import SketchButton from '../components/ui/SketchButton.jsx';
import SketchCard from '../components/ui/SketchCard.jsx';
import { APP_ROUTES, WORKFLOW_STEPS } from '../context/boothifyConfig.js';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page-stack">
      <SketchCard className="page-card page-card--accent" tone="blush">
        <PageIntro
          eyebrow="Boothify"
          title="Photobooth flow, now with a real sketchbook skin."
          description="Pick a soundtrack, choose a strip, step into the booth, and leave with motion plus print-ready memories."
        />

        <div className="action-row">
          <SketchButton onClick={() => navigate(APP_ROUTES.spotify)} type="button" variant="primary">
            Start session
          </SketchButton>
        </div>
      </SketchCard>

      <section className="page-grid page-grid--two">
        <SketchCard className="page-card" tone="paper">
          <PageIntro
            eyebrow="Workflow"
            title="Planned page sequence"
            description="A smooth path from soundtrack choice to strip delivery."
          />

          <div className="step-grid">
            {WORKFLOW_STEPS.slice(1).map((step, index) => (
              <StepCard
                key={step.id}
                step={String(index + 1).padStart(2, '0')}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </SketchCard>

        <SessionSnapshot />
      </section>
    </div>
  );
}
