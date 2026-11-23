'use client';

import { useEffect, useRef } from 'react';

const milestones = [
  { year: '1996', title: 'The beginning', text: 'Started with screen printing.' },
  {
    year: '2000',
    title: 'New screen printing capabilities',
    text: 'Added round screen printing and 4-colour screen printing.',
  },
  { year: '2003', title: 'A move into packaging', text: 'Established a box manufacturing unit.' },
  {
    year: '2012',
    title: 'Our first offset press',
    text: 'Purchased a Dominant 19 × 26 2-colour offset printing press.',
  },
  {
    year: '2014',
    title: 'Expanding offset capacity',
    text: 'Purchased a second 19 × 26 2-colour offset printing press.',
  },
  {
    year: '2017',
    title: 'A second manufacturing unit',
    text: 'Opened our second manufacturing unit in Ghaziabad.',
  },
  {
    year: '2019',
    title: 'Our own factory. A nationwide reach.',
    text: 'Built our own 260-square-metre factory in Kavi Nagar Industrial Area, purchased a Dominant 4-colour offset press and started supplying across India.',
  },
  {
    year: '2021',
    title: 'More production in-house',
    text: 'Purchased corrugation machinery and automatic sheeters for in-house production.',
  },
  {
    year: '2023',
    title: 'Investing in colour printing',
    text: 'Purchased a rebuilt Komori Lithrone 19 × 26 offset press and a 2007 Shinohara 5-colour offset press.',
  },
  {
    year: '2025',
    title: 'Room for the next chapter',
    text: 'Expanded into a 30,000 sq ft manufacturing unit. Added a Komori 20 × 28 6-colour press with coater and a Vitaya Graphics folder gluer.',
  },
  {
    year: '2026',
    title: 'The next stage of growth',
    text: 'Purchased a Komori 640 28 × 40, an imported 3-ply automatic flute laminator and two die-cutting machines with automatic feeders.',
  },
];

export default function CompanyTimeline() {
  const timelineRef = useRef(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = Array.from(timeline.querySelectorAll('.company-timeline__item'));
    let frame = 0;
    let positions = [];
    let length = 0;

    const update = () => {
      frame = 0;
      // The viewport trigger drives the line in both scroll directions.
      const trigger = window.innerHeight * 0.65 - timeline.getBoundingClientRect().top;
      const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (trigger - 38) / length));
      timeline.style.setProperty('--timeline-progress', String(progress));
      items.forEach((item, index) => {
        const pending = !reduced.matches && positions[index] > trigger;
        if (pending && !item.hasAttribute('data-pending')) item.dataset.pending = 'true';
        else if (!pending) delete item.dataset.pending;
      });
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const measure = () => {
      positions = items.map((item) => item.offsetTop + 38);
      length = Math.max(1, positions.at(-1) - 38);
      timeline.style.setProperty('--timeline-length', `${length}px`);
      scheduleUpdate();
    };
    measure();
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    resizeObserver?.observe(timeline);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', measure);
    reduced.addEventListener('change', scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', measure);
      reduced.removeEventListener('change', scheduleUpdate);
      timeline.style.removeProperty('--timeline-progress');
      timeline.style.removeProperty('--timeline-length');
      items.forEach((item) => delete item.dataset.pending);
    };
  }, []);

  return (
    <ol
      className="company-timeline"
      ref={timelineRef}
      aria-label="Company milestones from 1996 to 2026"
    >
      {milestones.map(({ year, title, text }) => (
        <li className="company-timeline__item" key={year}>
          <span className="company-timeline__dot" aria-hidden="true" />
          <div className="company-timeline__card">
            <time className="company-timeline__year" dateTime={year}>
              {year}
            </time>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
