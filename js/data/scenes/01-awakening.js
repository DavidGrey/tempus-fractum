// SCENE 1: AWAKENING
// The player wakes beside the broken time machine and can look around.
// English only, apart from one Latin milestone. The farmer arrives once the
// player has examined the machine (which also puts the broken hinge in the bag).

/** @type {import('../schema.js').Scene} */
export default {
  id: 'awakening',
  chapter: 'outskirts',
  background: 'assets/backgrounds/outskirts-rome.webp',

  props: [
    {
      id: 'machine',
      image: 'assets/objects/time-machine-broken.webp',
      label: 'Time machine (broken)',
      position: { left: '5%', bottom: '34%', width: '28%' },
    },
  ],

  start: 'wake',

  nodes: {
    wake: {
      narration: 'You open your eyes beside your damaged time machine. Something has gone very wrong.',
      continueText: 'Get up',
      next: 'look_around',
    },

    // The hub. Each inspect choice is `once`, so it disappears after use.
    look_around: {
      narration: [
        'Warm sun. Dry grass. The steady buzz of cicadas.',
        'Your head is pounding. Nothing here looks like home.',
      ],
      variants: [
        {
          if: { flags: 'inspectedMachine' },
          narration: [
            'The machine ticks softly as it cools.',
            'Then you hear it: footsteps, and the creak of wooden wheels on stone. Someone is coming down the road.',
          ],
        },
      ],
      choices: [
        { action: 'Examine the time machine', once: true, next: 'machine' },
        { action: 'Look toward the distant city', once: true, next: 'city' },
        { action: 'Study the road', once: true, next: 'road' },
        { action: 'Turn toward the footsteps', if: { flags: 'inspectedMachine' }, next: { scene: 'farmer' } },
      ],
    },

    machine: {
      highlight: 'machine',
      narration: [
        'The machine’s heavy metal door hangs crooked. Its frame is bent, and the bronze hinge that held the door has snapped clean in half.',
        'Without a sealed door, the machine will not run. Fixing it will take a skilled metalworker and a real forge.',
        'You tuck the broken hinge into your bag.',
      ],
      onEnter: { addItems: 'broken-hinge', setFlags: 'inspectedMachine' },
      next: 'look_around',
    },

    city: {
      narration: [
        'Beyond the fields, spread across low hills, you see walls, red-tiled roofs, and the pale gleam of temples. Smoke from thousands of cooking fires hangs over it all.',
        'It is enormous. And it looks… ancient.',
      ],
      onEnter: { setFlags: 'sawCity' },
      next: 'look_around',
    },

    road: {
      narration: 'A road of fitted grey stones runs past you toward the city. Beside it stands a stone post, carved with letters:',
      latin: 'ROMA · M · P · III',
      latinStyle: 'inscription',
      translation: 'Rome, 3 miles. (M·P· stands for mille passuum, “a thousand paces”: one Roman mile.)',
      vocab: [['Roma', 'Rome'], ['III', '3']],
      onEnter: { setFlags: 'readMilestone' },
      continueText: 'Rome…?!',
      next: 'look_around',
    },
  },
};
