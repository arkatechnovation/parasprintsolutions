'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Paperclip } from 'lucide-react';
import { post, track } from '@/lib/client-api';
export function Field({ name, label, error, children, ...props }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children || (
        <input
          id={name}
          name={name}
          className="form-control"
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
      )}{' '}
      {error && (
        <span id={`${name}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
export default function LeadForm({
  type = 'enquiry',
  products = [],
  preselected = '',
  initial = {},
}) {
  const quote = type === 'quotation';
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const [files, setFiles] = useState([]);
  const requestKey = useRef(null);
  const uploadSession = useRef(null);
  const uploaded = useRef(new Map());
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setBusy(true);
    setError('');
    setFields({});
    const data = Object.fromEntries(new FormData(form));
    const body = {
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || '',
        city: data.city || '',
      },
      source: quote ? 'request-a-quote' : 'contact',
      website: data.website || '',
    };
    try {
      requestKey.current ||= crypto.randomUUID();
      if (quote) {
        const attachmentIds = [];
        if (files.length) {
          if (!uploadSession.current)
            uploadSession.current = (
              await post('/uploads/session', { website: data.website || '' })
            ).token;
          for (const file of files) {
            if (
              file.size > 10 * 1024 * 1024 ||
              !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
            )
              throw new Error(
                'Each attachment must be a JPG, PNG or PDF file no larger than 10 MB.',
              );
            let id = uploaded.current.get(file);
            if (!id) {
              const payload = new FormData();
              payload.append('file', file);
              id = (await post('/uploads', null, { token: uploadSession.current, file: payload }))
                .id;
              uploaded.current.set(file, id);
            }
            attachmentIds.push(id);
          }
        }
        Object.assign(body, {
          productSlug: data.productSlug,
          requirements: data.requirements,
          quantity: Number(data.quantity),
          dimensions: data.dimensions || '',
          material: data.material || '',
          printing: data.printing || '',
          finishing: data.finishing || '',
          attachmentIds,
          uploadToken: uploadSession.current || '',
        });
      } else
        Object.assign(body, {
          subject: data.subject,
          message: data.message,
          productSlug: data.productSlug || '',
        });
      const result = await post(quote ? '/quotations' : '/enquiries', body, {
        key: requestKey.current,
      });
      track(quote ? 'quote_submitted' : 'contact_submitted');
      router.push(`/thank-you?reference=${encodeURIComponent(result.reference)}`);
    } catch (err) {
      if (quote && err.status === 401) {
        uploadSession.current = null;
        uploaded.current.clear();
      }
      setError(err.message);
      setFields(err.fields || {});
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="lead-form">
      <div className="row g-3">
        <div className="col-md-6">
          <Field
            name="name"
            label="Full name *"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            error={fields['customer.name']}
          />
        </div>
        <div className="col-md-6">
          <Field name="company" label="Company" maxLength={200} autoComplete="organization" />
        </div>
        <div className="col-md-6">
          <Field
            name="email"
            label="Email address *"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            error={fields['customer.email']}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="phone"
            label="Phone number *"
            type="tel"
            required
            minLength={7}
            maxLength={40}
            autoComplete="tel"
            error={fields['customer.phone']}
          />
        </div>
        <div className={quote ? 'col-md-6' : 'col-12'}>
          <Field name="city" label="Delivery city" maxLength={120} autoComplete="address-level2" />
        </div>
        {quote ? (
          <>
            <div className="col-md-6">
              <Field name="productSlug" label="Product *" error={fields.productSlug}>
                <select
                  className="form-select"
                  id="productSlug"
                  name="productSlug"
                  defaultValue={preselected}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="col-md-6">
              <Field
                name="quantity"
                label="Required quantity *"
                type="number"
                min="1"
                max="10000000"
                required
                defaultValue={initial.quantity || ''}
                error={fields.quantity}
              />
            </div>
            <div className="col-md-6">
              <Field
                name="dimensions"
                label="Dimensions and unit"
                placeholder="Length × width × height in mm"
                maxLength={300}
                defaultValue={initial.dimensions || ''}
              />
            </div>
            <div className="col-md-6">
              <Field
                name="material"
                label="Material requirements"
                maxLength={300}
                placeholder="Specify a grade or ask for advice"
              />
            </div>
            <div className="col-md-6">
              <Field
                name="printing"
                label="Printing requirements"
                maxLength={300}
                placeholder="Colours, print areas or artwork status"
              />
            </div>
            <div className="col-12">
              <Field
                name="finishing"
                label="Finishing requirements"
                maxLength={1000}
                placeholder="Lamination, binding, foil or other requirements"
              />
            </div>
            <div className="col-12">
              <Field
                name="requirements"
                label="Product requirements and additional notes *"
                error={fields.requirements}
              >
                <textarea
                  className="form-control"
                  name="requirements"
                  id="requirements"
                  required
                  minLength={10}
                  maxLength={10000}
                  rows={5}
                  placeholder="Tell us about the product, its use and your delivery requirements."
                />
              </Field>
            </div>
            <div className="col-12 upload-field">
              <label htmlFor="artwork">
                <Paperclip size={17} /> Artwork or reference files
              </label>
              <input
                id="artwork"
                className="form-control"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                multiple
                onChange={(e) => {
                  const chosen = Array.from(e.target.files || []);
                  if (chosen.length > 3) {
                    setError('Choose up to three files.');
                    e.target.value = '';
                    setFiles([]);
                  } else {
                    setError('');
                    uploadSession.current = null;
                    uploaded.current.clear();
                    setFiles(chosen);
                  }
                }}
              />
              <small>
                Up to 3 JPG, PNG or PDF files. Maximum 10 MB each. Attachments are stored privately.
              </small>
              {files.length > 0 && (
                <p className="file-list">{files.map((f) => f.name).join(', ')}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="col-12">
              <Field name="subject" label="Subject *" required minLength={2} maxLength={200} />
            </div>
            <div className="col-12">
              <Field name="message" label="Your message *" error={fields.message}>
                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  required
                  minLength={10}
                  maxLength={10000}
                  rows={6}
                />
              </Field>
            </div>
          </>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <p className="form-note">
        We use your details to respond to this request. Read our{' '}
        <Link href="/privacy-policy">privacy policy</Link>. Submission does not place an order.
      </p>
      <button type="submit" className="button" disabled={busy}>
        {busy ? 'Saving your request…' : quote ? 'Request a quotation' : 'Send your enquiry'}
        <ArrowUpRight size={17} />
      </button>
      <p role="status" className="sr-only">
        {busy ? 'Your request is being submitted.' : ''}
      </p>
    </form>
  );
}
