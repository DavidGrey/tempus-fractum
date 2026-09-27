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

  // localStorage prefix. Change this if a future update makes old saves incompatible.
  storageKey: 'tempus-fractum-v1',
};
