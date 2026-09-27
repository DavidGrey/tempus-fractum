// The player's response buttons, numbered with Roman numerals (keys 1–9 also work).

import { el, toRoman, replayAnimation } from './dom.js';

export function createChoices(root, { onChoose }) {
  return {
    render(view) {
      root.hidden = Boolean(view.ending);
      root.classList.toggle('is-grid', view.choices.length > 3);
      root.replaceChildren(
        ...view.choices.map((choice, i) =>
          el('li', {},
            el('button', {
              type: 'button',
              class: `choice choice--${choice.type}`,
              'aria-keyshortcuts': String(i + 1),
              onClick: () => onChoose(i),
            },
              el('span', { class: 'choice__num', 'aria-hidden': 'true' }, choice.type === 'continue' ? '›' : toRoman(i + 1)),
              el('span', { class: 'choice__text', lang: choice.type === 'say' ? 'la' : 'en' }, choice.text),
            ),
          ),
        ),
      );
      replayAnimation(root, 'is-entering');
    },
  };
}
