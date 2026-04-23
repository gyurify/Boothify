import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import SketchButton from '../components/ui/SketchButton.jsx';
import SketchCard from '../components/ui/SketchCard.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

const DOWNLOAD_ORDER = ['motion', 'strip', 'bundle'];

export default function FinalDownloadPage() {
  const navigate = useNavigate();
  const { generation } = useBoothify();

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <SketchCard className="page-card" tone="gold">
          <PageIntro
            eyebrow="Step 6"
            title="Final download screen"
            description="Choose how you want to take the session home: motion, strip-only, or the full bundle."
          />

          <div className="download-grid">
            {DOWNLOAD_ORDER.map((key) => {
              const asset = generation.downloads[key];

              return (
                <SketchCard as="article" key={key} className="download-card" tone="paper">
                  <strong>{asset?.label || 'Pending asset'}</strong>
                  <p>{asset?.filename || 'Generated filename will appear here.'}</p>
                  <SketchButton disabled type="button" variant="ghost">
                    Download wiring later
                  </SketchButton>
                </SketchCard>
              );
            })}
          </div>

          <p className="helper-text">
            Everything is lined up for the final handoff once export wiring is added.
          </p>
        </SketchCard>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <SketchButton onClick={() => navigate(APP_ROUTES.generation)} type="button" variant="ghost">
          Back
        </SketchButton>
      </div>
    </div>
  );
}
