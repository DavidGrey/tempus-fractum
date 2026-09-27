// SCENE 12: THE FINALE (Epilogue)
// Back where it all began, reusing the Chapter I background and characters. The
// imperial smiths repair the machine, old friends come to say goodbye, and the player
// learns one last thing: "valete" is the goodbye for more than one person.
//
// Payoffs: Gaius remembers whether you said you were a dog; if you gave the hinge to
// the emperor, Titus has to work from memory; telling Trajan about his column changes
// the final line.
//
// Endings: home (success), stay in Rome after all (success), and, reached from the
// throne room, the emperor coming with you (comic).

const machine = { image: 'assets/objects/time-machine-broken.webp', label: 'Time machine (broken)', position: { left: '5%', bottom: '36.5%', width: '28%' } };

/** @type {import('../schema.js').Scene} */
export default {
  id: 'finale',
  chapter: 'epilogue',
  background: 'assets/backgrounds/outskirts-rome.webp',

  // The broken machine is swapped for the repaired one once the smiths finish.
  props: [
    { id: 'machine', ...machine, if: { notFlags: 'machineRepaired' } },
    {
      id: 'machine',
      image: 'assets/objects/time-machine-repaired.webp',
      label: 'Time machine (repaired)',
      position: machine.position,
      if: { flags: 'machineRepaired' },
    },
  ],

  start: 'arrive',

  nodes: {
    arrive: {
      character: null,
      narration: [
        'Three days later, a strange procession marches out along the road from Rome: imperial smiths with a cart full of tools, bellows, and a small anvil. At their head, grinning, strides Titus.',
        'Marcus runs alongside, carrying a basket of bread for everyone.',
      ],
      continueText: 'Lead them to the machine',
      next: 'farmer',
    },

    farmer: {
      character: 'farmer',
      speaker: 'farmer',
      pose: 'laughing',
      narration: 'In the field by the road, a familiar figure drops his hoe and stares.',
      latin: 'Salve iterum, viator! Quid est hoc?!',
      translation: 'Hello again, traveller! What’s all this?!',
      vocab: [['iterum', 'again'], ['viator', 'traveller']],
      variants: [
        {
          if: { flags: 'saidDog' },
          latin: 'Salve iterum, canis! Quid est hoc?!',
          translation: 'Hello again, dog! What’s all this?!',
          vocab: [['iterum', 'again'], ['canis', 'dog']],
        },
      ],
      choices: [
        { say: 'Imperator fabros misit!', next: 'farmer_2' },
        { say: 'Machinam reficimus!', next: 'farmer_2' },
      ],
    },

    farmer_2: {
      character: 'farmer',
      speaker: 'farmer',
      narration: 'His mouth falls open.',
      latin: 'Di immortales! Nemo mihi credet!',
      translation: 'Immortal gods! Nobody will believe me!',
      vocab: [['misit', 'sent (perfect)'], ['reficimus', 'we are repairing'], ['di immortales', 'immortal gods! (an exclamation)'], ['nemo', 'nobody'], ['credet', 'will believe (future)']],
      next: 'repair',
    },

    repair: {
      character: 'smith',
      pose: 'working',
      highlight: 'machine',
      narration: 'For a whole day the smiths hammer, file, and fit. Sparks fly. Titus forges a new hinge, copying the old one exactly. At sunset he swings the heavy door shut, and it closes with a soft, perfect click.',
      variants: [
        {
          if: { choice: { giftToEmperor: 'hinge' } },
          narration: 'For a whole day the smiths hammer, file, and fit. Sparks fly. The old hinge is in the emperor’s collection now, so Titus forges a new one from memory. At sunset he swings the heavy door shut, and it closes with a soft, perfect click.',
        },
      ],
      onEnter: { setFlags: 'machineRepaired' },
      next: 'titus',
    },

    titus: {
      character: 'smith',
      speaker: 'smith',
      pose: 'laughing',
      highlight: 'machine',
      latin: 'Ecce! Cardo novus. Ianua clauditur. Machina refecta est! Iter tuum longum et difficile erat.',
      translation: 'Look! A new hinge. The door closes. The machine is repaired! Your journey was long and difficult.',
      vocab: [['iter tuum', 'your journey'], ['longum et difficile', 'long and difficult'], ['cardo novus', 'a new hinge'], ['ianua', 'door'], ['clauditur', 'closes, is closed (passive)'], ['refecta est', 'has been repaired (perfect passive)']],
      next: 'goodbye',
    },

    goodbye: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      narration: 'Marcus pushes to the front. Behind him, Titus, Gaius, and the smiths wait to say goodbye.',
      latin: 'Vale, amice! Amicus noster es! Redi mox!',
      translation: 'Goodbye, friend! You’re our friend! Come back soon!',
      vocab: [['vale', 'goodbye (to one person)'], ['noster', 'our'], ['redi', 'come back!'], ['mox', 'soon']],
      choices: [
        { say: 'Valete, amici!', next: 'depart' },
        { say: 'Vale, amice!', once: true, next: 'singular' },
        { action: 'Decide to stay in Rome after all', next: 'stay_after_all' },
      ],
    },

    // One last grammar point: saying goodbye to a crowd.
    singular: {
      character: 'smith',
      speaker: 'smith',
      pose: 'laughing',
      latin: '“Vale”? Multi sumus! “Valete” dic!',
      translation: '“Vale”? There are lots of us! Say “valete”!',
      vocab: [['multi sumus', 'we are many'], ['valete', 'goodbye (to several people)'], ['dic', 'say!']],
      choicesFrom: 'goodbye',
    },

    depart: {
      character: null,
      highlight: 'machine',
      narration: 'You step inside the machine. Through the little round window you see them all waving: Titus, Marcus, Gaius, and a row of sooty imperial smiths. You take a deep breath and press the button.',
      continueText: 'Press the button',
      next: 'home',
    },

    home: {
      character: null,
      ending: {
        id: 'home',
        type: 'success',
        title: 'Finis',
        subtitle: 'You Made It Home!',
        text: [
          'There is a hum, a flash of light, and a sound like a thousand bees. Then silence.',
          'You open the door. You are home, in your own time. Your clothes smell of forge smoke, and there is Roman dust on your shoes.',
          'You will never think of Latin as a “dead” language again.',
        ],
      },
      variants: [
        {
          if: { flags: 'toldColumn' },
          ending: {
            id: 'home',
            type: 'success',
            title: 'Finis',
            subtitle: 'You Made It Home!',
            text: [
              'There is a hum, a flash of light, and a sound like a thousand bees. Then silence.',
              'You open the door. You are home, in your own time. Your clothes smell of forge smoke, and there is Roman dust on your shoes.',
              'On a whim, you look up Trajan’s Column. It is still standing, just as you promised him.',
            ],
          },
        },
      ],
    },

    stay_after_all: {
      character: null,
      ending: {
        id: 'roman-citizen',
        type: 'success',
        title: 'Civis Romanus Sum',
        subtitle: 'I Am a Roman Citizen',
        text: [
          'You look at the repaired machine. Then you look at your friends… and you step back from the door.',
          'You never go home. Titus teaches you to work bronze, Gaius teaches you to farm, and Marcus teaches you every shortcut in the Subura. Rome, it turns out, is home now.',
        ],
      },
    },

    // Reached from the throne room: "Veni mecum in futurum!" with enough favour.
    emperor_comes: {
      character: 'emperor',
      pose: 'laughing',
      narration: [
        'Three days later, a truly strange procession marches out of Rome: ten imperial smiths, a cart of tools, a hundred Praetorians, and the Emperor of Rome himself, in a travelling cloak.',
        'The smiths repair the machine by sunset. Trajan squeezes in beside you, and you press the button.',
      ],
      onEnter: { setFlags: 'machineRepaired' },
      continueText: 'Press the button',
      next: 'emperor_end',
    },

    emperor_end: {
      character: null,
      ending: {
        id: 'emperor-in-the-future',
        type: 'comic',
        final: true,
        title: 'Imperator in Futuro',
        subtitle: 'An Emperor in the Future',
        text: [
          'Your school has never had a visitor like Trajan. By lunchtime he has organised the cafeteria line into legions, declared the gym a forum, and asked the principal to kneel.',
          'By Friday, the history teacher has made him an honorary member of staff.',
        ],
      },
    },
  },
};
