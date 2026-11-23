'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
export default function Gallery({ items }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef(null);
  const active = items[index];
  const move = (delta) => setIndex((i) => (i + delta + items.length) % items.length);
  const arrowKeys = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  };
  return (
    <>
      <div className="gallery-grid">
        {items.map((item, i) => (
          <button
            className={`gallery-tile ${item.image.kind === 'document' ? 'gallery-tile--document' : ''} ${item.image.kind === 'brand' || item.image.height >= item.image.width ? 'gallery-tile--contain' : ''}`}
            key={item.slug}
            onClick={() => {
              setIndex(i);
              dialog.current.showModal();
            }}
            aria-label={`Enlarge ${item.title}`}
          >
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
              sizes="(max-width:575px) 100vw,(max-width:991px) 50vw,33vw"
            />
            <span>
              <small>{item.category}</small>
              {item.title}
              {item.image.kind === 'illustrative' && <em>Illustrative visual</em>}
            </span>
          </button>
        ))}
      </div>
      <dialog ref={dialog} className="lightbox" aria-label="Image viewer" closedby="any">
        <div className="lightbox-top">
          <span>
            {index + 1} / {items.length}
          </span>
          <button
            onKeyDown={arrowKeys}
            className="icon-button"
            aria-label="Close image"
            onClick={() => dialog.current.close()}
          >
            <X />
          </button>
        </div>
        {active && (
          <Image
            src={active.image.src}
            alt={active.image.alt}
            width={active.image.width}
            height={active.image.height}
            sizes="90vw"
          />
        )}
        <div className="lightbox-bottom">
          <button
            onKeyDown={arrowKeys}
            className="icon-button"
            aria-label="Previous image"
            onClick={() => move(-1)}
          >
            <ArrowLeft />
          </button>
          <p>{active?.title}</p>
          <button
            onKeyDown={arrowKeys}
            className="icon-button"
            aria-label="Next image"
            onClick={() => move(1)}
          >
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </>
  );
}
