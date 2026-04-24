import { useBoothify } from '../context/BoothifyContext.jsx';
import ProgressMeter from './ui/ProgressMeter.jsx';
import SketchCard from './ui/SketchCard.jsx';

export default function SessionSnapshot() {
  const { appLimits, progress, selectedLayout, selectedStripShots, selectedTrack, session, songClip } =
    useBoothify();

  return (
    <SketchCard as="aside" className="session-snapshot" tone="mint">
      <p className="eyebrow">Session state</p>
      <div className="snapshot-grid">
        <div>
          <span>Track</span>
          <strong>
            {selectedTrack ? `${selectedTrack.title} - ${selectedTrack.artist}` : 'Not selected'}
          </strong>
        </div>
        <div>
          <span>Song clip</span>
          <strong>{songClip.timingLabel}</strong>
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

      <div className="snapshot-progress-stack">
        <ProgressMeter
          hint="Up to ten captures per session."
          label="Shot count"
          max={appLimits.maxShots}
          tone="gold"
          value={session.capturedShots.length}
        />
        <ProgressMeter
          hint={`Fill all ${selectedLayout.photoCount} slots for export.`}
          label="Strip fill"
          max={selectedLayout.photoCount}
          tone="pink"
          value={selectedStripShots.length}
        />
      </div>
    </SketchCard>
  );
}
