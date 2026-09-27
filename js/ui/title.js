// Title screen.

import { refs } from './dom.js';
import { setBackground } from './images.js';

export function createTitle(root, { config, onNewGame, onContinue }) {
  const r = refs(root);
  r.kicker.textContent = config.kicker;
  r.name.textContent = config.title;
  r.tagline.textContent = config.tagline;
  setBackground(r.bg, config.titleBackground);

  r.newGame.addEventListener('click', onNewGame);
  r.continue.addEventListener('click', onContinue);

  return {
    show(hasSave) {
      r.continue.hidden = !hasSave;
      root.hidden = false;
      (hasSave ? r.continue : r.newGame).focus();
    },
    hide() {
      root.hidden = true;
    },
    get isOpen() {
      return !root.hidden;
    },
  };
}
