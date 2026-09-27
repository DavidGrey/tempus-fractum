// SCENE 2: THE FARMER
// Very easy Latin: sum/es, nominative and accusative, quis/quid/ubi, volo.
//
// Flow:
//   arrive ("Quis es?")  ─┬─ Salve! / Quis es? / Canis sum.  → reaction, then he asks again
//                         ├─ Romanus sum. / Viator sum.      → what_want
//                         └─ walk away → come back, or get lost (failure ending)
//   what_want ("Quid vis?") hub: food, horse, help, "where is Rome?"
//     Once the player learns Rome is near, "Gratias! Vale!" leads to goodbye.
//   goodbye: high trust earns a cloak; saying you're a dog earns "Vale, canis!"
//
// Trust: +1 each for Salve, Quis es, Viator sum, asking for help, and Gratias;
// -1 for asking for his horse. A trust of 3 or more earns the cloak.

/** @type {import('../schema.js').Scene} */
export default {
  id: 'farmer',
  chapter: 'outskirts',
  background: 'assets/backgrounds/outskirts-rome.webp',
  character: 'farmer',

  props: [
    {
      id: 'machine',
      image: 'assets/objects/time-machine-broken.webp',
      label: 'Time machine (broken)',
      position: { left: '5%', bottom: '34%', width: '28%' },
    },
  ],

  start: 'arrive',

  nodes: {
    // ── Who are you? ─────────────────────────────────────────────────────────

    arrive: {
      speaker: 'farmer',
      narration: 'A sunburned man leading a horse stops short. He stares at you, then at the machine, then at you again.',
      latin: 'Salve! Quis es?',
      translation: 'Hello! Who are you?',
      vocab: [['salve', 'hello'], ['quis?', 'who?'], ['es', 'you are']],
      choices: [
        {
          say: 'Salve!',
          if: { notFlags: 'greetedFarmer' },
          effects: { setFlags: 'greetedFarmer', trust: { farmer: 1 } },
          next: 'greeted',
        },
        { say: 'Romanus sum.', next: 'claims_roman' },
        { say: 'Canis sum.', if: { notFlags: 'saidDog' }, next: 'dog' },
        { say: 'Quis es?', if: { notFlags: 'knowsFarmerName' }, next: 'his_name' },
        { say: 'Viator sum.', next: 'traveler' },
        { action: 'Say nothing and walk away', if: { notFlags: 'walkedAway' }, next: 'walk_away' },
      ],
    },

    greeted: {
      speaker: 'farmer',
      narration: 'He smiles. A polite stranger, at least.',
      latin: 'Salve! Sed… quis es?',
      translation: 'Hello! But… who are you?',
      vocab: [['sed', 'but'], ['quis?', 'who?']],
      choicesFrom: 'arrive',
    },

    his_name: {
      speaker: 'farmer',
      narration: 'He taps his chest.',
      latin: 'Ego? Gaius sum. Agricola sum. Filius et filia mea in urbe habitant. Et tu? Quis es?',
      translation: 'Me? I am Gaius. I am a farmer. My son and daughter live in the city. And you? Who are you?',
      vocab: [['ego', 'I'], ['agricola', 'farmer'], ['filius et filia', 'son and daughter'], ['in urbe', 'in the city'], ['habitant', 'they live'], ['tu', 'you']],
      onEnter: { setFlags: 'knowsFarmerName', trust: { farmer: 1 } },
      choicesFrom: 'arrive',
    },

    claims_roman: {
      speaker: 'farmer',
      pose: 'laughing',
      narration: 'He looks at your sneakers, your zip-up jacket, your wristwatch… and bursts out laughing.',
      latin: 'Ha! Romanus non es! Tunica tua est mira!',
      translation: 'Ha! You are not a Roman! Your tunic is strange!',
      vocab: [['non', 'not'], ['tunica', 'tunic'], ['tua', 'your'], ['mira', 'strange, amazing']],
      onEnter: { recordChoice: { introducedAs: 'roman' } },
      next: 'what_want',
    },

    traveler: {
      speaker: 'farmer',
      narration: 'He nods slowly, as if that explains the strange clothes.',
      latin: 'Viator? Bene!',
      translation: 'A traveller? Good!',
      vocab: [['viator', 'traveller'], ['bene', 'good, well']],
      onEnter: { recordChoice: { introducedAs: 'traveler' }, trust: { farmer: 1 } },
      next: 'what_want',
    },

    // The funny wrong answer: it doesn't block progress, and it gives you a bone.
    dog: {
      speaker: 'farmer',
      narration: 'The farmer blinks. The horse blinks. Very slowly, the farmer reaches out and pats you on the head.',
      latin: 'Canis? … Bonus canis! Ecce, os!',
      translation: 'A dog? … Good dog! Look, a bone!',
      vocab: [['canis', 'dog'], ['bonus', 'good'], ['ecce', 'look! here!'], ['os', 'bone']],
      onEnter: { addItems: 'bone', setFlags: 'saidDog', recordChoice: { introducedAs: 'dog' } },
      continueText: 'Accept the bone',
      next: 'dog_2',
    },

    dog_2: {
      speaker: 'farmer',
      pose: 'laughing',
      narration: 'He wipes tears of laughter from his eyes. The horse looks jealous of your bone.',
      latin: 'Ha! Canis non es. Homo es! Sed quis es?',
      translation: 'Ha! You are not a dog. You are a person! But who are you?',
      vocab: [['homo', 'person, human']],
      choicesFrom: 'arrive',
    },

    // ── Walking away: one warning, then a failure ending ─────────────────────

    walk_away: {
      speaker: 'farmer',
      narration: 'You turn your back and march off across the fields, away from the road. Behind you, the farmer shouts:',
      latin: 'Heus! Quo vadis?! Periculum est!',
      translation: 'Hey! Where are you going?! It’s dangerous!',
      vocab: [['heus!', 'hey!'], ['quo?', 'where (to)?'], ['vadis', 'you are going'], ['periculum', 'danger']],
      onEnter: { setFlags: 'walkedAway' },
      choices: [
        { action: 'Go back to the farmer', next: 'come_back' },
        { action: 'Ignore him and keep walking', next: 'lost' },
      ],
    },

    come_back: {
      speaker: 'farmer',
      narration: 'He watches you trudge back, one eyebrow raised.',
      latin: 'Salve… iterum. Quis es?',
      translation: 'Hello… again. Who are you?',
      vocab: [['iterum', 'again']],
      choicesFrom: 'arrive',
    },

    lost: {
      character: null,
      ending: {
        id: 'lost-in-the-fields',
        type: 'failure',
        title: 'Perditus!',
        subtitle: 'Lost!',
        text: [
          'You walk for hours: through wheat fields, a muddy marsh, and more wheat fields. By sunset you have found one goat, several thousand mosquitoes, and exactly zero Romans.',
          'Next time, maybe listen to the man asking where you’re going.',
        ],
      },
    },

    // ── What do you want? ────────────────────────────────────────────────────

    what_want: {
      speaker: 'farmer',
      narration: 'He leans on his horse and looks you over.',
      latin: 'Quid vis?',
      translation: 'What do you want?',
      vocab: [['quid?', 'what?'], ['vis', 'you want']],
      variants: [
        {
          if: { flags: 'knowsRomeIsNear' },
          narration: 'He scratches his chin.',
          latin: 'Quid nunc vis?',
          translation: 'What do you want now?',
          vocab: [['quid?', 'what?'], ['nunc', 'now'], ['vis', 'you want']],
        },
        { if: { visited: 'farmer.what_want' }, narration: 'He waits patiently.' },
      ],
      choices: [
        { say: 'Auxilium volo.', if: { notFlags: 'learnedAboutSmiths' }, next: 'help' },
        { say: 'Cibum volo.', if: { notFlags: 'askedForFood' }, next: 'food' },
        { say: 'Equum volo.', once: true, next: 'horse' },
        { say: 'Ubi est Roma?', if: { notFlags: 'knowsRomeIsNear' }, next: 'where_rome' },
        {
          say: 'Gratias! Vale!',
          if: { flags: 'knowsRomeIsNear' },
          effects: { trust: { farmer: 1 } },
          next: 'goodbye',
        },
        { action: 'Wander off', if: { notFlags: 'knowsRomeIsNear' }, next: 'wrong_way' },
        { action: 'Head down the road without a word', if: { flags: 'knowsRomeIsNear' }, next: 'goodbye' },
      ],
    },

    help: {
      speaker: 'farmer',
      highlight: 'machine',
      narration: 'You point at the machine. The farmer walks around it, taps the bent door frame with a knuckle, and whistles.',
      latin: 'Magna machina! Sed agricola sum, non faber.',
      translation: 'A big machine! But I am a farmer, not a smith.',
      vocab: [['magna', 'big'], ['machina', 'machine'], ['faber', 'smith, craftsman']],
      next: 'help_2',
    },

    help_2: {
      speaker: 'farmer',
      pose: 'pointing',
      narration: 'He points down the road.',
      latin: 'Roma est urbs magna et multos fabros habet. Roma est ibi!',
      translation: 'Rome is a great city and has many smiths. Rome is over there!',
      vocab: [['urbs magna', 'a great city'], ['multos', 'many'], ['fabros', 'smiths (accusative)'], ['habet', 'has'], ['ibi', 'there']],
      onEnter: { setFlags: ['learnedAboutSmiths', 'knowsRomeIsNear'], trust: { farmer: 1 } },
      next: 'what_want',
    },

    food: {
      speaker: 'farmer',
      narration: 'He rummages in a sack on the horse’s back and hands you a round, flat loaf.',
      latin: 'Cibum? Ecce, panis!',
      translation: 'Food? Here, bread!',
      vocab: [['cibum', 'food (accusative)'], ['ecce', 'look! here!'], ['panis', 'bread']],
      variants: [
        {
          if: { flags: 'saidDog' },
          latin: 'Cibum? Canis cibum vult! Ecce, panis!',
          translation: 'Food? The dog wants food! Here, bread!',
          vocab: [['canis', 'dog'], ['vult', 'wants'], ['panis', 'bread']],
        },
      ],
      onEnter: { addItems: 'bread', setFlags: 'askedForFood' },
      next: 'what_want',
    },

    horse: {
      speaker: 'farmer',
      narration: 'He throws a protective arm around the horse’s neck.',
      latin: 'Equum meum? Minime! Equus est amicus meus.',
      translation: 'My horse? No way! The horse is my friend.',
      vocab: [['equus', 'horse'], ['meus / meum', 'my'], ['minime', 'no way!'], ['amicus', 'friend']],
      onEnter: { trust: { farmer: -1 } },
      next: 'what_want',
    },

    where_rome: {
      speaker: 'farmer',
      pose: 'pointing',
      narration: 'He points down the stone road, toward the smoke and the red roofs on the hills.',
      latin: 'Roma? Roma est ibi. Roma est prope!',
      translation: 'Rome? Rome is over there. Rome is near!',
      vocab: [['ibi', 'there'], ['prope', 'near']],
      variants: [
        {
          if: { flags: 'readMilestone' },
          narration: [
            'He points down the stone road, toward the smoke and the red roofs on the hills.',
            'Three miles, just like the milestone said.',
          ],
        },
      ],
      onEnter: { setFlags: 'knowsRomeIsNear' },
      next: 'what_want',
    },

    // Wandering off here is forgiven: he just shouts directions.
    wrong_way: {
      speaker: 'farmer',
      pose: 'pointing',
      narration: 'You shrug and set off in a random direction. You get about ten steps before the farmer yells:',
      latin: 'Heus! Non ibi! Roma est ibi!',
      translation: 'Hey! Not there! Rome is over there!',
      vocab: [['heus!', 'hey!'], ['non', 'not'], ['ibi', 'there']],
      onEnter: { setFlags: 'knowsRomeIsNear' },
      next: 'what_want',
    },

    // ── Goodbye: the first matching variant wins, so order matters ───────────

    goodbye: {
      speaker: 'farmer',
      narration: 'He clicks his tongue, and he and the horse plod off toward the fields.',
      latin: 'Vale, viator! Via longa non est.',
      translation: 'Goodbye, traveller! The road isn’t long.',
      vocab: [['vale', 'goodbye'], ['viator', 'traveller'], ['via', 'road'], ['longa', 'long']],
      variants: [
        {
          if: { minTrust: { farmer: 3 }, choice: { introducedAs: 'roman' } },
          narration: 'Before he goes, he pulls a rough wool cloak from the horse’s pack and throws it over your shoulders.',
          latin: 'Tunica tua est mira. Ecce, pallium! Nunc Romanus es!',
          translation: 'Your tunic is strange. Here, a cloak! Now you are a Roman!',
          vocab: [['pallium', 'cloak'], ['nunc', 'now']],
          onEnter: { addItems: 'cloak' },
        },
        {
          if: { minTrust: { farmer: 3 } },
          narration: 'Before he goes, he pulls a rough wool cloak from the horse’s pack and throws it over your shoulders.',
          latin: 'Tunica tua est mira. Ecce, pallium! Vale, amice!',
          translation: 'Your tunic is strange. Here, a cloak! Goodbye, friend!',
          vocab: [['pallium', 'cloak'], ['vale', 'goodbye'], ['amice', 'friend (when speaking to someone)']],
          onEnter: { addItems: 'cloak' },
        },
        {
          if: { flags: 'saidDog' },
          pose: 'laughing',
          latin: 'Vale, canis!',
          translation: 'Goodbye, dog!',
          vocab: [['vale', 'goodbye'], ['canis', 'dog']],
        },
      ],
      continueText: 'Walk toward Rome',
      next: 'road_to_rome',
    },

    // End of Chapter I. "Perge" on the card continues to the city gate.
    road_to_rome: {
      character: null,
      ending: {
        id: 'chapter-1-complete',
        type: 'chapter',
        title: 'Finis Capituli I',
        subtitle: 'End of Chapter I',
        text: 'You set off down the paved road. With every step the walls of Rome grow taller, and at the city gate a soldier is already watching you come.',
        next: { scene: 'city-gate' },
      },
    },
  },
};
