// SCENE 10: THE PALACE GATE (Chapter VII)
// New Latin: the PERFECT tense in earnest, through questions about the player's
// own journey (misit, dedit, invenisti, dixit, praedixit, narravit, docuit), plus
// "scriptum est", credo + dative, and more commands (responde! monstra! audi!).
//
// The Praetorian Guard checks the player's authorization from Chapter VI:
//   palaceAccess 'sealed' → the senator's tablet: +2 trust, a short check
//   palaceAccess 'list'   → name on the list: a full interrogation, including
//                           "Ubi anulum invenisti?" (recalling Chapter V)
//   predictedRain         → a storm is raging, and the guards revere "the prophet": +1
//
// The bag search uses skipIf: the guard only finds the bone if you still have it.
//
// PATIENCE: only 2 strikes here. Out of patience means the Tullianum: game over for
// today. Strikes: every wrong answer in the interrogation and the bag search.
//
// Praetorian trust: +2 tablet, +1 storm prophecy, +1 "Cornelius me misit",
// +1 "In cavea picae"; −1 for each wrong or silly answer. 2+ gets you in.
// Refused? Plead ("Ave, Imperator!" gets you in), or if you fed Marcus in Chapter III,
// he vouches for you. Otherwise a failure ending. Sneaking in: comic ending.

