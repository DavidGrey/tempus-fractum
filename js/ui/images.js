// Loads artwork, showing a labelled placeholder when the file doesn't exist
// yet. Missing art never breaks the game, and each placeholder shows its
// expected path so the artist knows what file to create.

import { el } from './dom.js';

const cache = new Map();

export function imageExists(src) {
  if (!src) return Promise.resolve(false);
  if (!cache.has(src)) {
    cache.set(
      src,
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      }),
    );
  }
  return cache.get(src);
}

/** Set a CSS background image, or a painted placeholder if it's missing. */
export function setBackground(target, src) {
  target.dataset.src = src ?? '';
  imageExists(src).then((ok) => {
    if (target.dataset.src !== (src ?? '')) return; // a newer background was requested meanwhile
    target.classList.toggle('is-placeholder', !ok);
    target.style.backgroundImage = ok ? `url("${src}")` : '';
    target.dataset.placeholderLabel = ok ? '' : `Background placeholder · ${src ?? 'none'}`;
  });
}

/** An element containing either the <img> or a placeholder box. */
export function imageOrPlaceholder(src, { alt = '', label = '', className = '' } = {}) {
  const wrap = el('div', { class: `${className} is-loading` });
  imageExists(src).then((ok) => {
    wrap.classList.remove('is-loading');
    if (ok) {
      wrap.append(el('img', { src, alt, draggable: 'false' }));
    } else {
      wrap.classList.add('is-placeholder');
      wrap.append(
        el('div', { class: 'placeholder', role: 'img', 'aria-label': alt || label },
          el('span', { class: 'placeholder__label' }, label),
          el('code', { class: 'placeholder__path' }, src || '(no image set)'),
        ),
      );
    }
  });
  return wrap;
}
