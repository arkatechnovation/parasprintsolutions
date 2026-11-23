'use client';
export default function ErrorPage({ reset }) {
  return (
    <section className="section">
      <div className="container narrow-content">
        <p className="eyebrow">TEMPORARILY UNAVAILABLE</p>
        <h1>We couldn’t load this content.</h1>
        <p>
          Please try again. You can also contact the team directly using the details in the footer.
        </p>
        <button className="button" onClick={reset}>
          Try again
        </button>
      </div>
    </section>
  );
}
