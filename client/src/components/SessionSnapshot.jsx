import { useBoothify } from '../context/BoothifyContext.jsx';

export default function SessionSnapshot() {
  const { progress, selectedLayout, selectedStripShots, selectedTrack, session } = useBoothify();

  return (
    <aside className="page-card session-snapshot">
      <p className="eyebrow">Session state</p>
      <div className="snapshot-grid">
        <div>
          <span>Track</span>
          <strong>
            {selectedTrack ? `${selectedTrack.title} - ${selectedTrack.artist}` : 'Not selected'}
          </strong>
        </div>
        <div>
          <span>Clip length</span>
          <strong>{session.clipLengthSeconds}s</strong>
        </div>
        <div>
          <span>Layout</span>
          <strong>{selectedLayout.label}</strong>
        </div>
        <div>
          <span>Captured shots</span>
          <strong>{session.capturedShots.length}</strong>
        </div>
        <div>
          <span>Strip picks</span>
          <strong>
            {selectedStripShots.length} / {selectedLayout.photoCount}
          </strong>
        </div>
        <div>
          <span>Preview</span>
          <strong>{progress.hasGeneratedPreview ? 'Ready' : 'Pending'}</strong>
        </div>
      </div>
    </aside>
  );
}

