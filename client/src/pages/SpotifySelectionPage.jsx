import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function SpotifySelectionPage() {
  const navigate = useNavigate();
  const {
    appLimits,
    availableTracks,
    selectedTrack,
    session,
    selectTrack,
    setSongClipLength,
    setSpotifyQuery
  } = useBoothify();

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <div className="page-card">
          <PageIntro
            eyebrow="Step 1"
            title="Spotify selection"
            description="This screen owns track choice, search query state, clip timing, and the boundary between Spotify metadata and exportable audio."
          />

          <label className="form-field">
            <span>Search tracks</span>
            <input
              placeholder="Search sample metadata"
              type="text"
              value={session.spotifyQuery}
              onChange={(event) => setSpotifyQuery(event.target.value)}
            />
          </label>

          <div className="option-list">
            {availableTracks.length === 0 ? (
              <p className="helper-text">No sample tracks match that search yet.</p>
            ) : (
              availableTracks.map((track) => {
                const isSelected = selectedTrack?.id === track.id;

                return (
                  <button
                    key={track.id}
                    className={`option-button ${isSelected ? 'is-selected' : ''}`.trim()}
                    type="button"
                    onClick={() => selectTrack(track.id)}
                  >
                    <div className="option-copy">
                      <strong>{track.title}</strong>
                      <span>
                        {track.artist} - {track.durationLabel}
                      </span>
                    </div>
                    <span className="status-chip">
                      {track.previewUrl ? 'Preview clip' : 'Metadata only'}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <label className="form-field">
            <span>Clip length</span>
            <div className="range-row">
              <input
                max={appLimits.maxClipSeconds}
                min={appLimits.minClipSeconds}
                step="1"
                type="range"
                value={session.clipLengthSeconds}
                onChange={(event) => setSongClipLength(event.target.value)}
              />
              <strong>{session.clipLengthSeconds}s</strong>
            </div>
          </label>

          <p className="helper-text">
            Spotify full-track export is not wired into Boothify. The architecture here keeps
            metadata selection separate from preview or fallback export audio logic.
          </p>
        </div>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <button
          className="secondary-button"
          type="button"
          onClick={() => navigate(APP_ROUTES.landing)}
        >
          Back
        </button>
        <button
          className="primary-button"
          disabled={!selectedTrack}
          type="button"
          onClick={() => navigate(APP_ROUTES.stripSelection)}
        >
          Continue to strip selection
        </button>
      </div>
    </div>
  );
}
