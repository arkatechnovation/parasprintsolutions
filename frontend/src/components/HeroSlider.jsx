'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import useReducedMotion from '@/lib/use-reduced-motion';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
export default function HeroSlider({ slides }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const playing = !paused && (!reduced || manualPlay);
  useEffect(() => {
    if (!playing || slides.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && (!ref.current?.contains(document.activeElement) || manualPlay))
        setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [playing, slides.length, manualPlay]);
  const go = (delta) => setIndex((i) => (i + delta + slides.length) % slides.length);
  const arrowKeys = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      go(event.key === 'ArrowRight' ? 1 : -1);
    }
  };
  return (
    <div
      className="hero-slider"
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label="Packaging and print showcase"
    >
      <div className="hero-slider__stage">
        {slides.map((image, i) => (
          <div
            key={image.src}
            className={`hero-slide ${i === index ? 'is-active' : ''}`}
            aria-hidden={i !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
          >
            {(i === 0 || prepared || i === index) && (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width:991px) calc(100vw - 48px), (max-width:1399px) 49vw, 650px"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'low'}
                onLoad={i === 0 ? () => setPrepared(true) : undefined}
              />
            )}
          </div>
        ))}
        <span className="hero-image-label">Packaging & print · Representative visuals</span>
      </div>
      <div className="slider-controls">
        <span className="slider-count">
          {String(index + 1).padStart(2, '0')}{' '}
          <span>/ {String(slides.length).padStart(2, '0')}</span>
        </span>
        <div className="slider-dots" role="group" aria-label="Choose a slide">
          {slides.map((slide, i) => (
            <button
              onKeyDown={arrowKeys}
              key={slide.src}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={i === index ? 'is-active' : ''}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div className="slider-buttons">
          <button
            onKeyDown={arrowKeys}
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
            onClick={() => {
              setPaused(playing);
              if (!playing) setManualPlay(true);
            }}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button onKeyDown={arrowKeys} aria-label="Previous slide" onClick={() => go(-1)}>
            <ArrowLeft size={18} />
          </button>
          <button onKeyDown={arrowKeys} aria-label="Next slide" onClick={() => go(1)}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
