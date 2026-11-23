const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
export function emailTemplate({ name, reference, type, customer = false, details = [] }) {
  const rows = customer
    ? ''
    : `<table style="width:100%;border-collapse:collapse">${details
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(
          ([label, value]) =>
            `<tr><th style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #ddd">${escape(label)}</th><td style="white-space:pre-wrap;padding:10px;border-bottom:1px solid #ddd">${escape(value)}</td></tr>`,
        )
        .join('')}</table>`;
  return `<html><body style="font:16px Arial,sans-serif;color:#202020;line-height:1.6;max-width:620px;margin:40px auto"><h1 style="font-size:24px">Paras Prints Solutions</h1><p>${customer ? `Hello ${escape(name)}, thank you for your ${escape(type)}.` : `A new ${escape(type)} has been saved.`}</p><p>Reference: <strong>${escape(reference)}</strong></p>${rows}<p>${customer ? 'Our team will review your requirements and contact you. Pricing and delivery are confirmed in a written quotation.' : 'Reply to this email to contact the customer. Reference attachments are stored privately and can be retrieved through the authorised internal API; no public file links are created.'}</p><p>Paras Prints Solutions · Ghaziabad</p></body></html>`;
}
