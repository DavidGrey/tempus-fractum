// The game state: everything that changes while playing. It is plain JSON so
// it can be saved to localStorage and restored exactly.

import { config } from '../config.js';

const SAVE_KEY = `${config.storageKey}:save`;
const CHECKPOINT_KEY = `${config.storageKey}:checkpoint`;
const CHAPTER_KEY = `${config.storageKey}:chapter`;

export function createInitialState() {
  return {
    sceneId: null,
    nodeId: null,
    variant: -1,          // which of the node's variants was chosen on entry (-1 = none)

    inventory: [],        // item ids from data/items.js (no duplicates)
    flags: {},            // story flags, e.g. { inspectedMachine: true }
    trust: {},            // per-NPC trust, e.g. { farmer: 2 }
    reputation: 0,        // general standing in Roman society
    helped: [],           // NPC ids the player has done a favour for
    authorizations: [],   // letters, seals, passes, e.g. 'senator-letter'
    choices: {},          // important prior answers, e.g. { introducedAs: 'dog' }

    visited: [],          // 'sceneId.nodeId' keys the player has seen
    chosen: [],           // keys of choices already picked (for `once` choices)
    endings: [],          // ending ids reached this playthrough
    lastSaid: null,       // Latin the player just said (echoed above the NPC's reply)
    seed: Math.floor(Math.random() * 2 ** 31), // this playthrough's answer order (see Game.orderChoices)

    chapterId: null,      // chapter currently being played (for "resume next class")
    strikes: {},          // bad answers this chapter, per patience meter, e.g. { guard: 2 }
    mistakes: [],         // the lines the player got wrong this chapter (for the review list)
    stats: { choicesMade: 0, hintsUsed: 0 },
  };
}

export const cloneState = (state) => structuredClone(state);

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the game still runs.
  }
}

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Fill in any fields added since the save was written.
function upgrade(saved) {
  if (!saved) return null;
  const fresh = createInitialState();
  return { ...fresh, ...saved, stats: { ...fresh.stats, ...saved.stats } };
}

export const saveGame = (state) => write(SAVE_KEY, state);
export const loadGame = () => upgrade(read(SAVE_KEY));
export const saveCheckpoint = (state) => write(CHECKPOINT_KEY, state);
export const loadCheckpoint = () => upgrade(read(CHECKPOINT_KEY));
export const saveChapterCheckpoint = (state) => write(CHAPTER_KEY, state);
export const loadChapterCheckpoint = () => upgrade(read(CHAPTER_KEY));

export function clearSaves() {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(CHECKPOINT_KEY);
    localStorage.removeItem(CHAPTER_KEY);
  } catch {
    // ignore
  }
}
