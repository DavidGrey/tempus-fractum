// SCENE 8: AURELIUS'S GARDEN (Chapter V, part 3 of 3)
// The ring is in the pet magpie's cage. Magpies were kept as talking birds in
// Rome; this one repeats whatever it hears ("Anulus!", "Da mihi!", "Fur!").
//
// Getting the ring (always possible):
//   offer a shiny coin (denarii)   → trade
//   offer an apple (poma)          → trade
//   reach into the cage            → pecked, but you get it
//   "Da mihi anulum!"              → the magpie just repeats "Da mihi!"

/** @type {import('../schema.js').Scene} */
export default {
  id: 'domus-garden',
  chapter: 'patron',
  background: 'assets/backgrounds/garden.webp',
  checkpoint: false, // "Try again" should restart from the atrium, not mid-search

  props: [
    {
      id: 'magpie',
      image: 'assets/objects/magpie-cage.webp',
      label: 'Magpie in a cage',
      position: { left: '6%', bottom: '36.5%', width: '17%' },
    },
  ],

  start: 'garden',

  nodes: {
    garden: {
      narration: 'A sunny garden surrounded by columns. A fountain splashes in the middle, and beside it stands a marble table. In a wicker cage standing beside a column, a black-and-white bird hops about.',
      variants: [
        {
          if: { hasItems: 'anulus' },
          narration: 'The magpie is busy with its new treasure. The gold ring is safe in your bag.',
        },
        { if: { visited: 'domus-garden.garden' }, narration: 'The garden is quiet except for the fountain… and the bird.' },
      ],
      choices: [
        { action: 'Search the fountain', once: true, next: 'fountain' },
        { action: 'Look under the marble table', once: true, next: 'table' },
        { action: 'Look at the bird', if: { lacksItems: 'anulus' }, next: 'magpie' },
        { action: 'Go back inside', next: { scene: 'domus-atrium', node: 'hub' } },
      ],
    },

    fountain: {
      narration: 'You roll up your sleeves and feel around the bottom of the fountain. You find three coins someone threw in for luck, one annoyed snail, and no ring.',
      next: 'garden',
    },

    table: {
      highlight: 'magpie',
      narration: 'Under the marble table: breadcrumbs, a lost sandal, and a few black-and-white feathers.',
      variants: [
        {
          if: { flags: 'ringInGarden' },
          narration: 'The servant said the ring was on this table. It isn’t here now. But there are black-and-white feathers scattered all over the marble…',
        },
      ],
      next: 'garden',
    },

    magpie: {
      speaker: 'magpie',
      highlight: 'magpie',
      narration: 'The bird cocks its head and squawks at you. In the corner of its cage, something glints gold.',
      latin: 'Salve! Salve! Anulus! Anulus!',
      translation: 'Hello! Hello! Ring! Ring!',
      vocab: [['pica', 'magpie'], ['anulus', 'ring']],
      variants: [{ if: { visited: 'domus-garden.magpie' }, narration: 'The magpie guards the glinting ring.' }],
      choices: [
        { action: 'Offer the magpie a shiny coin', if: { hasItems: 'denarii' }, effects: { removeItems: 'denarii' }, next: 'trade_coin' },
        { action: 'Offer the magpie an apple', if: { hasItems: 'poma' }, effects: { removeItems: 'poma' }, next: 'trade_apple' },
        { say: 'Da mihi anulum!', once: true, next: 'parrot' },
        { action: 'Reach into the cage', next: 'pecked' },
        { action: 'Leave the bird alone', next: 'garden' },
      ],
    },

    parrot: {
      speaker: 'magpie',
      highlight: 'magpie',
      narration: 'The magpie repeats your words back at you, extremely pleased with itself.',
      latin: 'Da mihi! Da mihi! Da mihi!',
      translation: 'Give me! Give me! Give me!',
      vocab: [['da', 'give!'], ['mihi', '(to) me']],
      next: 'magpie',
    },

    trade_coin: {
      highlight: 'magpie',
      narration: 'You hold out a shiny silver coin. The magpie’s eyes go wide. It snatches the coin, drops the gold ring, and hops away to admire its new treasure.',
      onEnter: { addItems: 'anulus' },
      next: 'garden',
    },

    trade_apple: {
      highlight: 'magpie',
      narration: 'You hold out an apple. The magpie drops the ring at once and attacks the apple.',
      onEnter: { addItems: 'anulus' },
      next: 'garden',
    },

    pecked: {
      speaker: 'magpie',
      highlight: 'magpie',
      narration: 'You reach into the cage. The magpie pecks your hand, hard, over and over, but you grab the ring!',
      latin: 'Fur! Fur! Fur!',
      translation: 'Thief! Thief! Thief!',
      vocab: [['fur', 'thief']],
      onEnter: { addItems: 'anulus' },
      next: 'garden',
    },
  },
};
