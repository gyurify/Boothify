import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import SketchButton from '../components/ui/SketchButton.jsx';
import SketchCard from '../components/ui/SketchCard.jsx';
import SketchModal from '../components/ui/SketchModal.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

export default function SpotifySelectionPage() {
  const navigate = useNavigate();
  const [isRulesOpen, setRulesOpen] = useState(false);
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
        <SketchCard className="page-card" tone="sky">
          <PageIntro
            eyebrow="Step 1"
            title="Spotify selection"
            description="Start with the song that sets the mood for the session."
          />

          <div className="action-row action-row--compact">
            <SketchButton onClick={() => setRulesOpen(true)} size="sm" type="button" variant="ghost">
              Spotify rules
            </SketchButton>
          </div>

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
            Full-song export is limited by Spotify rules, so Boothify is prepared for preview audio
            or another approved fallback source.
          </p>
        </SketchCard>

        <SessionSnapshot />
      </section>

      <div className="action-row">
        <SketchButton onClick={() => navigate(APP_ROUTES.landing)} type="button" variant="ghost">
          Back
        </SketchButton>
        <SketchButton
          disabled={!selectedTrack}
          type="button"
          variant="primary"
          onClick={() => navigate(APP_ROUTES.stripSelection)}
        >
          Continue to strip selection
        </SketchButton>
      </div>

      <SketchModal
        actions={
          <SketchButton onClick={() => setRulesOpen(false)} type="button" variant="primary">
            Got it
          </SketchButton>
        }
        eyebrow="Spotify note"
        onClose={() => setRulesOpen(false)}
        open={isRulesOpen}
        title="Metadata is safe, full-song export is not."
      >
        <div className="modal-copy">
          <p>
            Boothify can use Spotify metadata and preview audio when Spotify provides it. Full-song
            export is restricted by Spotify licensing and Web API limits.
          </p>
          <ul className="modal-list">
            <li>Track search belongs to the Spotify metadata layer.</li>
            <li>Export audio belongs to a separate preview-or-fallback layer.</li>
            <li>This keeps the product legally cleaner and technically maintainable.</li>
          </ul>
        </div>
      </SketchModal>
    </div>
  );
}
