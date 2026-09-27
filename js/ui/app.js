// Wires the game engine to the UI modules and the keyboard.

import { createStage } from './stage.js';
import { createHud } from './hud.js';
import { createDialogue } from './dialogue.js';
import { createChoices } from './choices.js';
import { createInventory } from './inventory.js';
import { createEnding } from './ending.js';
import { createMenu } from './menu.js';
import { createTitle } from './title.js';
import { createToasts } from './toasts.js';
import { createDebug } from './debug.js';
import { el } from './dom.js';

export function createApp(game, { config, problems }) {
  const $ = (id) => document.getElementById(id);
  const app = $('app');
  const params = new URLSearchParams(config.authoringTools ? location.search : '');

  const stage = createStage($('stage'));
  const dialogue = createDialogue($('dialogue'), { onHint: () => game.useHint() });
  const choices = createChoices($('choices'), { onChoose: (i) => game.choose(i) });
  const inventory = createInventory($('inventory'), $('drawer-backdrop'));
  const toasts = createToasts($('toasts'));
  const debug = createDebug($('debug'), { enabled: params.has('debug'), problems });
  if (params.has('debug')) window.game = game; // inspect or drive the game from the browser console
  const hud = createHud($('hud'), { onInventory: () => inventory.toggle(), onMenu: () => menu.open() });

  const startPlaying = (fn) => () => {
    title.hide();
    app.classList.remove('is-title');
    fn();
  };
  const handlers = {
    onRetry: () => game.retryFromCheckpoint(),
    onNewGame: () => game.newGame(),
    onTitle: showTitle,
    onContinue: () => game.continueFromEnding(),
  };
  const ending = createEnding($('ending'), handlers);
  const menu = createMenu($('menu'), handlers);
  const title = createTitle($('title'), {
    config,
    onNewGame: startPlaying(() => game.newGame()),
    onContinue: startPlaying(() => game.continueGame() || game.newGame()),
  });

  function showTitle() {
    menu.close();
    inventory.close();
    ending.hide();
    app.classList.add('is-title');
    title.show(game.hasSave());
  }

  function render() {
    const view = game.getView();
    if (!view) return;
    stage.render(view);
    hud.render(view);
    dialogue.render(view);
    choices.render(view);
    inventory.render(view);
    ending.render(view);
    debug.render(view, game.state);
  }

  function announce(note) {
    if (note.type !== 'item-added' && note.type !== 'item-removed') return;
    const item = game.content.items[note.item] ?? { latin: note.item, english: '' };
    const verb = note.type === 'item-added' ? 'Received: ' : 'Gave away: ';
    toasts.show(verb, el('strong', { lang: 'la' }, item.latin), ` (${item.english})`);
  }

  game.subscribe((notes) => {
    render();
    notes.forEach(announce);
  });

  // ── Keyboard: 1–9 choose, Enter continues, H hint, I bag, Esc menu ────────
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toLowerCase();

    if (key === 'escape') {
      if (inventory.isOpen) inventory.close();
      else if (menu.isOpen) menu.close();
      else if (!title.isOpen && !ending.isOpen) menu.open();
      return;
    }
    if (key === '`') return debug.toggle();
    if (title.isOpen || ending.isOpen || menu.isOpen) return;
    if (key === 'i') return inventory.toggle();
    if (inventory.isOpen) return;

    if (/^[1-9]$/.test(key)) {
      const index = Number(key) - 1;
      if (index < game.getChoices().length) {
        e.preventDefault();
        game.choose(index);
      }
    } else if (key === 'enter' || key === ' ') {
      if (document.activeElement?.tagName === 'BUTTON') return; // the focused button handles it
      if (game.getChoices().length === 1) {
        e.preventDefault();
        game.choose(0);
      }
    } else if (key === 'h') {
      dialogue.toggleHint();
    }
  });

  // ── Start ────────────────────────────────────────────────────────────────
  // Authors can jump straight to any node:  ?scene=farmer&node=what_want&flags=a,b&items=bread
  const jumpScene = params.get('scene');
  if (jumpScene && game.content.scenes[jumpScene]) {
    const list = (name) => (params.get(name) ?? '').split(',').filter(Boolean);
    app.classList.remove('is-title');
    title.hide();
    game.jumpTo(jumpScene, params.get('node'), { flags: list('flags'), items: list('items') });
  } else {
    showTitle();
  }
}
