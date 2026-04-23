import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

const DOWNLOAD_ORDER = ['motion', 'strip', 'bundle'];

export default function FinalDownloadPage() {
  const navigate = useNavigate();
  const { generation } = useBoothify();

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <div className="page-card">
          <PageIntro
            eyebrow="Step 6"
            title="Final download screen"
            description="This route is the final delivery layer. The export actions are placeholders for now, but the screen and state contract are ready."
          />

          <div className="download-grid">
            {DOWNLOAD_ORDER.map((key) => {
              const asset = generation.downloads[key];

              return (
                <article key={key} className="download-card">
                  <strong>{asset?.label || 'Pending asset'}</strong>
                  <p>{asset?.filename || 'Generated filename will appear here.'}</p>
                  <button className="secondary-button" disabled type="button">
                    Download wiring later
                  </button>
                </article>
              );
            })}
          </div>

          <p className="helper-text">
            This step intentionally stops at delivery architecture: three download choices and a
            stable destination for future export handlers.
          </p>
        </div>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <button
          className="secondary-button"
          type="button"
          onClick={() => navigate(APP_ROUTES.generation)}
        >
          Back
        </button>
      </div>
    </div>
  );
}

