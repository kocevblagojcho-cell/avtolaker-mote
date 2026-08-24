import { useState } from 'react';

// Една галериска картичка со две слики - пред и после.
// Која се гледа зависи од локалната состојба на компонентата.
function GalleryItem({ entry }) {
  const [showBefore, setShowBefore] = useState(true);

  return (
    <article className="gallery-card">
      <h3 className="gallery-card-title">{entry.title}</h3>

      <div className="gallery-frame">
        <img
          className={showBefore ? 'gallery-image' : 'gallery-image gallery-image-hidden'}
          src={entry.before}
          alt={`Пред - ${entry.title}`}
          loading="lazy"
        />

        <img
          className={showBefore ? 'gallery-image gallery-image-hidden' : 'gallery-image'}
          src={entry.after}
          alt={`После - ${entry.title}`}
          loading="lazy"
        />

        <div className="gallery-buttons">
          <button
            className={showBefore ? 'gallery-button gallery-button-active' : 'gallery-button'}
            type="button"
            onClick={() => setShowBefore(true)}
          >
            Пред
          </button>

          <button
            className={showBefore ? 'gallery-button' : 'gallery-button gallery-button-active'}
            type="button"
            onClick={() => setShowBefore(false)}
          >
            После
          </button>
        </div>
      </div>
    </article>
  );
}

export default GalleryItem;
