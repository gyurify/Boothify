import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="content-band">
      <div className="empty-state tilt-card">
        <p className="eyebrow">Wrong turn</p>
        <h2>That page wandered off the strip.</h2>
        <p>The base project scaffold only ships with the home route right now.</p>
        <Link className="link-button" to="/">
          Back home
        </Link>
      </div>
    </section>
  );
}

