// The game controller. It knows how to move between scenes and nodes, apply
// effects, and describe the current moment as a plain "view" object that the
// UI draws. It never touches the DOM.

import {
  createInitialState,
  cloneState,
  saveGame,
  loadGame,
  saveCheckpoint,
  loadCheckpoint,
  saveChapterCheckpoint,
  loadChapterCheckpoint,
  clearSaves,
} from './state.js';
import { check, toArray } from './conditions.js';
import { applyEffects } from './effects.js';

export class Game {
  constructor(content, { startScene }) {
    this.content = content;
    this.startScene = startScene;
    this.state = createInitialState();
    this.listeners = new Set();
  }

  // ── Subscriptions ────────────────────────────────────────────────────────

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(notes = []) {
    for (const fn of this.listeners) fn(notes);
  }

  // ── Starting, saving, retrying ───────────────────────────────────────────

  hasSave() {
    const saved = loadGame();
    return Boolean(saved && this.content.scenes[saved.sceneId]);
  }

  newGame() {
    clearSaves();
    this.state = createInitialState();
    this.enterScene(this.startScene);
  }

  continueGame() {
    const saved = loadGame();
    if (!saved || !this.content.scenes[saved.sceneId]) return false;
    // After a defeat, the save points at the start of that chapter: begin it afresh.
    if (saved.resume) {
      delete saved.resume;
      this.state = saved;
      this.enterScene(saved.sceneId, saved.nodeId);
      return true;
    }
    this.state = saved;
    this.emit();
    return true;
  }

  /** Rewind to the moment the current scene began. */
  retryFromCheckpoint() {
    const checkpoint = loadCheckpoint();
    if (!checkpoint) return this.newGame();
    this.state = checkpoint;
    this.enterScene(checkpoint.sceneId, checkpoint.nodeId);
  }

  /** Authoring shortcut: start fresh at any scene/node with some flags or items. */
  jumpTo(sceneId, nodeId, { flags = [], items = [] } = {}) {
    this.state = createInitialState();
    applyEffects({ setFlags: flags, addItems: items }, this.state);
    this.enterScene(sceneId, nodeId || undefined);
  }

  /** From a chapter-end card whose ending has `next`, carry on into the next chapter. */
  continueFromEnding() {
    const next = this.node?.ending?.next;
    if (next) this.goTo(next);
  }

