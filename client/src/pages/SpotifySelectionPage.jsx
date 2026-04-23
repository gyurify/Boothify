import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyTrackList from '../components/spotify/SpotifyTrackList.jsx';
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
    loadSpotifyConfiguration,
    searchSpotifyTracks,
    selectedTrack,
    selectTrack,
    session,
    setSongClipLength,
    setSpotifyQuery,
    spotify
  } = useBoothify();

  useEffect(() => {
    void loadSpotifyConfiguration();
  }, [loadSpotifyConfiguration]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    void searchSpotifyTracks(spotify.query);
  }

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <SketchCard className="page-card" tone="sky">
          <PageIntro
            eyebrow="Step 1"
            title="Spotify selection"
            description="Search Spotify metadata, pick a track, and set the clip length for the export phase."
          />

          <div className="action-row action-row--compact">
            <SketchButton onClick={() => setRulesOpen(true)} size="sm" type="button" variant="ghost">
              Spotify rules
            </SketchButton>
          </div>

          <SketchCard className="spotify-connection-card" tone={spotify.auth.useMockData ? 'gold' : 'mint'}>
            <div className="spotify-connection-card__header">
              <div>
                <p className="eyebrow">Backend mode</p>
                <h3>{spotify.auth.useMockData ? 'Mock fallback active' : 'Spotify search active'}</h3>
              </div>
              <span className="status-chip">
                {spotify.auth.useMockData ? 'Mock data' : spotify.auth.mode}
              </span>
            </div>
            <p>{spotify.auth.note}</p>
          </SketchCard>

          <form className="spotify-search-form" onSubmit={handleSearchSubmit}>
            <label className="form-field">
              <span>Search tracks</span>
              <div className="spotify-search-row">
                <input
                  placeholder="Search by title or artist"
                  type="search"
                  value={spotify.query}
                  onChange={(event) => setSpotifyQuery(event.target.value)}
                />
                <SketchButton
                  disabled={spotify.status === 'loading' || !spotify.query.trim()}
                  type="submit"
                  variant="primary"
                >
                  {spotify.status === 'loading' ? 'Searching...' : 'Search'}
                </SketchButton>
              </div>
            </label>
          </form>

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

          <div className="spotify-search-summary">
            <span className="pill">{spotify.source === 'mock' ? 'Mock source' : 'Spotify source'}</span>
            {spotify.hasSearched ? (
              <span className="pill pill--paper">{availableTracks.length} results</span>
            ) : null}
          </div>

          <p className="helper-text">{spotify.note}</p>

          {spotify.error ? <p className="spotify-error-text">{spotify.error}</p> : null}

          {selectedTrack ? (
            <SketchCard className="selected-track-summary" tone="blush">
              <img
                alt={`${selectedTrack.title} artwork`}
                className="selected-track-summary__artwork"
                src={selectedTrack.artworkUrl}
              />
              <div className="selected-track-summary__copy">
                <p className="eyebrow">Selected soundtrack</p>
                <strong>{selectedTrack.title}</strong>
                <span>
                  {selectedTrack.artist} - {selectedTrack.durationLabel}
                </span>
              </div>
            </SketchCard>
          ) : null}

          {!spotify.hasSearched ? (
            <SketchCard className="spotify-empty-state" tone="paper">
              <strong>Start with a search.</strong>
              <p>Type a song title or artist to fetch results from Spotify or the mock fallback.</p>
            </SketchCard>
          ) : availableTracks.length === 0 ? (
            <SketchCard className="spotify-empty-state" tone="paper">
              <strong>No tracks found.</strong>
              <p>Try a broader song title, artist name, or shorter keyword.</p>
            </SketchCard>
          ) : (
            <SpotifyTrackList
              selectedTrackId={selectedTrack?.id || null}
              tracks={availableTracks}
              onSelectTrack={selectTrack}
            />
          )}
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
            <li>Swap mock mode for real credentials in the backend env file when ready.</li>
          </ul>
        </div>
      </SketchModal>
    </div>
  );
}
