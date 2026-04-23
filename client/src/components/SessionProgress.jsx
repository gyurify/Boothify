import { NavLink } from 'react-router-dom';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function SessionProgress() {
  const { workflow } = useBoothify();

  return (
    <nav className="workflow-nav" aria-label="Boothify session flow">
      {workflow.map((step, index) => {
        const content = (
          <>
            <span className="workflow-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="workflow-copy">
              <strong>{step.label}</strong>
              <small>{step.complete ? 'Ready' : 'Pending'}</small>
            </span>
          </>
        );

        if (!step.unlocked) {
          return (
            <span key={step.id} className="workflow-link is-locked">
              {content}
            </span>
          );
        }

        return (
          <NavLink
            key={step.id}
            className={({ isActive }) =>
              `workflow-link ${isActive ? 'is-active' : ''}`.trim()
            }
            end={step.path === '/'}
            to={step.path}
          >
            {content}
          </NavLink>
        );
      })}
    </nav>
  );
}

