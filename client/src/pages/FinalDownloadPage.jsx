import { useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import SessionSnapshot from '../components/SessionSnapshot.jsx';
import SketchButton from '../components/ui/SketchButton.jsx';
import SketchCard from '../components/ui/SketchCard.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';
import { useBoothify } from '../context/BoothifyContext.jsx';

const TIMELINE_BARS = Array.from({ length: 40 }, (_, index) => ({
  height: `${32 + ((index * 17) % 42)}%`,
  id: `bar-${index + 1}`
}));

export default function FinalDownloadPage() {
  const navigate = useNavigate();
  const {
    clipValidation,
    generation,
    selectedTrack,
    setSongClipEnd,
    setSongClipLength,
    setSongClipStart,
    setSongClipTiming,
    songClip
  } = useBoothify();

  const selectionOffsetPercent = (songClip.startSeconds / songClip.trackDurationSeconds) * 100;
  const selectionWidthPercent = (songClip.lengthSeconds / songClip.trackDurationSeconds) * 100;

  return (
    <div className="page-stack">
      <section className="page-grid page-grid--two">
        <SketchCard className="page-card clip-picker-stage" tone="paper">
          <PageIntro
            eyebrow="Step 6"
            title="Pick the exact song clip."
            description="Adjust the timing, trim the start and end, and keep the final soundtrack window saved in Boothify state."
          />

          <div className="clip-picker-layout">
            <div className="clip-track-card">
              {selectedTrack?.artworkUrl ? (
                <img
                  alt={`${selectedTrack.title} artwork`}
                  className="clip-track-card__artwork"
                  src={selectedTrack.artworkUrl}
                />
              ) : (
                <div className="clip-track-card__artwork clip-track-card__artwork--placeholder" />
              )}

              <div className="clip-track-card__copy">
                <p className="eyebrow">Selected soundtrack</p>
                <strong>{selectedTrack ? selectedTrack.title : 'No track selected'}</strong>
                <span>
                  {selectedTrack
                    ? `${selectedTrack.artist} - ${selectedTrack.durationLabel}`
                    : 'Pick a song in Step 1.'}
                </span>
                <span>
                  {selectedTrack?.previewUrl
                    ? 'Spotify preview audio is available for this track.'
                    : 'This track is metadata only, so export audio will need a fallback source.'}
                </span>
              </div>
            </div>

            <div className="clip-timeline-panel">
              <div className="clip-timeline">
                <div className="clip-timeline__waveform" aria-hidden="true">
                  {TIMELINE_BARS.map((bar) => (
                    <span
                      key={bar.id}
                      className="clip-timeline__bar"
                      style={{ height: bar.height }}
                    />
                  ))}

                  <div
                    className="clip-timeline__selection"
                    style={{
                      left: `${selectionOffsetPercent}%`,
                      width: `${selectionWidthPercent}%`
                    }}
                  >
                    <span className="clip-timeline__handle clip-timeline__handle--start" />
                    <span className="clip-timeline__handle clip-timeline__handle--end" />
                  </div>
                </div>

                <div className="clip-timeline__labels">
                  <span>00:00</span>
                  <span>{songClip.trackDurationLabel}</span>
                </div>
              </div>

              <div className="clip-metric-grid">
                <div className="clip-metric-card">
                  <span>Start</span>
                  <strong>{songClip.startLabel}</strong>
                </div>
                <div className="clip-metric-card">
                  <span>End</span>
                  <strong>{songClip.endLabel}</strong>
                </div>
                <div className="clip-metric-card">
                  <span>Length</span>
                  <strong>{songClip.lengthLabel}</strong>
                </div>
                <div className="clip-metric-card">
                  <span>Saved window</span>
                  <strong>{songClip.timingLabel}</strong>
                </div>
              </div>
            </div>

            <div className="clip-control-stack">
              <label className="clip-control">
                <span>Move clip timing</span>
                <input
                  disabled={songClip.shiftMaxSeconds === 0}
                  max={songClip.shiftMaxSeconds}
                  min="0"
                  step="1"
                  type="range"
                  value={songClip.startSeconds}
                  onChange={(event) => setSongClipTiming(event.target.value)}
                />
                <div className="clip-control__meta">
                  <strong>{songClip.timingLabel}</strong>
                  <span>Slides the whole {songClip.lengthSeconds}s clip earlier or later.</span>
                </div>
              </label>

              <label className="clip-control">
                <span>Trim clip length</span>
                <input
                  max={songClip.maxLengthSeconds}
                  min={songClip.minLengthSeconds}
                  step="1"
                  type="range"
                  value={songClip.lengthSeconds}
                  onChange={(event) => setSongClipLength(event.target.value)}
                />
                <div className="clip-control__meta">
                  <strong>{songClip.lengthLabel}</strong>
                  <span>
                    Keep the clip between {songClip.minLengthSeconds}s and {songClip.maxLengthSeconds}s.
                  </span>
                </div>
              </label>

              <div className="clip-control-grid">
                <label className="clip-control">
                  <span>Trim start</span>
                  <input
                    max={songClip.trimStartMaxSeconds}
                    min={songClip.trimStartMinSeconds}
                    step="1"
                    type="range"
                    value={songClip.startSeconds}
                    onChange={(event) => setSongClipStart(event.target.value)}
                  />
                  <div className="clip-control__meta">
                    <strong>{songClip.startLabel}</strong>
                    <span>Moves the opening edge of the selection.</span>
                  </div>
                </label>

                <label className="clip-control">
                  <span>Trim end</span>
                  <input
                    max={songClip.trimEndMaxSeconds}
                    min={songClip.trimEndMinSeconds}
                    step="1"
                    type="range"
                    value={songClip.endSeconds}
                    onChange={(event) => setSongClipEnd(event.target.value)}
                  />
                  <div className="clip-control__meta">
                    <strong>{songClip.endLabel}</strong>
                    <span>Moves the closing edge of the selection.</span>
                  </div>
                </label>
              </div>
            </div>

            <SketchCard
              className={`clip-validation-card ${clipValidation.isValid ? 'is-valid' : ''}`.trim()}
              tone={clipValidation.isValid ? 'mint' : 'blush'}
            >
              <strong>{clipValidation.isValid ? 'Clip saved to session state' : 'Clip needs adjustment'}</strong>
              <p>{clipValidation.note}</p>
              <p>
                Boothify is currently holding {songClip.timingLabel} ({songClip.lengthSeconds}s)
                for this soundtrack.
              </p>
              {generation.previewAsset ? <p>Preview sync: {generation.previewAsset.clipWindowLabel}</p> : null}
            </SketchCard>
          </div>
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
