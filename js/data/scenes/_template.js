// TEMPLATE: copy this file to start a new encounter. It is NOT registered in
// scenes/index.js, so it never appears in the game. Full field reference: ../schema.js
//
// Checklist:
//   1. Rename the file (e.g. 04-forum.js) and change `id`.
//   2. Add it to scenes/index.js.
//   3. Add new characters to characters.js and new items to items.js.
//   4. Link to it from an earlier scene:  next: { scene: 'forum' }
//   5. Test with  ?debug&scene=forum  in the URL.

/** @type {import('../schema.js').Scene} */
export default {
  id: 'example-scene',
  chapter: 'gate',                       // must exist in chapters.js
  background: 'assets/backgrounds/city-gate.webp',
  character: 'guard',                    // must exist in characters.js
  start: 'halt',

  nodes: {
    halt: {
      speaker: 'guard',
      narration: 'A soldier steps into your path.',
      latin: 'Siste! Quis es? Quo vadis?',
      translation: 'Stop! Who are you? Where are you going?',
      vocab: [['siste', 'stop!'], ['quo?', 'where to?']],

      // A different opening line if the player is wearing the farmer's cloak:
      variants: [
        {
          if: { hasItems: 'cloak' },
          narration: 'A soldier glances at your cloak, then at your odd shoes.',
        },
      ],

      choices: [
        // A good answer that moves the story on.
        { say: 'Romam eo.', effects: { trust: { guard: 1 } }, next: 'let_through' },

        // Only offered if the player has the bone (from saying "Canis sum" to the farmer).
        { action: 'Offer the guard dog your bone', if: { hasItems: 'bone' }, effects: { removeItems: 'bone' }, next: 'dog_distracted' },

        // Remembering an earlier answer:
        // { say: '…', if: { choice: { introducedAs: 'dog' } }, next: '…' },

        // A funny wrong answer that ends the game (the player can retry this scene).
        { say: 'Imperator sum!', next: 'arrested' },
      ],
    },

    let_through: {
      speaker: 'guard',
      latin: 'Intra!',
      translation: 'Go in!',
      next: { scene: 'forum' },          // next scene
    },

    dog_distracted: {
      narration: 'The guard dog pounces on the bone. While the guard wrestles with it, you slip past.',
      next: { scene: 'forum' },
    },

    arrested: {
      ending: {
        id: 'arrested-at-gate',
        type: 'comic',
        title: 'In Carcerem!',
        subtitle: 'To Prison!',
        text: 'It turns out claiming to be the emperor is frowned upon.',
      },
    },
  },
};
