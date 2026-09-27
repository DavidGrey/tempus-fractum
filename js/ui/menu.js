// Pause menu (Menu button or Esc).

import { el } from './dom.js';

export function createMenu(root, { onRetry, onNewGame, onTitle }) {
  const run = (fn) => () => {
    close();
    fn();
  };
  const item = (label, sub, onClick, primary = false) =>
    el('button', { type: 'button', class: primary ? 'btn btn--primary' : 'btn', onClick }, label, el('small', {}, sub));

  root.replaceChildren(
    el('div', { class: 'card menu', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'menu-title' },
      el('h2', { class: 'menu__title', id: 'menu-title' }, 'Menu'),
      item('Perge', 'Resume', close, true),
      item('Iterum tempta', 'Restart this scene', run(onRetry)),
      item('Novum iter', 'New game from the beginning', run(onNewGame)),
      item('Titulus', 'Title screen', run(onTitle)),
    ),
  );
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });

  function open() {
    root.hidden = false;
    root.querySelector('.btn')?.focus();
  }

  function close() {
    root.hidden = true;
  }

  return {
    open,
    close,
    get isOpen() {
      return !root.hidden;
    },
  };
}
