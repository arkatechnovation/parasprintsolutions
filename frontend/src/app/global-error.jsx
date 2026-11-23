'use client';
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Arial,sans-serif', padding: 40, color: '#202020' }}>
        <h1>Paras Prints Solutions</h1>
        <p>The website content is temporarily unavailable. Please try again shortly.</p>
        <button onClick={reset}>Try again</button>
        <p>
          <a href="mailto:info@parasprints.com">info@parasprints.com</a>
        </p>
      </body>
    </html>
  );
}
