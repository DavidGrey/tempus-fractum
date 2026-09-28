// The ending card: shown when the player reaches a node with an `ending`.

import { el } from './dom.js';
import { toArray } from '../engine/conditions.js';

const KICKERS = {
  failure: ['Heu!', 'Alas!'],
  comic: ['Heu!', 'Alas!'],
  success: ['Euge!', 'Hooray!'],
  chapter: ['Bene factum!', 'Well done!'],
  defeat: ['Finis… hodie.', 'Game over, for today.'],
};

// The review list: the lines the class got wrong this chapter. Shown on defeat cards,
// and on chapter-end cards when the class survived with some mistakes.
function review(mistakes, label = 'Before next class, review') {
  if (!mistakes.length) {
    return el('p', { class: 'review__none' }, 'No Latin mistakes this time: just a very bad decision!');
  }
  const recent = mistakes.slice(-3);
  const words = new Map();
  for (const m of recent) for (const [la, en] of m.vocab) if (!words.has(la)) words.set(la, en);
  return el('div', { class: 'review' },
    el('p', { class: 'ending__label' }, label),
    el('ol', { class: 'review__list' }, ...recent.map((m) =>
      el('li', { class: 'review__item' },
        m.latin && el('p', { class: 'review__latin', lang: 'la' }, m.latin),
        m.translation && el('p', { class: 'review__english' }, m.translation),
        el('p', { class: 'review__said' }, 'You answered: ', el('q', { lang: m.saidMeaning ? 'la' : 'en' }, m.said),
          m.saidMeaning && el('span', { class: 'review__meaning' }, ` (${m.saidMeaning})`)),
      ))),
    words.size > 0 && el('ul', { class: 'chips review__words' }, ...[...words].slice(0, 8).map(([la, en]) =>
      el('li', { class: 'chip' }, el('span', { lang: 'la' }, la), ` · ${en}`))),
  );
}

export function createEnding(root, { onRetry, onNewGame, onTitle, onContinue }) {
  let shownFor = null;

  function button(label, sub, onClick, primary = false) {
    return el('button', { type: 'button', class: primary ? 'btn btn--primary' : 'btn', onClick },
      label, sub && el('small', {}, sub));
  }

  function show(view) {
    const ending = view.ending;
    const type = ending.type ?? 'failure';
    const [kickerLa, kickerEn] = KICKERS[type] ?? KICKERS.failure;
    const canRetry = (type === 'failure' || type === 'comic') && !ending.final;
    const isDefeat = type === 'defeat';

    const actions = isDefeat
      ? [button('Titulus', 'Title screen', onTitle, true)]
      : ending.next
      ? [
          button('Perge', 'Continue to the next chapter', onContinue, true),
          button('Titulus', 'Title screen', onTitle),
        ]
      : canRetry
      ? [
          button('Iterum tempta', 'Try this scene again', onRetry, true),
          button('Novum iter', 'New game', onNewGame),
          button('Titulus', 'Title screen', onTitle),
        ]
      : [
          button('Iterum lude', 'Play again', onNewGame, true),
          button('Titulus', 'Title screen', onTitle),
        ];

    root.replaceChildren(
      el('div', { class: `card ending ending--${type}`, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ending-title' },
        el('p', { class: 'ending__kicker' }, el('span', { lang: 'la' }, kickerLa), ` ${kickerEn}`),
        el('h2', { class: 'ending__title', id: 'ending-title', lang: 'la' }, ending.title),
        ending.subtitle && el('p', { class: 'ending__subtitle' }, ending.subtitle),
        el('div', { class: 'ending__text' }, ...toArray(ending.text).map((t) => el('p', {}, t))),
        isDefeat && review(view.mistakes),
        type === 'chapter' && view.mistakes.length > 0 && review(view.mistakes, 'You made it, but review these'),
        !isDefeat && view.inventory.length > 0 && el('div', { class: 'ending__bag' },
          el('p', { class: 'ending__label' }, 'In your bag'),
          el('ul', { class: 'chips' }, ...view.inventory.map((item) =>
            el('li', { class: 'chip' }, el('span', { lang: 'la' }, item.latin), ` · ${item.english}`))),
        ),
        !isDefeat && el('p', { class: 'ending__stats' },
          `Choices made: ${view.stats.choicesMade} · Hints used: ${view.stats.hintsUsed}`),
        ending.teaser && el('p', { class: 'ending__teaser' }, ending.teaser),
        el('div', { class: 'ending__actions' }, ...actions),
      ),
    );
    root.hidden = false;
    root.querySelector('.btn')?.focus({ preventScroll: true });
  }

  function hide() {
    root.hidden = true;
    shownFor = null;
  }

  return {
    render(view) {
      if (!view.ending) return hide();
      const key = `${view.sceneId}.${view.nodeId}`;
      if (key === shownFor && !root.hidden) return;
      shownFor = key;
      show(view);
    },
    hide,
    get isOpen() {
      return !root.hidden;
    },
  };
}