/** @type {import('../schema.js').Scene} */
export default {
  id: 'palatium',
  chapter: 'palace',
  background: 'assets/backgrounds/palatium.webp',
  character: 'praetorian',
  patience: [{ npc: 'praetorian', max: 2, fail: 'tullianum' }],
  start: 'arrive',

  nodes: {
    arrive: {
      character: null,
      narration: [
        'The Palatine Hill rises above the Forum, crowned with the emperor’s palace: marble walls, gilded roofs, and a great gate.',
        'Soldiers in gleaming armour stand guard. These are the Praetorians, the emperor’s own bodyguard. They do not look like people who laugh at jokes.',
      ],
      variants: [
        {
          if: { flags: 'predictedRain' },
          narration: [
            'The Palatine Hill rises above the Forum, crowned with the emperor’s palace. A storm is raging: thunder rumbles and rain streams down the marble steps, exactly as you predicted.',
            'Soldiers in gleaming, dripping armour stand guard. These are the Praetorians, the emperor’s own bodyguard.',
          ],
        },
      ],
      continueText: 'Approach the gate',
      next: 'halt',
    },

    // ── Who are you? ─────────────────────────────────────────────────────────

    halt: {
      speaker: 'praetorian',
      narration: 'An officer with a crested helmet steps into your path.',
      latin: 'Siste! Quis es? Cur hic ades?',
      translation: 'Stop! Who are you? Why are you here?',
      vocab: [['siste', 'stop!'], ['hic ades', 'you are here']],
      variants: [
        {
          if: { flags: 'predictedRain', notVisited: 'palatium.halt' },
          narration: 'An officer with a crested helmet squints at you through the rain. Then his eyes go wide.',
          latin: 'Tu… tu es vates! Cornelius nobis dixit: “Vates tempestatem praedixit!”',
          translation: 'You… you’re the prophet! Cornelius told us: “The prophet predicted the storm!”',
          vocab: [['vates', 'prophet'], ['nobis', 'to us'], ['dixit', 'said, told (perfect)'], ['tempestatem', 'storm'], ['praedixit', 'predicted (perfect)']],
          onEnter: { trust: { praetorian: 1 } },
        },
        { if: { visited: 'palatium.halt' }, latin: 'Iterum: quis es?', translation: 'Again: who are you?', vocab: [['iterum', 'again']] },
      ],
      choices: [
        { action: 'Show him the senator’s sealed tablet', if: { hasItems: 'senator-tablet' }, next: 'tablet' },
        { say: 'Cornelius nomen meum tibi dedit.', if: { authorizations: 'senator-list', lacksItems: 'senator-tablet' }, next: 'list' },
        { say: 'Imperatorem videre volo.', once: true, next: 'everyone' },
        { action: 'Sneak around the side of the gate', next: 'sneak' },
      ],
    },

    tablet: {
      speaker: 'praetorian',
      narration: 'He takes the wax tablet and examines the seal carefully.',
      latin: 'Signum Cornelii. Verum est.',
      translation: 'Cornelius’s seal. It is genuine.',
      vocab: [['signum', 'seal'], ['verum', 'true, genuine']],
      onEnter: { trust: { praetorian: 2 } },
      next: 'search',
    },

    list: {
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'He unrolls a list and runs a finger down it.',
      latin: 'Hmm. Hic scriptum est: “Peregrinus mirus, hospes Aurelii.” Tune es?',
      translation: 'Hmm. It says here: “A strange foreigner, Aurelius’s guest.” Is that you?',
      vocab: [['dedit', 'gave (perfect)'], ['scriptum est', 'it is written'], ['mirus', 'strange'], ['hospes', 'guest'], ['tune es?', 'is it you?']],
      choices: [
        { say: 'Ita, ego sum.', next: 'search' },
        { say: 'Minime!', once: true, strike: 'praetorian', next: 'not_me' },
      ],
    },

    not_me: {
      speaker: 'praetorian',
      pose: 'suspicious',
      latin: 'Minime? Ergo quis es?!',
      translation: 'No? Then who are you?!',
      vocab: [['ergo', 'then, therefore']],
      onEnter: { trust: { praetorian: -1 } },
      choicesFrom: 'list',
    },

    everyone: {
      speaker: 'praetorian',
      latin: 'Omnes imperatorem videre volunt! Sed nemo sine signo intrat!',
      translation: 'Everyone wants to see the emperor! But nobody gets in without a seal!',
      vocab: [['omnes', 'everyone'], ['nemo', 'nobody'], ['sine signo', 'without a seal'], ['intrat', 'enters, gets in']],
      next: 'halt',
    },

    sneak: {
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'You edge along the wall and duck behind a statue of Augustus… and a spear point appears an inch from your nose.',
      latin: 'Quo vadis, fur?',
      translation: 'Where do you think you’re going, thief?',
      vocab: [['quo vadis?', 'where are you going?'], ['fur', 'thief']],
      onEnter: { recordChoice: { jailedFrom: 'palace' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    // Out of patience: game over for today.
    tullianum: {
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'The officer’s hand goes to his sword. Two more Praetorians step up behind you.',
      latin: 'Satis! Suspectus es. In Tullianum!',
      translation: 'Enough! You’re suspicious. To the Tullianum!',
      vocab: [['satis', 'enough'], ['suspectus', 'suspicious, under suspicion'], ['in Tullianum', 'to the Tullianum (Rome’s deepest prison)']],
      onEnter: { recordChoice: { jailedFrom: 'palace' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    // ── The bag search (steps are skipped if you don't have the item) ────────

    search: {
      speaker: 'praetorian',
      pose: 'suspicious',
      latin: 'Nunc: gladium habesne? Sacculum tuum monstra!',
      translation: 'Now: do you have a sword? Show me your bag!',
      vocab: [['gladium', 'sword'], ['habesne?', 'do you have?'], ['sacculum', 'bag'], ['monstra', 'show!']],
      continueText: 'Open your bag',
      next: 'search_hinge',
    },

    search_hinge: {
      skipIf: { lacksItems: 'broken-hinge' },
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'He pulls out the snapped bronze hinge and holds it up.',
      latin: 'Metallum! Quid est hoc?',
      translation: 'Metal! What is this?',
      vocab: [['metallum', 'metal'], ['hoc', 'this']],
      choices: [
        { say: 'Cardo fractus est.', next: 'hinge_ok' },
        { say: 'Gladius est!', once: true, strike: 'praetorian', next: 'hinge_sword' },
        { say: 'Nescio.', once: true, strike: 'praetorian', next: 'hinge_nescio' },
      ],
      next: 'search_bone',
    },

    hinge_ok: {
      speaker: 'praetorian',
      latin: 'Cardo? … Bene. Hoc gladius non est.',
      translation: 'A hinge? … Fine. This isn’t a sword.',
      vocab: [['cardo', 'hinge'], ['gladius', 'sword']],
      next: 'search_bone',
    },

    hinge_sword: {
      speaker: 'praetorian',
      narration: 'He looks at the small, bent hinge. Then at you.',
      latin: 'Gladius? Hoc gladius non est. Stultus es.',
      translation: 'A sword? This is not a sword. You’re an idiot.',
      vocab: [['gladius', 'sword'], ['stultus', 'foolish, an idiot']],
      onEnter: { trust: { praetorian: -1 } },
      next: 'search_bone',
    },

    hinge_nescio: {
      speaker: 'praetorian',
      pose: 'suspicious',
      latin: 'Nescis? Hoc suspectum est!',
      translation: 'You don’t know? That’s suspicious!',
      vocab: [['nescis', 'you don’t know'], ['suspectum', 'suspicious, suspect']],
      onEnter: { trust: { praetorian: -1 } },
      next: 'search_bone',
    },

    // Chapter I's bone, if you still have it.
    search_bone: {
      skipIf: { lacksItems: 'bone' },
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'Next he pulls out… an old soup bone.',
      latin: 'Et… os? Cur os habes?',
      translation: 'And… a bone? Why do you have a bone?',
      vocab: [['os', 'bone'], ['cur?', 'why?']],
      choices: [
        { say: 'Canis sum.', strike: 'praetorian', next: 'bone_dog' },
        { say: 'Donum est.', next: 'bone_gift' },
      ],
      next: 'questions',
    },

    bone_dog: {
      speaker: 'praetorian',
      narration: 'A long silence. The other guards turn to stare.',
      latin: 'Canis? Hmm. Imperator leones habet, non canes!',
      translation: 'A dog? Hmm. The emperor keeps lions, not dogs!',
      vocab: [['leones', 'lions'], ['canes', 'dogs']],
      next: 'questions',
    },

    bone_gift: {
      speaker: 'praetorian',
      latin: 'Donum? … Mirum.',
      translation: 'A gift? … Strange.',
      vocab: [['donum', 'gift'], ['mirum', 'strange']],
      next: 'questions',
    },

    // ── Questions about your journey (perfect tense) ─────────────────────────

    questions: {
      speaker: 'praetorian',
      narration: 'He hands back your bag.',
      latin: 'Nunc dic mihi: quis te misit?',
      translation: 'Now tell me: who sent you?',
      vocab: [['dic mihi', 'tell me'], ['misit', 'sent (perfect)']],
      choices: [
        { say: 'Cornelius me misit.', effects: { trust: { praetorian: 1 } }, next: 'sent_right' },
        { say: 'Aurelius me misit.', effects: { trust: { praetorian: -1 } }, strike: 'praetorian', next: 'sent_aurelius' },
        { say: 'Imperator me misit!', effects: { trust: { praetorian: -1 } }, strike: 'praetorian', next: 'sent_liar' },
      ],
    },

    sent_right: {
      speaker: 'praetorian',
      latin: 'Cornelius. Bene.',
      translation: 'Cornelius. Good.',
      next: 'ring_question',
    },

    sent_aurelius: {
      speaker: 'praetorian',
      pose: 'suspicious',
      latin: 'Aurelius? Aurelius senator non est!',
      translation: 'Aurelius? Aurelius isn’t a senator!',
      vocab: [['senator', 'senator']],
      next: 'ring_question',
    },

    sent_liar: {
      speaker: 'praetorian',
      pose: 'suspicious',
      latin: 'Imperator? Mendax! Imperator te non misit!',
      translation: 'The emperor? Liar! The emperor did not send you!',
      vocab: [['mendax', 'liar'], ['misit', 'sent (perfect)']],
      next: 'ring_question',
    },

    // Only for the list route: recalling Chapter V.
    ring_question: {
      skipIf: { choice: { palaceAccess: 'sealed' } },
      speaker: 'praetorian',
      latin: 'Cornelius dixit: “Hospes anulum Aurelii invenit.” Ubi anulum invenisti?',
      translation: 'Cornelius said: “The guest found Aurelius’s ring.” Where did you find the ring?',
      vocab: [['dixit', 'said (perfect)'], ['invenit', 'found (perfect)'], ['invenisti', 'you found (perfect)']],
      choices: [
        { say: 'In cavea picae.', effects: { trust: { praetorian: 1 } }, next: 'ring_right' },
        { say: 'In culina.', effects: { trust: { praetorian: -1 } }, strike: 'praetorian', next: 'ring_wrong' },
        { say: 'In balneis.', effects: { trust: { praetorian: -1 } }, strike: 'praetorian', next: 'ring_wrong' },
        { say: 'In foro.', effects: { trust: { praetorian: -1 } }, strike: 'praetorian', next: 'ring_wrong' },
      ],
      next: 'verdict',
    },

    ring_right: {
      speaker: 'praetorian',
      pose: 'approving',
      narration: 'For the first time, the corner of his mouth twitches.',
      latin: 'In cavea picae! Verum est. Aurelius omnibus de pica narravit.',
      translation: 'In the magpie’s cage! That’s true. Aurelius has told everyone about that magpie.',
      vocab: [['cavea', 'cage'], ['picae', 'of the magpie'], ['omnibus', 'to everyone'], ['narravit', 'told (perfect)']],
      next: 'verdict',
    },

    ring_wrong: {
      speaker: 'praetorian',
      pose: 'suspicious',
      latin: 'Minime! Aurelius aliud narravit!',
      translation: 'No! Aurelius told a different story!',
      vocab: [['aliud', 'something else'], ['narravit', 'told (perfect)']],
      next: 'verdict',
    },

    // ── The verdict ──────────────────────────────────────────────────────────

    verdict: {
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'He folds his arms.',
      latin: 'Minime. Non intras.',
      translation: 'No. You’re not coming in.',
      vocab: [['minime', 'no'], ['intras', 'you enter']],
      variants: [
        {
          if: { minTrust: { praetorian: 2 } },
          pose: 'approving',
          narration: 'He steps aside.',
          latin: 'Bene. Intrare potes.',
          translation: 'Good. You may go in.',
          vocab: [['intrare', 'to enter'], ['potes', 'you can']],
          choices: [],
          next: 'warning',
        },
      ],
      choices: [
        { action: 'Wave to Marcus in the crowd', if: { helped: 'boy' }, next: 'marcus' },
        { say: 'Iterum rogo! Quaeso!', once: true, next: 'plead' },
        { action: 'Give up and go back down the hill', next: 'turned_away' },
      ],
    },

    // Kindness pays off: feeding Marcus in Chapter III.
    marcus: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      narration: 'A familiar skinny figure squeezes through the crowd with a basket of bread. Marcus! He runs errands for the palace kitchens.',
      latin: 'Hic peregrinus amicus meus est! Homo bonus est! Ego testis sum!',
      translation: 'This stranger is my friend! A good person! I’m a witness!',
      vocab: [['homo bonus', 'a good person'], ['testis', 'witness']],
      next: 'marcus_2',
    },

    marcus_2: {
      speaker: 'praetorian',
      pose: 'approving',
      narration: 'The officer sighs. Clearly everyone at the palace knows Marcus.',
      latin: 'Marcus? Puer coquorum? … Bene. Marco credo. Intra!',
      translation: 'Marcus? The cooks’ boy? … Fine. I trust Marcus. Go in!',
      vocab: [['coquorum', 'of the cooks'], ['Marco credo', 'I trust Marcus (credo takes the dative)'], ['intra', 'go in!']],
      next: 'warning',
    },

    // A second chance that tests Chapter VI's lesson.
    plead: {
      speaker: 'praetorian',
      narration: 'He studies you for a long moment.',
      latin: 'Quaeso? … Bene. Unum responsum. Quid imperatori dices?',
      translation: 'Please? … All right. One answer. What will you say to the emperor?',
      vocab: [['responsum', 'answer'], ['imperatori', 'to the emperor'], ['dices', 'you will say (future)']],
      choices: [
        { say: 'Ave, Imperator!', next: 'plead_ok' },
        { say: 'Salve, amice!', strike: 'praetorian', next: 'turned_away' },
        { say: 'Heus tu!', strike: 'praetorian', next: 'turned_away' },
      ],
    },

    plead_ok: {
      speaker: 'praetorian',
      pose: 'approving',
      latin: 'Bene dixisti. Intra.',
      translation: 'Well said. Go in.',
      vocab: [['dixisti', 'you said (perfect)'], ['intra', 'go in!']],
      next: 'warning',
    },

    turned_away: {
      character: null,
      ending: {
        id: 'turned-away-at-palace',
        type: 'defeat',
        title: 'Non Intras!',
        subtitle: 'You Shall Not Pass!',
        text: [
          'Two Praetorians march you back down the Palatine Hill. The palace gates boom shut behind you. So close.',
          'Maybe try making a better impression on the people who could vouch for you.',
        ],
      },
    },

    // ── Through the gate ─────────────────────────────────────────────────────

    warning: {
      speaker: 'praetorian',
      pose: 'approving',
      narration: 'As you pass, he lowers his voice.',
      latin: 'Tace et audi: ante imperatorem genua flecte, et “Ave, Imperator” dic!',
      translation: 'Be quiet and listen: in front of the emperor, bend your knee, and say “Ave, Imperator”!',
      vocab: [['tace', 'be quiet!'], ['audi', 'listen!'], ['ante', 'in front of'], ['genua flecte', 'bend your knee'], ['dic', 'say!']],
      choices: [
        { say: 'Scio!', if: { flags: 'knowsAve' }, next: 'already_know' },
        { say: 'Gratias!', next: 'end' },
      ],
    },

    already_know: {
      speaker: 'praetorian',
      pose: 'approving',
      latin: 'Bene. Cornelius te bene docuit.',
      translation: 'Good. Cornelius taught you well.',
      vocab: [['scio', 'I know'], ['docuit', 'taught (perfect)']],
      next: 'end',
    },

    // ── End of Chapter VII ───────────────────────────────────────────────────

    end: {
      character: null,
      ending: {
        id: 'chapter-7-complete',
        type: 'chapter',
        title: 'Finis Capituli VII',
        subtitle: 'End of Chapter VII',
        text: 'The gates open onto a courtyard of gleaming marble. Servants hurry past with silver trays. At the far end of a great hall, beyond purple curtains, sits the most powerful person in the world.',
        next: { scene: 'aula' },
      },
      variants: [
        {
          if: { flags: 'predictedRain' },
          ending: {
            id: 'chapter-7-complete',
            type: 'chapter',
            title: 'Finis Capituli VII',
            subtitle: 'End of Chapter VII',
            text: 'The gates open onto a courtyard of gleaming marble. You drip rainwater all over it. At the far end of a great hall, beyond purple curtains, sits the most powerful person in the world.',
            next: { scene: 'aula' },
          },
        },
      ],
    },
  },
};
