import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import StepCard from '../components/StepCard.jsx';
import { APP_ROUTES, WORKFLOW_STEPS } from '../context/boothifyConfig.js';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page-stack">
      <section className="page-card page-card--accent">
        <PageIntro
          eyebrow="Boothify"
          title="Photobooth flow, now split into real screens."
          description="This step sets up the frontend architecture: route-level screens, shared session state, guarded navigation, and placeholders for the camera, composition, generation, and download phases."
        />

        <div className="action-row">
          <button
            className="primary-button"
            type="button"
            onClick={() => navigate(APP_ROUTES.spotify)}
          >
            Start session
          </button>
        </div>
      </section>

      <section className="page-grid page-grid--two">
        <div className="page-card">
          <PageIntro
            eyebrow="Workflow"
            title="Planned page sequence"
            description="Each screen owns one job and hands the session forward."
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
        </div>

        <SessionSnapshot />
      </section>
    </div>
  );
}

