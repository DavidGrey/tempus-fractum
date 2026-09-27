// Evaluates the `if` conditions used by choices, variants, props and character names.
// See the Condition typedef in js/data/schema.js for the full list of keys.

export const toArray = (value) => (value == null ? [] : Array.isArray(value) ? value : [value]);

const trustOf = (state, npc) => state.trust[npc] ?? 0;

/**
 * Returns true when every key in the condition holds.
 * An empty/missing condition is always true.
 */
export function check(cond, state) {
  if (!cond) return true;
  if (typeof cond === 'function') return Boolean(cond(state)); // escape hatch for unusual logic

  if (cond.all && !cond.all.every((c) => check(c, state))) return false;
  if (cond.any && !cond.any.some((c) => check(c, state))) return false;
  if (cond.not && check(cond.not, state)) return false;

  if (!toArray(cond.hasItems).every((id) => state.inventory.includes(id))) return false;
  if (toArray(cond.lacksItems).some((id) => state.inventory.includes(id))) return false;

  if (!toArray(cond.flags).every((f) => state.flags[f])) return false;
  if (toArray(cond.notFlags).some((f) => state.flags[f])) return false;

  for (const [npc, min] of Object.entries(cond.minTrust ?? {})) {
    if (trustOf(state, npc) < min) return false;
  }
  for (const [npc, max] of Object.entries(cond.maxTrust ?? {})) {
    if (trustOf(state, npc) > max) return false;
  }

  if (cond.minReputation != null && state.reputation < cond.minReputation) return false;
  if (cond.maxReputation != null && state.reputation > cond.maxReputation) return false;

  if (!toArray(cond.helped).every((npc) => state.helped.includes(npc))) return false;
  if (!toArray(cond.authorizations).every((a) => state.authorizations.includes(a))) return false;

  for (const [key, value] of Object.entries(cond.choice ?? {})) {
    if (state.choices[key] !== value) return false;
  }

  if (!toArray(cond.visited).every((k) => state.visited.includes(k))) return false;
  if (toArray(cond.notVisited).some((k) => state.visited.includes(k))) return false;

  return true;
}
