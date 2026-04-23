import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function WorkflowGuard({ stage, children }) {
  const { routeAccess } = useBoothify();
  const guard = routeAccess[stage];

  if (!guard?.allowed) {
    return <Navigate replace to={guard?.fallbackPath || APP_ROUTES.landing} />;
  }

  return children;
}

