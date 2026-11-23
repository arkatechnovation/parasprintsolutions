'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { post, track } from '@/lib/client-api';
import { Field } from './LeadForm';
const titles = [
  'Product',
  'Box style',
  'Dimensions',
  'Material',
  'Printing & finish',
  'Quantity',
  'Review',
  'Your details',
];
export default function CalculatorWizard({ settings, products }) {
  const defaults = {
    product: settings.products[0],
    style: settings.styles[0].value,
    length: '',
    width: '',
    height: '',
    unit: 'mm',
    material: settings.materials[0].value,
    printing: settings.printing[0].value,
    finishing: [],
    quantity: '',
  };
  const [config, setConfig] = useState(defaults);
  const [step, setStep] = useState(0);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const form = useRef(null);
  const heading = useRef(null);
  const key = useRef(null);
  const router = useRouter();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(sessionStorage.getItem('paras-packaging-brief'));
        if (saved && settings.products.includes(saved.product))
          setConfig({ ...defaults, ...saved });
      } catch {}
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    try {
      if (ready) sessionStorage.setItem('paras-packaging-brief', JSON.stringify(config));
    } catch {
      // Keep the wizard usable when browser storage is disabled.
    }
  }, [config, ready]);
  const update = (field, value) => {
    setConfig((c) => ({ ...c, [field]: value }));
    setError('');
  };
  const options = (list) => settings[list].filter((o) => o.products.includes(config.product));
  const configuration = () => ({
    ...config,
    length: Number(config.length),
    width: Number(config.width),
    height: Number(config.height),
    quantity: Number(config.quantity),
  });
  async function next(e) {
    e.preventDefault();
    if (!form.current.reportValidity()) return;
    setError('');
    if (step === 2) {
      const factor = { mm: 1, cm: 10, in: 25.4 }[config.unit];
      if (
        [config.length, config.width, config.height].some(
          (n) => Number(n) * factor > settings.maxDimensionMm,
        )
      ) {
        setError('These dimensions exceed the calculator’s input limits. Please contact the team.');
        return;
      }
    }
    if (step === 5) {
      setBusy(true);
      try {
        setEstimate(await post('/calculator/estimate', configuration()));
        track('calculator_completed');
      } catch (err) {
        setError(err.message);
        setBusy(false);
        return;
      }
      setBusy(false);
    }
    if (step === 0) track('calculator_started');
    setStep((s) => Math.min(s + 1, 7));
    requestAnimationFrame(() => heading.current?.focus());
  }
  async function submit(e) {
    e.preventDefault();
    if (!form.current.reportValidity()) return;
    setBusy(true);
    setError('');
    const fields = Object.fromEntries(new FormData(form.current));
    try {
      key.current ||= crypto.randomUUID();
      const data = await post(
        '/calculator/submit',
        {
          configuration: configuration(),
          customer: {
            name: fields.name,
            email: fields.email,
            phone: fields.phone,
            company: fields.company || '',
            city: fields.city || '',
          },
          requirements: fields.requirements || '',
          source: 'packaging-calculator',
          website: fields.website || '',
        },
        { key: key.current },
      );
      sessionStorage.removeItem('paras-packaging-brief');
      track('calculator_submitted');
      router.push(`/thank-you?reference=${data.reference}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }
  const label = (list, value) => settings[list].find((o) => o.value === value)?.label || value;
  return (
    <div className="calculator">
      <aside className="calculator-progress">
        <p className="eyebrow">YOUR PACKAGING BRIEF</p>
        <h2>
          A few details.
          <br />A clearer quotation.
        </h2>
        <ol>
          {titles.map((title, i) => (
            <li
              key={title}
              className={i === step ? 'current' : i < step ? 'complete' : ''}
              aria-current={i === step ? 'step' : undefined}
            >
              <span>{i < step ? <Check size={15} /> : String(i + 1).padStart(2, '0')}</span>
              {title}
            </li>
          ))}
        </ol>
        <p>
          Your specifications stay on this device for this browser session. No price is invented.
        </p>
      </aside>
      <form ref={form} onSubmit={step === 7 ? submit : next} className="calculator-body">
        <p className="eyebrow">
          STEP {step + 1} OF {titles.length}
        </p>
        <h2 tabIndex={-1} ref={heading}>
          {titles[step]}
        </h2>
        {step === 0 && (
          <>
            <p>Choose the packaging product you want to discuss.</p>
            <div className="choice-list">
              {settings.products.map((slug) => (
                <label className={config.product === slug ? 'selected' : ''} key={slug}>
                  <input
                    type="radio"
                    name="product"
                    value={slug}
                    checked={config.product === slug}
                    onChange={() => {
                      setConfig((c) => ({
                        ...c,
                        product: slug,
                        style: settings.styles.find((s) => s.products.includes(slug)).value,
                        material: settings.materials.find((s) => s.products.includes(slug)).value,
                        printing: settings.printing.find((s) => s.products.includes(slug)).value,
                        finishing: [],
                      }));
                    }}
                  />
                  {products.find((p) => p.slug === slug)?.name || slug}
                </label>
              ))}
            </div>
          </>
        )}
        {step === 1 && (
          <Field name="style" label="Box configuration">
            <select
              id="style"
              className="form-select"
              value={config.style}
              onChange={(e) => update('style', e.target.value)}
            >
              {options('styles').map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        )}
        {step === 2 && (
          <>
            <p>
              Enter internal dimensions. Include space for the packing arrangement. Software input
              limits do not indicate manufacturing capability.
            </p>
            <div className="row g-3">
              {['length', 'width', 'height'].map((name) => (
                <div key={name} className="col-sm-4">
                  <Field
                    name={name}
                    label={name[0].toUpperCase() + name.slice(1) + ' *'}
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={settings.maxDimensionMm}
                    required
                    value={config[name]}
                    onChange={(e) => update(name, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <Field name="unit" label="Measurement unit">
              <select
                id="unit"
                className="form-select"
                value={config.unit}
                onChange={(e) => update('unit', e.target.value)}
              >
                <option value="mm">Millimetres (mm)</option>
                <option value="cm">Centimetres (cm)</option>
                <option value="in">Inches (in)</option>
              </select>
            </Field>
          </>
        )}
        {step === 3 && (
          <>
            <Field name="material" label="Material preference">
              <select
                id="material"
                className="form-select"
                value={config.material}
                onChange={(e) => update('material', e.target.value)}
              >
                {options('materials').map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <p className="form-note">
              The team will confirm the grade and suitability for your product.
            </p>
          </>
        )}
        {step === 4 && (
          <>
            <Field name="printing" label="Printing requirement">
              <select
                id="printing"
                className="form-select"
                value={config.printing}
                onChange={(e) => update('printing', e.target.value)}
              >
                {options('printing').map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <fieldset>
              <legend>Finishing preferences (optional)</legend>
              <div className="choice-list">
                {options('finishing').map((o) => (
                  <label
                    key={o.value}
                    className={config.finishing.includes(o.value) ? 'selected' : ''}
                  >
                    <input
                      type="checkbox"
                      checked={config.finishing.includes(o.value)}
                      onChange={(e) =>
                        update(
                          'finishing',
                          e.target.checked
                            ? [...config.finishing, o.value]
                            : config.finishing.filter((f) => f !== o.value),
                        )
                      }
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}
        {step === 5 && (
          <>
            <Field
              name="quantity"
              label="Required quantity *"
              type="number"
              min="1"
              max={settings.maxQuantity}
              step="1"
              required
              value={config.quantity}
              onChange={(e) => update('quantity', e.target.value)}
            />
            <p className="form-note">
              Enter the quantity you need. The company will confirm its order minimum and production
              suitability.
            </p>
          </>
        )}
        {step === 6 && (
          <>
            <dl className="spec-list">
              <div>
                <dt>Product</dt>
                <dd>{products.find((p) => p.slug === config.product)?.name}</dd>
              </div>
              <div>
                <dt>Style</dt>
                <dd>{label('styles', config.style)}</dd>
              </div>
              <div>
                <dt>Dimensions</dt>
                <dd>
                  {config.length} × {config.width} × {config.height} {config.unit}
                </dd>
              </div>
              <div>
                <dt>Material</dt>
                <dd>{label('materials', config.material)}</dd>
              </div>
              <div>
                <dt>Printing</dt>
                <dd>{label('printing', config.printing)}</dd>
              </div>
              <div>
                <dt>Finishing</dt>
                <dd>
                  {config.finishing.length
                    ? config.finishing.map((f) => label('finishing', f)).join(', ')
                    : 'No preference selected'}
                </dd>
              </div>
              <div>
                <dt>Quantity</dt>
                <dd>{Number(config.quantity).toLocaleString('en-IN')}</dd>
              </div>
            </dl>
            <div className="calculator-result" role="status">
              {estimate?.mode === 'estimate' ? (
                <>
                  <h3>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: estimate.currency,
                    }).format(estimate.totalCost)}{' '}
                    estimated total
                  </h3>
                  <p>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: estimate.currency,
                    }).format(estimate.unitCost)}{' '}
                    per unit
                  </p>
                </>
              ) : (
                <>
                  <h3>Ready for a reviewed quotation.</h3>
                  <p>{estimate?.message}</p>
                </>
              )}
              <p className="form-note">{estimate?.disclaimer}</p>
            </div>
            <p>
              Continue to send these specifications to the team, or{' '}
              <Link
                href={`/request-a-quote?product=${config.product}&quantity=${config.quantity}&dimensions=${encodeURIComponent(`${config.length} × ${config.width} × ${config.height} ${config.unit}`)}`}
              >
                request a quote with artwork
              </Link>
              .
            </p>
          </>
        )}
        {step === 7 && (
          <>
            <p>Your specifications will be included with your request.</p>
            <div className="row g-3">
              <div className="col-md-6">
                <Field
                  name="name"
                  label="Full name *"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                />
              </div>
              <div className="col-md-6">
                <Field name="company" label="Company" maxLength={200} autoComplete="organization" />
              </div>
              <div className="col-md-6">
                <Field
                  name="email"
                  label="Email *"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                />
              </div>
              <div className="col-md-6">
                <Field
                  name="phone"
                  label="Phone *"
                  type="tel"
                  required
                  minLength={7}
                  maxLength={40}
                  autoComplete="tel"
                />
              </div>
              <div className="col-12">
                <Field name="city" label="Delivery city" maxLength={120} />
              </div>
              <div className="col-12">
                <Field name="requirements" label="Additional requirements">
                  <textarea
                    id="requirements"
                    name="requirements"
                    className="form-control"
                    maxLength={10000}
                    rows={3}
                  />
                </Field>
              </div>
            </div>
            <div className="honeypot" aria-hidden="true">
              <input name="website" aria-label="Leave empty" tabIndex={-1} autoComplete="off" />
            </div>
            <p className="form-note">
              By sending a request you provide information for a response.{' '}
              <Link href="/privacy-policy">Privacy policy</Link>
            </p>
          </>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="wizard-actions">
          {step > 0 && (
            <button
              type="button"
              className="button button--outline"
              disabled={busy}
              onClick={() => {
                setStep((s) => s - 1);
                setError('');
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <button type="submit" className="button" disabled={busy}>
            {busy
              ? 'Please wait…'
              : step === 7
                ? 'Send specifications'
                : step === 5
                  ? 'Review specifications'
                  : 'Continue'}
            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}
