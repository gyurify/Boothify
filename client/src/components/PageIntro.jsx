export default function PageIntro({ eyebrow, title, description }) {
  return (
    <div className="page-intro">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

