// SCENE 3: THE CITY GATE (Chapter II)
// A small step up from Chapter I:
//   ad + accusative for "to" (ad forum), Romam with no preposition (cities),
//   quo? / cur?, eo ("I go"), imperatives: siste! intra! cave!
//
// Chapter I pays off here:
//   cloak               → the guard starts out less suspicious; "Romanus sum." works with it
//   broken hinge        → the most convincing reason to be let in
//   bread               → a hungry guard lets you through
//   bone                → distract the guard dog and slip past
//   learnedAboutSmiths  → unlocks "Fabrum quaero."
//
// PATIENCE: 3 strikes (bad answers) and the guard has you thrown in prison, which is
// game over for today. Strikes: an unconvincing "Romanus sum" (no cloak), "Mercator sum",
// "Canis sum", "Romam eo", "Nescio". "Imperator sum!" is instant prison.
//
// The guard lets you in when his trust reaches 2. Otherwise he refuses, and you can
// use an item or hide in a cart, so there is no dead end.
//
// Guard trust: +1 wearing the cloak, +1 "Viator sum", +1/−1 "Romanus sum" (with/without
// cloak), −1 "Mercator sum", −1 "Canis sum", +1 hinge or "Machina mea est fracta",
// −1 "Nescio".

/** @type {import('../schema.js').Scene} */
export default {
  id: 'city-gate',
  chapter: 'gate',
  background: 'assets/backgrounds/city-gate.webp',
  character: 'guard',
  patience: [{ npc: 'guard', max: 3, fail: 'arrest' }],

  props: [
    {
      id: 'dog',
      image: 'assets/objects/guard-dog.webp',
      label: 'Guard dog',
      position: { left: '6%', bottom: '31.5%', width: '19%' },
    },
  ],

  start: 'approach',

  nodes: {
    // ── Arriving ─────────────────────────────────────────────────────────────

    approach: {
      character: null,
      narration: [
        'The paved road ends at a massive stone gate in the city wall. Carts, farmers, and a flock of complaining sheep squeeze past a soldier in a bronze helmet.',
        'A huge dog is chained beside the gateway. On the wall, a stone plaque is carved with two words:',
      ],
      latin: 'CAVE CANEM',
      latinStyle: 'inscription',
      translation: 'Beware of the dog!',
      vocab: [['cave', 'beware!'], ['canem', 'dog (accusative of canis)']],
      variants: [
        {
          if: { visited: 'city-gate.approach' },
          narration: 'A soldier in a bronze helmet is stopping everyone at the gate. The dog watches you.',
          latin: null,
          translation: null,
          vocab: [],
        },
      ],
      choices: [
        { action: 'Walk up to the gate', next: 'halt' },
        { action: 'Wait in line and listen', once: true, next: 'line' },
        { action: 'Look at the dog', once: true, next: 'dog_look' },
      ],
    },

    dog_look: {
      character: null,
      highlight: 'dog',
      narration: 'The dog is the size of a small pony. It watches you with small, suspicious eyes and gives a low growl.',
      variants: [
        {
          if: { hasItems: 'bone' },
          narration: [
            'The dog is the size of a small pony. It watches you with small, suspicious eyes…',
            '…then sniffs the air and stares hungrily at your bag. At the bone in your bag, to be exact.',
          ],
        },
      ],
      next: 'approach',
    },

    // Listening first shows students a model answer, which they can then use themselves.
    line: {
      speaker: 'guard',
      pose: 'blocking',
      narration: 'You join the line behind a merchant with a cart of cabbages. A soldier in a bronze helmet holds up his hand.',
      latin: 'Siste! Quis es? Quo vadis?',
      translation: 'Stop! Who are you? Where are you going?',
      vocab: [['siste', 'stop!'], ['quis?', 'who?'], ['quo?', 'where to?'], ['vadis', 'you are going']],
      next: 'line_2',
    },

    line_2: {
      speaker: 'cabbageSeller',
      narration: 'The merchant answers without even looking up.',
      latin: 'Mercator sum. Ad forum eo.',
      translation: 'I am a merchant. I am going to the forum.',
      vocab: [['mercator', 'merchant'], ['ad forum', 'to the forum'], ['eo', 'I go, I am going']],
      next: 'line_3',
    },

    line_3: {
      speaker: 'guard',
      narration: 'The cart rumbles through the gate. Now it’s your turn.',
      latin: 'Bene. Intra!',
      translation: 'Good. Go in!',
      vocab: [['bene', 'good, fine'], ['intra', 'go in! enter!']],
      onEnter: { setFlags: 'overheardMerchant' },
      continueText: 'Step up to the soldier',
      next: 'halt',
    },

    // ── Who are you? ─────────────────────────────────────────────────────────

    halt: {
      speaker: 'guard',
      pose: 'blocking',
      narration: 'The soldier looks you up and down: strange shoes, strange clothes. His hand tightens on his spear.',
      latin: 'Siste! Miles sum; portam defendo. Quis es?',
      translation: 'Stop! I am a soldier; I guard the gate. Who are you?',
      vocab: [['siste', 'stop!'], ['miles', 'soldier'], ['portam defendo', 'I defend the gate'], ['quis?', 'who?']],
      variants: [
        {
          if: { hasItems: 'cloak' },
          narration: 'The soldier glances at your wool cloak and relaxes a little. Then he notices your shoes.',
          onEnter: { trust: { guard: 1 } },
        },
      ],
      choices: [
        { say: 'Viator sum.', next: 'traveler' },
        // Only convincing if you're wearing Gaius's cloak.
        { say: 'Romanus sum.', if: { hasItems: 'cloak' }, next: 'claims_roman' },
        { say: 'Romanus sum.', meaning: 'I am a Roman.', if: { lacksItems: 'cloak' }, strike: 'guard', next: 'claims_roman' },
        { say: 'Mercator sum.', meaning: 'I am a merchant.', if: { flags: 'overheardMerchant' }, strike: 'guard', next: 'claims_merchant' },
        { say: 'Canis sum.', meaning: 'I am a dog.', if: { notFlags: 'toldGuardDog' }, strike: 'guard', next: 'claims_dog' },
        { say: 'Imperator sum!', next: 'claims_emperor' },
      ],
    },

    traveler: {
      speaker: 'guard',
      latin: 'Viator? Bene.',
      translation: 'A traveller? Fine.',
      vocab: [['viator', 'traveller']],
      onEnter: { trust: { guard: 1 } },
      next: 'quo_vadis',
    },

    claims_roman: {
      speaker: 'guard',
      narration: 'He snorts.',
      latin: 'Romanus? Tunica tua non est Romana!',
      translation: 'A Roman? Your tunic is not Roman!',
      vocab: [['tunica', 'tunic'], ['tua', 'your'], ['Romana', 'Roman']],
      onEnter: { trust: { guard: -1 } },
      variants: [
        {
          if: { hasItems: 'cloak' },
          narration: 'He looks at your cloak and shrugs.',
          latin: 'Romanus? … Bene.',
          translation: 'A Roman? … Fine.',
          vocab: [['bene', 'good, fine']],
          onEnter: { trust: { guard: 1 } },
        },
      ],
      next: 'quo_vadis',
    },

    // Copying the merchant's answer word for word doesn't work.
    claims_merchant: {
      speaker: 'guard',
      narration: 'He looks behind you. There is no cart. There are no cabbages.',
      latin: 'Mercator? Sed carrum non habes!',
      translation: 'A merchant? But you don’t have a cart!',
      vocab: [['sed', 'but'], ['carrum', 'cart (accusative)'], ['habes', 'you have']],
      onEnter: { trust: { guard: -1 } },
      next: 'quo_vadis',
    },

    claims_dog: {
      speaker: 'guard',
      highlight: 'dog',
      narration: 'The soldier points at the enormous dog. The dog shows its teeth.',
      latin: 'Canis? Ecce, canis verus! Timesne?',
      translation: 'A dog? Look, a real dog! Are you scared?',
      vocab: [['ecce', 'look!'], ['verus', 'real'], ['timesne?', 'are you afraid?']],
      onEnter: { setFlags: 'toldGuardDog', trust: { guard: -1 } },
      next: 'claims_dog_2',
    },

    claims_dog_2: {
      speaker: 'guard',
      pose: 'blocking',
      latin: 'Iterum: quis es?',
      translation: 'Again: who are you?',
      vocab: [['iterum', 'again']],
      choicesFrom: 'halt',
    },

    claims_emperor: {
      speaker: 'guard',
      pose: 'laughing',
      narration: 'There is a long silence. Then the soldier laughs so hard his helmet slips.',
      latin: 'Imperator?! Ha! In carcerem!',
      translation: 'The emperor?! Ha! To prison!',
      vocab: [['imperator', 'emperor'], ['in carcerem', 'to prison']],
      onEnter: { recordChoice: { jailedFrom: 'gate-emperor' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    // Out of patience: game over for today.
    arrest: {
      speaker: 'guard',
      pose: 'blocking',
      narration: 'The guard has heard enough. He grabs you by the collar and whistles for two more soldiers.',
      latin: 'Satis! Te in carcerem duco!',
      translation: 'Enough! I’m taking you to prison!',
      vocab: [['satis', 'enough'], ['in carcerem', 'to prison'], ['duco', 'I lead, I take']],
      onEnter: { recordChoice: { jailedFrom: 'gate' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    // ── Where are you going? ─────────────────────────────────────────────────

    quo_vadis: {
      speaker: 'guard',
      latin: 'Quo vadis?',
      translation: 'Where are you going?',
      vocab: [['quo?', 'where to?'], ['vadis', 'you are going']],
      variants: [{ if: { visited: 'city-gate.quo_vadis' }, narration: 'The soldier sighs.' }],
      choices: [
        { say: 'Ad forum eo.', effects: { recordChoice: { destination: 'forum' } }, next: 'why' },
        {
          say: 'Fabrum quaero.',
          if: { flags: 'learnedAboutSmiths' },
          effects: { recordChoice: { destination: 'smith' } },
          next: 'why',
        },
        { say: 'Romam eo.', meaning: 'I am going to Rome.', once: true, strike: 'guard', next: 'rome_is_here' },
        { say: 'Domum eo.', once: true, next: 'home' },
      ],
    },

    rome_is_here: {
      speaker: 'guard',
      pose: 'laughing',
      narration: 'He spreads his arms wide at the walls, the gate, the crowds.',
      latin: 'Romam? Roma est hic!',
      translation: 'To Rome? Rome is here!',
      vocab: [['Romam', 'to Rome (cities need no “ad”)'], ['hic', 'here']],
      next: 'quo_vadis',
    },

    home: {
      speaker: 'guard',
      latin: 'Domum? Ubi est domus tua?',
      translation: 'Home? Where is your home?',
      vocab: [['domum', 'home (as a destination)'], ['ubi?', 'where?'], ['domus', 'house, home']],
      continueText: 'Explaining time travel seems like a bad idea…',
      next: 'quo_vadis',
    },

    // ── Why? ─────────────────────────────────────────────────────────────────

    why: {
      speaker: 'guard',
      latin: 'Cur?',
      translation: 'Why?',
      vocab: [['cur?', 'why?']],
      variants: [
        {
          if: { choice: { destination: 'smith' } },
          latin: 'Fabrum? Cur?',
          translation: 'A smith? Why?',
          vocab: [['fabrum', 'smith (accusative)'], ['cur?', 'why?']],
        },
      ],
      choices: [
        { action: 'Show him the broken hinge', if: { hasItems: 'broken-hinge' }, next: 'show_hinge' },
        { say: 'Machina mea est fracta.', next: 'broken_machine' },
        { say: 'Cibum quaero.', next: 'food' },
        { say: 'Nescio.', meaning: 'I don’t know.', strike: 'guard', next: 'dont_know' },
      ],
    },

    show_hinge: {
      speaker: 'guard',
      narration: 'You hold up the snapped bronze hinge. The soldier turns it over in his fingers and frowns.',
      latin: 'Cardo fractus! Fabri sunt in foro.',
      translation: 'A broken hinge! The smiths are in the forum.',
      vocab: [['cardo', 'hinge'], ['fractus', 'broken'], ['fabri', 'smiths'], ['in foro', 'in the forum']],
      onEnter: { trust: { guard: 1 }, setFlags: 'knowsSmithsInForum' },
      next: 'verdict',
    },

    broken_machine: {
      speaker: 'guard',
      narration: 'He raises an eyebrow.',
      latin: 'Machina tua? Fabri sunt in foro.',
      translation: 'Your machine? The smiths are in the forum.',
      vocab: [['machina', 'machine'], ['fabri', 'smiths'], ['in foro', 'in the forum']],
      onEnter: { trust: { guard: 1 }, setFlags: 'knowsSmithsInForum' },
      next: 'verdict',
    },

    food: {
      speaker: 'guard',
      latin: 'Cibus est in foro.',
      translation: 'The food is in the forum.',
      vocab: [['cibus', 'food'], ['in foro', 'in the forum']],
      variants: [
        {
          if: { hasItems: 'bread' },
          narration: 'He eyes the loaf poking out of your bag.',
          latin: 'Cibum? Sed panem habes!',
          translation: 'Food? But you have bread!',
          vocab: [['sed', 'but'], ['panem', 'bread (accusative)'], ['habes', 'you have']],
        },
      ],
      next: 'verdict',
    },

    dont_know: {
      speaker: 'guard',
      narration: 'The soldier narrows his eyes.',
      latin: 'Nescis?!',
      translation: 'You don’t know?!',
      vocab: [['nescis', 'you don’t know']],
      onEnter: { trust: { guard: -1 } },
      next: 'verdict',
    },

    // ── The verdict ──────────────────────────────────────────────────────────

    verdict: {
      speaker: 'guard',
      pose: 'blocking',
      narration: 'He lowers his spear across the gateway.',
      latin: 'Minime! Non intras!',
      translation: 'No way! You are not coming in!',
      vocab: [['minime', 'no way!'], ['intras', 'you enter, you are coming in']],
      variants: [
        {
          if: { minTrust: { guard: 2 } },
          pose: 'default',
          narration: 'He studies you for a long moment, then steps aside.',
          latin: 'Bene. Intra!',
          translation: 'Good. Go in!',
          vocab: [['bene', 'good'], ['intra', 'go in!']],
          onEnter: { recordChoice: { enteredBy: 'talking' }, reputation: 1 },
          choices: [],
          continueText: 'Walk through the gate',
          next: 'inside',
        },
      ],
      choices: [
        {
          action: 'Offer the soldier your bread',
          if: { hasItems: 'bread' },
          effects: { removeItems: 'bread', recordChoice: { enteredBy: 'bread' } },
          next: 'bread_bribe',
        },
        {
          action: 'Toss the bone to the guard dog',
          if: { hasItems: 'bone' },
          effects: { removeItems: 'bone', recordChoice: { enteredBy: 'bone' }, reputation: -1 },
          next: 'bone_chaos',
        },
        { action: 'Wait for the next cart and hide in it', effects: { recordChoice: { enteredBy: 'cart' } }, next: 'cart' },
        { action: 'Give up and walk back to the machine', next: 'give_up' },
      ],
    },

    bread_bribe: {
      speaker: 'guard',
      narration: 'The soldier stares at the bread. His stomach growls, loudly. He has been on duty since dawn.',
      latin: 'Panis?! Gratias! Cibum valde cupio! … Intra, amice!',
      translation: 'Bread?! Thanks! I really want food! … Go in, friend!',
      vocab: [['gratias', 'thanks'], ['cibum valde cupio', 'I really want food'], ['intra', 'go in!'], ['amice', 'friend (speaking to someone)']],
      onEnter: { trust: { guard: 2 } },
      continueText: 'Walk through the gate',
      next: 'inside',
    },

    bone_chaos: {
      speaker: 'guard',
      pose: 'blocking',
      highlight: 'dog',
      narration: [
        'You toss the bone. The dog lunges for it, the chain snaps tight, and the soldier is yanked off his feet.',
        'While he wrestles with the dog, you slip through the gate.',
      ],
      latin: 'Canis currit! Siste, canis! SISTE!',
      translation: 'The dog is running! Stop, dog! STOP!',
      vocab: [['currit', 'runs, is running'], ['siste', 'stop!'], ['canis', 'dog']],
      continueText: 'Slip through the gate',
      next: 'inside',
    },

    cart: {
      character: null,
      narration: [
        'A farmer’s cart piled high with cabbages creaks toward the gate. When the soldier turns to shout at some runaway sheep, you dive in and burrow down among the cabbages.',
        'The cart rolls through the gate. Nobody notices. You smell strongly of cabbage.',
      ],
      continueText: 'Climb out',
      next: 'inside',
    },

    give_up: {
      character: null,
      ending: {
        id: 'gave-up-at-gate',
        type: 'defeat',
        title: 'Frustra!',
        subtitle: 'All for Nothing!',
        text: [
          'You trudge back down the road and sit beside the time machine. It is still broken.',
          'The sun sets over Rome, a city you never entered.',
        ],
      },
    },

    // ── End of Chapter II: the text depends on how you got in ────────────────

    inside: {
      character: null,
      ending: {
        id: 'chapter-2-complete',
        type: 'chapter',
        title: 'Finis Capituli II',
        subtitle: 'End of Chapter II',
        text: 'You walk through the gate and into Rome itself: noise, smoke, shouting sellers, and streets packed with people. Somewhere in this city is a smith who can fix your machine.',
        next: { scene: 'forum' },
      },
      variants: [
        {
          if: { choice: { enteredBy: 'bread' } },
          ending: {
            id: 'chapter-2-complete',
            type: 'chapter',
            title: 'Finis Capituli II',
            subtitle: 'End of Chapter II',
            text: 'One loaf lighter, you walk through the gate and into Rome itself: noise, smoke, shouting sellers, and streets packed with people. Behind you, the soldier is still chewing happily. Somewhere in this city is a smith who can fix your machine.',
            next: { scene: 'forum' },
          },
        },
        {
          if: { choice: { enteredBy: 'bone' } },
          ending: {
            id: 'chapter-2-complete',
            type: 'chapter',
            title: 'Finis Capituli II',
            subtitle: 'End of Chapter II',
            text: 'Behind you, the soldier is still shouting at the dog. Ahead of you is Rome itself: noise, smoke, shouting sellers, and streets packed with people. Somewhere in this city is a smith who can fix your machine. Better hope that soldier doesn’t remember your face.',
            next: { scene: 'forum' },
          },
        },
        {
          if: { choice: { enteredBy: 'cart' } },
          ending: {
            id: 'chapter-2-complete',
            type: 'chapter',
            title: 'Finis Capituli II',
            subtitle: 'End of Chapter II',
            text: 'You tumble out of the cart, shedding cabbage leaves, into Rome itself: noise, smoke, shouting sellers, and streets packed with people. Somewhere in this city is a smith who can fix your machine, if they can stand the smell.',
            next: { scene: 'forum' },
          },
        },
      ],
    },
  },
};
