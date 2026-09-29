// Settings panel (the gear on the title screen): difficulty for now.

import { el } from './dom.js';

export function createSettings(root, { difficulties, getDifficulty, onDifficulty }) {
  const options = Object.entries(difficulties).map(([id, d]) =>
    el('label', { class: 'difficulty' },
      el('input', { type: 'radio', name: 'difficulty', value: id, class: 'difficulty__input',
        onChange: () => onDifficulty(id) }),
      el('span', { class: 'difficulty__name' },
        el('span', { lang: 'la' }, d.latin), el('small', {}, d.english)),
      el('span', { class: 'difficulty__desc' }, d.description),
    ));

  root.replaceChildren(
    el('div', { class: 'card settings', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'settings-title' },
      el('h2', { class: 'menu__title', id: 'settings-title' }, el('span', { lang: 'la' }, 'Optiones'), el('small', {}, 'Settings')),
      el('fieldset', { class: 'settings__group' },
        el('legend', { class: 'ending__label' }, 'Difficulty'),
        ...options),
      el('button', { type: 'button', class: 'btn btn--primary', onClick: close }, 'Fac', el('small', {}, 'Done')),
    ),
  );
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });

  let returnFocus = null;

  function open() {
    returnFocus = document.activeElement;
    const current = getDifficulty();
    for (const input of root.querySelectorAll('input')) input.checked = input.value === current;
    root.hidden = false;
    root.querySelector('input:checked')?.focus();
  }

  function close() {
    root.hidden = true;
    returnFocus?.focus?.();
  }

  return {
    open,
    close,
    get isOpen() {
      return !root.hidden;
    },
  };
}
