// Top bar: chapter label, bag button, menu button.

import { refs } from './dom.js';

export function createHud(root, { onInventory, onMenu }) {
  const r = refs(root);
  r.inventory.addEventListener('click', onInventory);
  r.menu.addEventListener('click', onMenu);

  return {
    render(view) {
      const chapter = view.chapter;
      r.chapter.hidden = !chapter;
      if (chapter) {
        r.numeral.textContent = chapter.numeral;
        r.latin.textContent = chapter.latin;
        r.english.textContent = chapter.english;
      }
      r.count.textContent = view.inventory.length;
      r.count.hidden = view.inventory.length === 0;
    },
  };
}
