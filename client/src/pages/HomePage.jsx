import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import StepCard from '../components/StepCard.jsx';
import StripLayoutGallery from '../components/StripLayoutGallery.jsx';
import { useBoothify } from '../context/BoothifyContext.jsx';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Pick a track',
    description: 'Search Spotify metadata, choose a preview-safe audio clip, and set the timing.'
  },
  {
    step: '02',
    title: 'Snap your session',
    description: 'Capture up to 10 frames, then hand-pick which shots belong in the chosen strip layout.'
  },
  {
    step: '03',
    title: 'Export the vibe',
    description: 'Generate a photostrip plus animated preview, then download the strip, motion export, or both.'
  }
];

export default function HomePage() {
  const { appLimits, selectedLayout, songClipLength, setSongClipLength } = useBoothify();
  const [health, setHealth] = useState({
    loading: true,
    status: 'Checking API...'
  });

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    []
  );

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const response = await axios.get(`${apiBaseUrl}/health`);

        if (!isMounted) {
          return;
        }

        setHealth({
          loading: false,
          status: response.data.status === 'ok' ? 'API ready' : 'API reported an issue'
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setHealth({
          loading: false,
          status: 'API not connected yet'
        });
      }
    }

    checkHealth();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  return (
    <div className="home-page">
      <section className="hero-band">
        <div className="hero-copy">
          <span className="status-bubble">{health.status}</span>
          <h2>Photo booth strips with a music-memory engine underneath.</h2>
          <p>
            The starter experience is in place: layout selection, clip timing, API wiring, and the
            scaffold for Spotify-aware exports that respect preview-only limitations.
          </p>

          <div className="hero-metrics">
            <div className="metric-card tilt-card">
              <span>Max shots</span>
              <strong>{appLimits.maxShots}</strong>
            </div>
            <div className="metric-card tilt-card">
              <span>Default clip</span>
              <strong>{appLimits.defaultClipSeconds}s</strong>
            </div>
            <div className="metric-card tilt-card">
              <span>Selected layout</span>
              <strong>{selectedLayout.label}</strong>
            </div>
          </div>
        </div>

        <div className="hero-panel tilt-card">
          <div className="hero-panel__top">
            <span className="pill">Session starter</span>
            <span className="pill subtle">{selectedLayout.stripSizeLabel}</span>
          </div>

          <div className="slider-block">
            <label htmlFor="clip-length">Song clip length</label>
            <div className="slider-row">
              <input
                id="clip-length"
                type="range"
                min="5"
                max="30"
                step="1"
                value={songClipLength}
                onChange={(event) => setSongClipLength(Number(event.target.value))}
              />
              <strong>{songClipLength}s</strong>
            </div>
          </div>

          <div className="session-note">
            <p>Current plan</p>
            <strong>
              Capture up to {appLimits.maxShots} shots, then choose {selectedLayout.photoCount} for
              the strip.
            </strong>
          </div>
        </div>
      </section>

      <section className="content-band">
        <div className="section-heading">
          <p className="eyebrow">Flow map</p>
          <h3>Boothify product journey</h3>
        </div>

        <div className="step-grid">
          {WORKFLOW_STEPS.map((item) => (
            <StepCard key={item.step} {...item} />
          ))}
        </div>
      </section>

      <section className="content-band">
        <div className="section-heading">
          <p className="eyebrow">Strip chooser</p>
          <h3>Supported photobooth layouts</h3>
        </div>

        <StripLayoutGallery />
      </section>
    </div>
  );
}

