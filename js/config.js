// Global settings for the game. Story content lives in js/data/, not here.
export const config = {
  title: 'Tempus Fractum',
  tagline: 'Broken Time',
  kicker: 'A Latin Adventure',

  // Scene the game begins in (an id from js/data/scenes/index.js).
  startScene: 'awakening',

  // Background shown behind the title screen.
  titleBackground: 'assets/backgrounds/outskirts-rome.webp',

  // Authoring shortcuts (?debug, ?scene=…) only work when running on your own computer,
  // so players of the published game can't skip ahead or see the answers.
  authoringTools: ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname),

  // Difficulty modes, picked from the settings panel on the title screen.
  //   patience      seals added to (or taken from) every patience meter; a meter never drops below 1
  //   translations  whether the hint can go on to show the English translation
  //   simplified    use the easier Latin written in scenes' `intro` fields (see js/data/schema.js)
  difficulties: {
    tiro: { latin: 'Tiro', english: 'Intro', patience: +1, translations: true, simplified: true,
      description: 'For a first class: simpler Latin with far fewer words to learn, and one extra seal of patience.' },
    media: { latin: 'Media', english: 'Normal', patience: 0, translations: true,
      description: 'The game as written.' },
    difficilis: { latin: 'Difficilis', english: 'Hard', patience: -1, translations: false,
      description: 'One seal less of patience, and hints show the words but never the translation.' },
  },
  defaultDifficulty: 'media',

  // localStorage prefix. Change this if a future update makes old saves incompatible.
  storageKey: 'tempus-fractum-v1',
};
