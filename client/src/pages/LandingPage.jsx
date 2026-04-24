import { useNavigate } from 'react-router-dom';
import SketchButton from '../components/ui/SketchButton.jsx';
import { APP_ROUTES } from '../context/boothifyConfig.js';

const FEATURED_STRIPS = [
  ['#1f1f1f', '#2c2c2c', '#505050', '#1f1f1f'],
  ['#202020', '#d7d7d7', '#2f2f2f', '#171717'],
  ['#d1b9a6', '#c78974', '#caaa93', '#a56c56'],
  ['#a36f5c', '#d3b59a', '#996251', '#c3967a'],
  ['#1e1e1e', '#4e4e4e', '#282828', '#101010']
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-scene">
      <div className="storefront-sign" aria-hidden="true">
        <span>PHOTOBOOTH</span>
      </div>

      <section className="storefront-booth" aria-labelledby="landing-title">
        <div className="storefront-panel storefront-panel--gallery">
          <div className="featured-frame">
            <div className="featured-frame__inner">
              <div className="featured-strips" aria-hidden="true">
                {FEATURED_STRIPS.map((strip, stripIndex) => (
                  <div key={`strip-${stripIndex + 1}`} className="sample-strip">
                    {strip.map((tone, cellIndex) => (
                      <span
                        key={`strip-${stripIndex + 1}-cell-${cellIndex + 1}`}
                        className="sample-strip__cell"
                        style={{ backgroundColor: tone }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="storefront-callout">featured strips</p>

          <div className="coin-slot" aria-hidden="true">
            <span className="coin-slot__plate" />
            <span className="coin-slot__slot" />
            <span className="coin-slot__slot coin-slot__slot--tall" />
          </div>

          <p className="storefront-credit">made by Boothify</p>
        </div>

        <div className="storefront-panel storefront-panel--curtain">
          <div className="booth-curtain" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="booth-seat" aria-hidden="true" />
          <SketchButton
            className="storefront-enter"
            onClick={() => navigate(APP_ROUTES.spotify)}
            type="button"
            variant="primary"
          >
            enter -&gt;
          </SketchButton>
        </div>

        <div className="storefront-panel storefront-panel--mirror">
          <div className="mirror-frame" aria-hidden="true">
            <span className="mirror-frame__shine mirror-frame__shine--top" />
            <span className="mirror-frame__shine mirror-frame__shine--bottom" />
          </div>
        </div>
      </section>

      <div className="landing-copy">
        <p className="eyebrow">Boothify</p>
        <h2 id="landing-title">Step into a hand-drawn booth flow.</h2>
        <p>
          Pick a soundtrack, choose a strip, and move through the kiosk like you are standing in
          front of the machine.
        </p>
      </div>

      <div className="landing-footer-links" aria-hidden="true">
        <span>Privacy Policy</span>
        <span>FAQ</span>
        <span>About Boothify</span>
        <span>Contact</span>
      </div>
    </div>
  );
}
