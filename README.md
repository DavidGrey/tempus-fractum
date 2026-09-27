# Tempus Fractum: A Latin Adventure

A choose-your-own-adventure for middle-school Latin. You're stranded in Ancient Rome with a broken
time machine and have to talk your way up through Roman society to the emperor.

There are no dependencies and no build step: just HTML, CSS, and JavaScript modules.

## Running it

The browser needs a local web server to load JavaScript modules (opening `index.html` directly won't work):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Use full screen (F11 / ⌃⌘F) on the projector.

**Controls:** click a response or press 1–9 · Enter to continue · H for a hint · I for the bag · Esc for the menu.

## Folder layout

```
index.html            page skeleton
css/styles.css        all styling (colour tokens at the top)
js/
  config.js           title, start scene, save key
  engine/             game rules only; never touches the page
    state.js          what's tracked, and saving/checkpoints
    conditions.js     `if` checks
    effects.js        inventory/flag/trust changes
    game.js           moving between scenes and nodes
    validate.js       content checker (runs on load)
  ui/                 draws the current moment; no story logic
  data/               ← ALL STORY CONTENT
    schema.js         the documented encounter format (start here)
    characters.js  items.js  chapters.js
    scenes/
      index.js        register scenes here
      01-awakening.js
      02-farmer.js
      03-city-gate.js
      04-forum.js
      05-forge.js
      06-domus-door.js    (Chapter V is three scenes: door, atrium, garden)
      07-domus-atrium.js
      08-domus-garden.js
      09-curia.js
      10-palatium.js
      11-aula.js          (Chapter VIII: the emperor)
      12-finale.js        (Epilogue: the repair and the endings)
      13-carcer.js        (shared prison: game over, Chapters II–VII)
      14-arena.js         (the Colosseum: game over, Chapter VIII)
      _template.js    copy this to start a new encounter
assets/               artwork (see assets/README.md)
```

## Adding an encounter

1. Copy `js/data/scenes/_template.js` to e.g. `03-city-gate.js` and edit it.
2. Register it in `js/data/scenes/index.js`.
3. Add new characters, items, or chapters in their files.
4. Link to it from the previous chapter: give that chapter's final ending `next: { scene: 'your-scene' }`
   (see the `inside` node in `03-city-gate.js`). The end-of-chapter card then shows a **Perge** button.
5. Test with **`?debug`** in the URL. The panel shows state plus any broken links and typos.

Authoring URL shortcuts:

- `?debug`: state and content-problem panel (toggle with the ` key)
- `?scene=farmer&node=what_want`: jump straight to a node
- `&flags=saidDog,knowsRomeIsNear&items=bread,bone`: start the jump with flags and items set

## Patience and "game over for today"

From Chapter II on, each encounter has a *Patientia* meter (wax seals beside the speaker's
name): 3 strikes in Chapters II–VI, 2 in VII–VIII. A choice tagged `strike: 'guard'` is a bad
answer; when the meter runs out the game goes to that scene's arrest node, then to prison
(or the lions). That is a **defeat**: no retry button, the card lists the lines to review,
and **Perge** on the title screen restarts that chapter next class. See `patience` and
`strike` in `js/data/schema.js`.

## What the game tracks

Current scene/node, inventory, story flags, per-NPC trust, reputation, NPCs helped, authorizations
(letters/seals), important prior answers (`recordChoice`), visited nodes, endings reached, and hint usage.
Progress autosaves in the browser. Failure endings offer "Try again" from the start of the current scene.
