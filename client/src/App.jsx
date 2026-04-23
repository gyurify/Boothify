import { Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import WorkflowGuard from './components/WorkflowGuard.jsx';
import CameraBoothPage from './pages/CameraBoothPage.jsx';
import FinalDownloadPage from './pages/FinalDownloadPage.jsx';
import GenerationPage from './pages/GenerationPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PhotoReviewPage from './pages/PhotoReviewPage.jsx';
import SpotifySelectionPage from './pages/SpotifySelectionPage.jsx';
import StripSelectionPage from './pages/StripSelectionPage.jsx';
import { APP_ROUTES } from './context/boothifyConfig.js';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path={APP_ROUTES.landing} element={<LandingPage />} />
        <Route path={APP_ROUTES.spotify} element={<SpotifySelectionPage />} />
        <Route
          path={APP_ROUTES.stripSelection}
          element={
            <WorkflowGuard stage="stripSelection">
              <StripSelectionPage />
            </WorkflowGuard>
          }
        />
        <Route
          path={APP_ROUTES.camera}
          element={
            <WorkflowGuard stage="camera">
              <CameraBoothPage />
            </WorkflowGuard>
          }
        />
        <Route
          path={APP_ROUTES.review}
          element={
            <WorkflowGuard stage="review">
              <PhotoReviewPage />
            </WorkflowGuard>
          }
        />
        <Route
          path={APP_ROUTES.generation}
          element={
            <WorkflowGuard stage="generation">
              <GenerationPage />
            </WorkflowGuard>
          }
        />
        <Route
          path={APP_ROUTES.download}
          element={
            <WorkflowGuard stage="download">
              <FinalDownloadPage />
            </WorkflowGuard>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