  useHint() {
    this.state.stats.hintsUsed++;
    saveGame(this.state);
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  get scene() {
    return this.content.scenes[this.state.sceneId];
  }

  /** The current node, with the variant chosen on entry merged in. */
  get node() {
    return this.buildNode(this.state.sceneId, this.state.nodeId, this.state.variant);
  }

  pickVariant(sceneId, nodeId) {
    const node = this.content.scenes[sceneId]?.nodes?.[nodeId];
    return (node?.variants ?? []).findIndex((v) => check(v.if, this.state));
  }

  buildNode(sceneId, nodeId, variantIndex) {
    const node = this.content.scenes[sceneId]?.nodes?.[nodeId];
    if (!node) return null;
    const variant = node.variants?.[variantIndex];
    if (!variant) return node;
    const { if: _condition, ...overrides } = variant;
    return { ...node, ...overrides };
  }

  enterScene(sceneId, nodeId, notes = []) {
    const scene = this.content.scenes[sceneId];
    if (!scene) throw new Error(`Unknown scene "${sceneId}"`);
    const target = nodeId || scene.start;

    this.state.sceneId = sceneId;
    this.state.nodeId = target;

    // Starting a new chapter: clear its patience meters and mistakes, and remember this
    // moment so that after a defeat the class can resume here next time.
    if (scene.chapter && scene.chapter !== this.state.chapterId) {
      this.state.chapterId = scene.chapter;
      this.state.strikes = {};
      this.state.mistakes = [];
      saveChapterCheckpoint(cloneState(this.state));
    }

    // Checkpoint is taken before the scene's own effects so a retry replays them cleanly.
    if (scene.checkpoint !== false) saveCheckpoint(cloneState(this.state));

    notes.push(...applyEffects(scene.onEnter, this.state));
    this.enterNode(target, notes);
  }

  enterNode(nodeId, notes = []) {
    const { state } = this;
    const key = `${state.sceneId}.${nodeId}`;

    // Variants are chosen once, on entry, before this node's own effects run.
    state.variant = this.pickVariant(state.sceneId, nodeId);
    state.nodeId = nodeId;
    const node = this.node;
    if (!node) throw new Error(`Unknown node "${key}"`);

    // A node that doesn't apply right now (e.g. "the guard finds your bone" when you
    // have no bone) passes straight through to its `next`, unseen.
    if (node.skipIf && node.next && check(node.skipIf, state)) return this.goTo(node.next, notes);

    notes.push(...applyEffects(node.onEnter, state));
    if (!state.visited.includes(key)) state.visited.push(key);
    if (node.ending && !state.endings.includes(node.ending.id)) state.endings.push(node.ending.id);

    saveGame(state);
    // A defeat ends today's game: the saved game goes back to the start of this chapter,
    // so "Perge" on the title screen begins it again next class.
    if (node.ending?.type === 'defeat') {
      const chapterStart = loadChapterCheckpoint();
      if (chapterStart) saveGame({ ...chapterStart, resume: true });
    }
    this.emit(notes);
  }

  goTo(target, notes = []) {
    if (typeof target === 'string') return this.enterNode(target, notes);
    if (target?.scene) return this.enterScene(target.scene, target.node, notes);
    throw new Error(`Invalid next target: ${JSON.stringify(target)}`);
  }

  /** The choices the player can pick right now, after conditions and `once`. */
  getChoices() {
    const node = this.node;
    if (!node || node.ending) return [];

    const { sceneId, nodeId } = this.state;
    const sourceId = node.choicesFrom || nodeId;
    const source = node.choicesFrom
      ? this.buildNode(sceneId, sourceId, this.pickVariant(sceneId, sourceId))
      : node;

    const available = (source?.choices ?? [])
      .map((choice) => ({ ...choice, key: `${sceneId}.${sourceId}.${choice.id || choice.say || choice.action}` }))
      .filter((choice) => check(choice.if, this.state))
      .filter((choice) => !(choice.once && this.state.chosen.includes(choice.key)));

    if (available.length === 0 && node.next) {
      return [{ action: node.continueText || 'Continue', next: node.next, isContinue: true, key: null }];
    }
    return available;
  }

  choose(index) {
    const choice = this.getChoices()[index];
    if (!choice) return;
    const { state } = this;

    if (choice.key && !state.chosen.includes(choice.key)) state.chosen.push(choice.key);
    if (!choice.isContinue) state.stats.choicesMade++;
    state.lastSaid = choice.say || null;

    const notes = applyEffects(choice.effects, state);
    const outOfPatience = this.recordStrike(choice);
    // A `fatal` choice goes to its own game-over scene even if it also emptied the meter.
    this.goTo(choice.fatal ? choice.next : outOfPatience ?? choice.next, notes);
  }

  // ── Patience (strikes) ───────────────────────────────────────────────────

  patienceRule(npc) {
    return (this.scene?.patience ?? []).find((rule) => rule.npc === npc) ?? null;
  }

  /**
   * A choice with `strike: 'guard'` is a bad answer: it uses up one of that meter's
   * strikes and is remembered for the review list. Returns the scene's failure target
   * when the meter runs out, otherwise null.
   */
  recordStrike(choice) {
    if (!choice.strike) return null;
    const { state } = this;
    const node = this.node;
    state.strikes[choice.strike] = (state.strikes[choice.strike] ?? 0) + 1;
    state.mistakes.push({
      latin: choice.review?.latin ?? node.latin ?? null,
      translation: choice.review?.translation ?? node.translation ?? null,
      vocab: choice.review?.vocab ?? node.vocab ?? [],
      said: choice.say ?? choice.action,
      saidMeaning: choice.say ? choice.meaning ?? null : null,
    });
    const rule = this.patienceRule(choice.strike);
    return rule && state.strikes[choice.strike] >= rule.max ? rule.fail : null;
  }

  /** The patience meter to show beside whoever is speaking, if any. */
  patienceFor(speakerId) {
    if (!speakerId) return null;
    const rule = (this.scene?.patience ?? []).find((r) => (r.speakers ?? [r.npc]).includes(speakerId));
    if (!rule) return null;
    return { npc: rule.npc, max: rule.max, left: Math.max(0, rule.max - (this.state.strikes[rule.npc] ?? 0)) };
  }

  // ── View model for the UI ────────────────────────────────────────────────

  describeCharacter(id, pose) {
    const character = this.content.characters[id];
    if (!character) return null;
    const known = (character.names ?? []).find((n) => check(n.if, this.state));
    const images = character.images ?? {};
    return {
      id,
      name: known?.name ?? character.name,
      role: character.role ?? '',
      image: images[pose] ?? images.default ?? null,
    };
  }

  getView() {
    const { state, content } = this;
    const scene = this.scene;
    const node = this.node;
    if (!scene || !node) return null;

    const onStageId = node.character !== undefined ? node.character : scene.character ?? null;
    const highlights = toArray(node.highlight);

    return {
      sceneId: state.sceneId,
      nodeId: state.nodeId,
      chapter: content.chapters[scene.chapter] ?? null,
      background: node.background ?? scene.background ?? null,
      props: (scene.props ?? [])
        .filter((p) => check(p.if, state))
        .map((p) => ({ ...p, highlighted: highlights.includes(p.id) })),
      character: onStageId ? this.describeCharacter(onStageId, node.pose) : null,
      speaker: node.speaker ? this.describeCharacter(node.speaker, node.pose) : null,
      patience: this.patienceFor(node.speaker),
      lastSaid: state.lastSaid,
      narration: toArray(node.narration),
      latin: node.latin ?? null,
      latinStyle: node.latinStyle ?? null,
      translation: node.translation ?? null,
      vocab: node.vocab ?? [],
      choices: this.getChoices().map((c) => ({
        type: c.isContinue ? 'continue' : c.say ? 'say' : 'action',
        text: c.say ?? c.action,
      })),
      ending: node.ending ?? null,
      inventory: state.inventory.map((id) => ({ id, ...content.items[id] })),
      stats: state.stats,
      mistakes: state.mistakes,
    };
  }
}
