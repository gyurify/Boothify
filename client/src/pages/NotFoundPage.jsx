import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page-card empty-state">
        <p className="eyebrow">Wrong turn</p>
        <h2>That page wandered off the strip.</h2>
        <p>The route is missing, but the Boothify flow is wired and ready from the landing page.</p>
        <Link className="link-button" to="/">
          Back home
        </Link>
    </section>
  );
}
