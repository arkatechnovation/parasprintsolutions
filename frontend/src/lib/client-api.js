export async function post(path, body, { key, token, file } = {}) {
  const response = await fetch('/api/v1' + path, {
    method: 'POST',
    headers: {
      ...(file ? {} : { 'Content-Type': 'application/json' }),
      ...(key ? { 'Idempotency-Key': key } : {}),
      ...(token ? { 'X-Upload-Token': token } : {}),
    },
    body: file || JSON.stringify(body),
  });
  const json = await response.json();
  if (!response.ok || !json.ok) {
    const error = new Error(
      json.error?.message || 'The request could not be completed. Please try again.',
    );
    error.fields = json.error?.fields;
    error.status = response.status;
    throw error;
  }
  return json.data;
}
export function track(name, details = {}) {
  if (
    typeof window !== 'undefined' &&
    window.gtag &&
    localStorage.getItem('paras-analytics-consent') === 'yes'
  )
    window.gtag('event', name, details);
}
