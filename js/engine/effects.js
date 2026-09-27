// Applies the `effects` / `onEnter` objects from scene data to the game state.
// See the Effects typedef in js/data/schema.js for the full list of keys.

import { toArray } from './conditions.js';

/**
 * Mutates `state` and returns a list of notifications the UI may show
 * (e.g. "Received: panis"). Only changes that actually happened are reported.
 */
export function applyEffects(fx, state) {
  const notes = [];
  if (!fx) return notes;

  for (const id of toArray(fx.addItems)) {
    if (!state.inventory.includes(id)) {
      state.inventory.push(id);
      notes.push({ type: 'item-added', item: id });
    }
  }
  for (const id of toArray(fx.removeItems)) {
    const i = state.inventory.indexOf(id);
    if (i !== -1) {
      state.inventory.splice(i, 1);
      notes.push({ type: 'item-removed', item: id });
    }
  }

  // setFlags accepts 'flag', ['a', 'b'], or { a: true, b: 'some value' }.
  const flags = fx.setFlags;
  if (flags && typeof flags === 'object' && !Array.isArray(flags)) {
    Object.assign(state.flags, flags);
  } else {
    for (const f of toArray(flags)) state.flags[f] = true;
  }
  for (const f of toArray(fx.clearFlags)) delete state.flags[f];

  for (const [npc, delta] of Object.entries(fx.trust ?? {})) {
    state.trust[npc] = (state.trust[npc] ?? 0) + delta;
    notes.push({ type: 'trust', npc, delta });
  }
  if (fx.reputation) {
    state.reputation += fx.reputation;
    notes.push({ type: 'reputation', delta: fx.reputation });
  }

  for (const npc of toArray(fx.helped)) {
    if (!state.helped.includes(npc)) state.helped.push(npc);
  }
  for (const auth of toArray(fx.grantAuthorizations)) {
    if (!state.authorizations.includes(auth)) {
      state.authorizations.push(auth);
      notes.push({ type: 'authorization', id: auth });
    }
  }

  Object.assign(state.choices, fx.recordChoice ?? {});

  return notes;
}
