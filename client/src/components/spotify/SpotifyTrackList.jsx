import SketchCard from '../ui/SketchCard.jsx';

const FALLBACK_ARTWORK_URL =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22240%22%20height%3D%22240%22%20viewBox%3D%220%200%20240%20240%22%3E%3Crect%20width%3D%22240%22%20height%3D%22240%22%20rx%3D%2226%22%20fill%3D%22%23fff3df%22/%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22204%22%20height%3D%22204%22%20rx%3D%2224%22%20fill%3D%22%23f6d487%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2258%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%23211b16%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2254%22%20font-weight%3D%22700%22%3EB%3C/text%3E%3C/svg%3E';

export default function SpotifyTrackList({ selectedTrackId, tracks, onSelectTrack }) {
  return (
    <div className="spotify-track-list">
      {tracks.map((track) => {
        const isSelected = selectedTrackId === track.id;

        return (
          <SketchCard
            as="button"
            key={track.id}
            className={`spotify-track-card ${isSelected ? 'is-selected' : ''}`.trim()}
            interactive
            onClick={() => onSelectTrack(track)}
            tone={isSelected ? 'mint' : 'paper'}
            type="button"
          >
            <img
              alt={`${track.title} artwork`}
              className="spotify-track-card__artwork"
              src={track.artworkUrl || FALLBACK_ARTWORK_URL}
            />

            <div className="spotify-track-card__copy">
              <div className="spotify-track-card__headline">
                <strong>{track.title}</strong>
                <span>{track.artist}</span>
              </div>

              <div className="spotify-track-card__meta">
                <span>{track.durationLabel}</span>
                <span>{track.previewUrl ? 'Preview clip' : 'Metadata only'}</span>
              </div>
            </div>

            <span className="status-chip">{isSelected ? 'Selected' : 'Choose'}</span>
          </SketchCard>
        );
      })}
    </div>
  );
}
