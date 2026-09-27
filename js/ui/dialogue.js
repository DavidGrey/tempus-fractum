// The dialogue panel's text column: nameplate, "You: …" echo, narration,
// the Latin line, and the Hint toggle (translation + vocabulary).

import { el, refs, replayAnimation } from './dom.js';

export function createDialogue(root, { onHint }) {
  const r = refs(root);
  let hintOpen = false;
  let hintCounted = false;
  let lastPatience = null; // { npc, left } shown last time, to animate a lost seal

  r.hintToggle.addEventListener('click', toggleHint);

  function setHint(open) {
    hintOpen = open;
    r.hint.hidden = !open;
    r.hintToggle.setAttribute('aria-expanded', String(open));
    r.hintToggle.classList.toggle('is-open', open);
    root.classList.toggle('is-hint-open', open);
    if (open && !hintCounted) {
      hintCounted = true;
      onHint();
    }
  }

  function toggleHint() {
    if (r.hintToggle.hidden) return;
    setHint(!hintOpen);
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

    const hasHint = Boolean(view.translation || view.vocab.length);
    r.hintToggle.hidden = !hasHint;
    r.translation.textContent = view.translation ?? '';
    r.translation.hidden = !view.translation;
    r.vocab.replaceChildren(
      ...view.vocab.map(([latin, english]) =>
        el('div', { class: 'vocab-item' }, el('dt', { lang: 'la' }, latin), el('dd', {}, english)),
      ),
    );
    r.vocab.hidden = view.vocab.length === 0;

    hintCounted = false;
    setHint(false);
    r.text.scrollTop = 0;
    replayAnimation(r.text, 'is-entering');
  }

  // Patientia: one wax seal per remaining strike; lost ones crack.
  function renderPatience(p) {
    r.patience.hidden = !p;
    if (!p) {
      lastPatience = null;
      return;
    }
    const justLost = lastPatience?.npc === p.npc && p.left < lastPatience.left;
    r.patience.replaceChildren(
      el('span', { class: 'patience__label', lang: 'la' }, 'Patientia'),
      ...Array.from({ length: p.max }, (_, i) =>
        el('span', { class: `seal${i < p.left ? '' : ' is-broken'}${justLost && i === p.left ? ' is-breaking' : ''}`, 'aria-hidden': 'true' })),
    );
    r.patience.setAttribute('aria-label', `Patience: ${p.left} of ${p.max}`);
    r.patience.classList.toggle('is-low', p.left <= 1);
    if (justLost) replayAnimation(r.patience, 'is-shaken');
    lastPatience = { npc: p.npc, left: p.left };
  }

  return { render, toggleHint };
}
