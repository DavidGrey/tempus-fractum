// The dialogue panel's text column: nameplate, "You: …" echo, narration,
// the Latin line, and the Hint toggle.
//
// The hint opens in two steps, so the class works from the words before reaching
// for the English: the first click shows the vocabulary, the second adds the
// translation, and the third closes it. A line with only one of the two opens it
// in one step.

import { el, refs, replayAnimation } from './dom.js';

// Button label for each step: what the NEXT click will do.
const LABELS = {
  words: ['Quid significat?', 'Hint (H)'],
  translation: ['Anglice?', 'Translation (H)'],
  close: ['Satis', 'Hide (H)'],
};

export function createDialogue(root, { onHint }) {
  const r = refs(root);
  let steps = [];       // what each click reveals on this line, e.g. ['words', 'translation']
  let shown = 0;        // how many of those steps are showing (0 = closed)
  let counted = new Set();
  let lastPatience = null; // { npc, left } shown last time, to animate a lost seal

  r.hintToggle.addEventListener('click', toggleHint);

  function setShown(n) {
    shown = n;
    const open = n > 0;
    const showing = steps.slice(0, n);
    r.hint.hidden = !open;
    r.vocab.hidden = !showing.includes('words');
    r.translation.hidden = !showing.includes('translation');
    r.hintToggle.setAttribute('aria-expanded', String(open));
    r.hintToggle.classList.toggle('is-open', open);
    root.classList.toggle('is-hint-open', open);
    const [la, en] = LABELS[steps[n] ?? 'close'];
    r.hintToggle.replaceChildren(el('span', { lang: 'la' }, la), ' ', el('span', { class: 'hint-toggle__en' }, en));
    // Count each kind of help once per line (the ending card reports both).
    for (const step of showing) {
      if (!counted.has(step)) {
        counted.add(step);
        onHint(step);
      }
    }
  }

  function toggleHint() {
    if (r.hintToggle.hidden) return;
    setShown(shown < steps.length ? shown + 1 : 0);
  }

  function render(view) {
    root.hidden = Boolean(view.ending);
    if (view.ending) return;

    const { speaker } = view;
    r.nameplate.hidden = !speaker;
    root.classList.toggle('is-narration', !speaker && !view.latin);
    if (speaker) {
      r.name.textContent = speaker.name;
      r.role.textContent = speaker.role;
    }
    renderPatience(view.patience);

    r.said.hidden = !view.lastSaid;
    r.said.replaceChildren('You: ', el('q', { lang: 'la' }, view.lastSaid ?? ''));

    r.narration.replaceChildren(...view.narration.map((text) => el('p', {}, text)));
    r.narration.hidden = view.narration.length === 0;

    r.latin.hidden = !view.latin;
    r.latin.textContent = view.latin ?? '';
    r.latin.classList.toggle('latin--inscription', view.latinStyle === 'inscription');

    steps = [...(view.vocab.length ? ['words'] : []), ...(view.translation ? ['translation'] : [])];
    r.hintToggle.hidden = steps.length === 0;
    r.translation.textContent = view.translation ?? '';
    r.vocab.replaceChildren(
      ...view.vocab.map(([latin, english]) =>
        el('div', { class: 'vocab-item' }, el('dt', { lang: 'la' }, latin), el('dd', {}, english)),
      ),
    );

    counted = new Set();
    setShown(0);
    r.text.scrollTop = 0;
    replayAnimation(r.text, 'is-entering');
  }

  // Patience meter: one gold seal per strike left; lost ones show a red ✕, and a
  // "−1" pops up the moment one breaks.
  function renderPatience(p) {
    r.patience.hidden = !p;
    if (!p) {
      lastPatience = null;
      return;
    }
    const justLost = lastPatience?.npc === p.npc && p.left < lastPatience.left;
    r.patience.replaceChildren(
      el('span', { class: 'patience__label' }, 'Patience'),
      ...Array.from({ length: p.max }, (_, i) =>
        el('span', { class: `seal${i < p.left ? '' : ' is-broken'}${justLost && i === p.left ? ' is-breaking' : ''}`, 'aria-hidden': 'true' })),
      ...(justLost ? [el('span', { class: 'patience__loss', 'aria-hidden': 'true' }, '−1')] : []),
    );
    r.patience.setAttribute('aria-label', `Patience: ${p.left} of ${p.max}`);
    r.patience.classList.toggle('is-low', p.left <= 1);
    if (justLost) replayAnimation(r.patience, 'is-shaken');
    lastPatience = { npc: p.npc, left: p.left };
  }

  return { render, toggleHint };
}
