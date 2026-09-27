// SCENE 14: THE COLOSSEUM (game over, Chapter VIII)
// When Trajan's patience runs out: "Ad leones!" Scary, but it cuts away before
// anything happens to the player.
//
// Class-list words: leo, spectare, timere, terrere, subito, tacere, clamare.

/** @type {import('../schema.js').Scene} */
export default {
  id: 'arena',
  chapter: 'emperor',
  background: 'assets/backgrounds/colosseum.webp',
  character: 'lion',
  checkpoint: false,
  start: 'tunnels',

  nodes: {
    tunnels: {
      character: null,
      speaker: 'crowd',
      narration: [
        'The Praetorians march you down into the dark tunnels beneath the Colosseum. Somewhere nearby, something growls.',
        'An iron gate rises. Blinding sunlight. Hot sand. Fifty thousand Romans on their feet, chanting:',
      ],
      latin: 'Ad leones! Ad leones!',
      translation: 'To the lions! To the lions!',
      vocab: [['ad leones', 'to the lions']],
      continueText: 'Step out onto the sand',
      next: 'lion',
    },

    lion: {
      speaker: 'crowd',
      narration: 'Across the arena, a second gate grinds open. A huge lion pads out of the darkness, head low, amber eyes fixed on you.',
      latin: 'Leo te spectat! Timesne?',
      translation: 'The lion is watching you! Are you afraid?',
      vocab: [['leo', 'lion'], ['spectat', 'watches'], ['timesne?', 'are you afraid?']],
      choices: [
        { action: 'Run!', next: 'roar' },
        { action: 'Stand perfectly still', next: 'roar' },
        { say: 'Salve… leo…', next: 'roar' },
      ],
    },

    roar: {
      speaker: 'crowd',
      pose: 'roaring',
      narration: 'The lion roars. The sound shakes the stones beneath your feet. Then, slowly, it begins to walk toward you.',
      latin: 'Leo te terret! … Subito omnes tacent.',
      translation: 'The lion terrifies you! … Suddenly, everyone falls silent.',
      vocab: [['terret', 'frightens, terrifies'], ['subito', 'suddenly'], ['omnes', 'everyone'], ['tacent', 'fall silent']],
      continueText: '…',
      next: 'end',
    },

    end: {
      ending: {
        id: 'ad-leones',
        type: 'defeat',
        title: 'Ad Leones!',
        subtitle: 'To the Lions!',
        text: [
          'The lion is close enough now that you can feel its hot breath. Fifty thousand Romans hold theirs. High above, the emperor leans forward to watch.',
          'What happens next, nobody will ever know. Study the lines below, and next class, choose your words more carefully.',
        ],
      },
    },
  },
};
