// The bag drawer (opened with the Bag button or the I key).

import { el, refs } from './dom.js';
import { imageOrPlaceholder } from './images.js';

export function createInventory(root, backdrop) {
  const r = refs(root);
  let isOpen = false;
  let lastKey = null;

  r.close.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  root.inert = true;

  function open() {
    isOpen = true;
    root.classList.add('is-open');
    root.inert = false;
    backdrop.hidden = false;
    r.close.focus();
  }

  function close() {
    isOpen = false;
    root.classList.remove('is-open');
    root.inert = true;
    backdrop.hidden = true;
  }

  function render(view) {
    const key = view.inventory.map((i) => i.id).join('|');
    if (key === lastKey) return;
    lastKey = key;

    if (view.inventory.length === 0) {
      r.list.replaceChildren(
        el('li', { class: 'inventory__empty' }, el('span', { lang: 'la' }, 'Nihil habes.'), ' You have nothing.'),
      );
      return;
    }
    r.list.replaceChildren(
      ...view.inventory.map((item) =>
        el('li', { class: 'item' },
          imageOrPlaceholder(item.image, { alt: item.english, label: item.latin, className: 'item__image' }),
          el('div', { class: 'item__body' },
            el('p', { class: 'item__name' },
              el('span', { class: 'item__latin', lang: 'la' }, item.latin ?? item.id),
              el('span', { class: 'item__english' }, item.english ?? ''),
            ),
            item.description && el('p', { class: 'item__description' }, item.description),
          ),
        ),
      ),
    );
  }

  return {
    open,
    close,
    toggle: () => (isOpen ? close() : open()),
    get isOpen() {
      return isOpen;
    },
    render,
  };
}
