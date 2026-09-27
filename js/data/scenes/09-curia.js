// SCENE 9: THE SENATE HOUSE (Chapter VI)
// New Latin: the FUTURE tense (petam, petes, dices, erit, videbis, dabo,
// sinent), more perfects (scripsit, dixisti), longer questions, and register:
// how you address an emperor ("Ave, Imperator!", not "Salve, amice!").
//
// Senator Cornelius interviews the player on the steps of the Curia and decides
// how they get into the palace.
//
// Chapter V pays off: a warm letter from Aurelius starts him at +1 trust.
//
// Traps and jokes:
//   "Imperium peto!"   means "I seek supreme power", not "I seek the emperor":
//                      arrested for treason (comic ending, retry)
//   "In futuro!"       he thinks you're a prophet: "Quid cras erit?" (future tense);
//                      predicting a storm (tempestas) pays off in Chapters VII and VIII
//   "Heus tu!"         "Di immortales!"
//
// PATIENCE: 3 strikes and Cornelius calls the soldiers: prison, game over for today.
// Strikes: every wrong or rude answer below. "Imperium peto!" is instant prison.
//
// Cornelius trust: +1 warm letter, +1 "Fabros imperatoris peto", +1 "Quinque",
// +1 flattering prophecy, +1 "Ave, Imperator!"; −1 for each wrong answer.
// Trust 2+: a tablet with his seal (palaceAccess: 'sealed'); otherwise your name
// on the Praetorians' list (palaceAccess: 'list'). Chapter VII reads this.

/** @type {import('../schema.js').Scene} */
export default {
  id: 'curia',
  chapter: 'senator',
  background: 'assets/backgrounds/curia.webp',
  character: 'senator',
  patience: [{ npc: 'senator', max: 3, fail: 'guards' }],
  start: 'arrive',

  nodes: {
    // ── Getting noticed ──────────────────────────────────────────────────────

    arrive: {
      character: null,
      narration: [
        'Back in the Forum, you wait outside the Curia, the Senate House. Its great bronze doors swing open and senators pour down the steps, their togas marked with broad purple stripes.',
        'One of them, silver-haired and dignified, is instantly surrounded by a crowd of petitioners. “Cornelius! Cornelius!”',
      ],
      variants: [
        {
          if: { visited: 'curia.arrive' },
          narration: 'Cornelius is still surrounded by petitioners, all waving and shouting.',
        },
      ],
      choices: [
        { action: 'Hold up Aurelius’s sealed letter', if: { hasItems: 'epistula' }, next: 'seal_seen' },
        { action: 'Push through the crowd', once: true, next: 'push' },
        { say: 'Senator! Senator!', once: true, next: 'shout' },
      ],
    },

    push: {
      character: null,
      narration: 'You elbow your way forward, trip over a senator’s toga, and land face-first on the marble steps. Several senators glare at you. Cornelius doesn’t even notice.',
      next: 'arrive',
    },

    shout: {
      character: null,
      narration: 'You shout “Senator!” There are about forty senators on these steps. A dozen of them turn around. None of them is Cornelius.',
      next: 'arrive',
    },

    seal_seen: {
      speaker: 'senator',
      narration: 'The silver-haired senator spots the red wax seal and raises a hand. The crowd parts.',
      latin: 'Signum Aurelii! Veni, peregrine.',
      translation: 'Aurelius’s seal! Come, stranger.',
      vocab: [['signum', 'seal'], ['Aurelii', 'of Aurelius'], ['veni', 'come!'], ['peregrine', 'stranger (speaking to someone)']],
      next: 'reads',
    },

    // Chapter V pays off here.
    reads: {
      speaker: 'senator',
      narration: 'He breaks the seal, reads the letter, and tucks it into the folds of his toga.',
      latin: 'Aurelius scripsit: “Hospes anulum meum invenit.” Nihil aliud.',
      translation: 'Aurelius wrote: “This stranger found my ring.” Nothing else.',
      vocab: [['scripsit', 'wrote (perfect)'], ['hospes', 'guest, stranger'], ['invenit', 'found'], ['nihil aliud', 'nothing else']],
      // He keeps the letter. (A variant's onEnter replaces this one, so it repeats removeItems.)
      onEnter: { removeItems: 'epistula' },
      variants: [
        {
          if: { choice: { letterTone: 'warm' } },
          narration: 'He breaks the seal and reads the letter. His eyebrows rise, and he tucks it carefully into the folds of his toga.',
          latin: 'Aurelius de te scripsit! “Fidelis et sapiens est,” scribit.',
          translation: 'Aurelius has written about you! “Loyal and wise,” he writes.',
          vocab: [['scripsit', 'wrote (perfect)'], ['de te', 'about you'], ['fidelis', 'loyal'], ['sapiens', 'wise'], ['scribit', 'he writes']],
          onEnter: { removeItems: 'epistula', trust: { senator: 1 } },
        },
      ],
      next: 'why',
    },

    // ── Question 1: why? ─────────────────────────────────────────────────────

    why: {
      speaker: 'senator',
      latin: 'Nunc dic mihi: cur imperatorem videre vis?',
      translation: 'Now tell me: why do you want to see the emperor?',
      vocab: [['dic mihi', 'tell me'], ['cur?', 'why?'], ['imperatorem', 'the emperor'], ['videre', 'to see']],
      choices: [
        { say: 'Machina mea fracta est.', next: 'machine' },
        { say: 'Fabros imperatoris peto.', effects: { trust: { senator: 1 } }, next: 'bold' },
        { say: 'Imperator amicus meus est.', once: true, strike: 'senator', next: 'not_friend' },
        { say: 'Imperium peto!', strike: 'senator', next: 'treason' },
      ],
    },

    machine: {
      speaker: 'senator',
      narration: 'You describe the time machine as best you can. He listens with a puzzled frown.',
      latin: 'Machina fracta? Mirum. Et quid ab imperatore petes?',
      translation: 'A broken machine? Strange. And what will you ask the emperor for?',
      vocab: [['mirum', 'strange, amazing'], ['ab imperatore', 'from the emperor'], ['petes', 'you will ask for (future)']],
      choices: [
        { say: 'Quinque fabros petam.', effects: { trust: { senator: 1 } }, next: 'good_answer' },
        { say: 'Pecuniam petam.', once: true, strike: 'senator', next: 'ask_money' },
        { say: 'Nihil petam.', once: true, strike: 'senator', next: 'ask_nothing' },
        { say: 'Palatium petam!', once: true, strike: 'senator', next: 'ask_palace' },
      ],
    },

    ask_money: {
      speaker: 'senator',
      latin: 'Pecuniam? Imperator peregrinis pecuniam non dat!',
      translation: 'Money? The emperor doesn’t give money to foreigners!',
      vocab: [['peregrinis', 'to foreigners'], ['dat', 'gives']],
      onEnter: { trust: { senator: -1 } },
      choicesFrom: 'machine',
    },

    ask_nothing: {
      speaker: 'senator',
      latin: 'Nihil? Cur ergo venis?',
      translation: 'Nothing? Then why are you coming?',
      vocab: [['nihil', 'nothing'], ['ergo', 'then, therefore']],
      choicesFrom: 'machine',
    },

    ask_palace: {
      speaker: 'senator',
      pose: 'amused',
      latin: 'Palatium? Ha! Imperator palatium suum amat!',
      translation: 'The palace? Ha! The emperor loves his palace!',
      vocab: [['palatium', 'palace'], ['suum', 'his (own)']],
      onEnter: { trust: { senator: -1 } },
      choicesFrom: 'machine',
    },

    bold: {
      speaker: 'senator',
      pose: 'amused',
      narration: 'He looks at you with new interest.',
      latin: 'Fabros imperatoris? Audax es! Quot fabros petes?',
      translation: 'The emperor’s smiths? You’re bold! How many smiths will you ask for?',
      vocab: [['imperatoris', 'of the emperor'], ['audax', 'bold'], ['quot?', 'how many?'], ['petes', 'you will ask for (future)']],
      choices: [
        { say: 'Quinque fabros petam.', effects: { trust: { senator: 1 } }, next: 'good_answer' },
        { say: 'Centum fabros petam!', once: true, strike: 'senator', next: 'hundred' },
        { say: 'Unum fabrum petam.', once: true, strike: 'senator', next: 'one' },
      ],
    },

    hundred: {
      speaker: 'senator',
      pose: 'amused',
      latin: 'Centum? Insanus es!',
      translation: 'A hundred? You’re crazy!',
      vocab: [['centum', 'a hundred'], ['insanus', 'crazy']],
      onEnter: { trust: { senator: -1 } },
      choicesFrom: 'bold',
    },

    one: {
      speaker: 'senator',
      latin: 'Unum? Satisne est unus?',
      translation: 'One? Is one enough?',
      vocab: [['unum / unus', 'one'], ['satisne est?', 'is it enough?']],
      choicesFrom: 'bold',
    },

    not_friend: {
      speaker: 'senator',
      pose: 'amused',
      latin: 'Amicus tuus? Ha! Imperator te non cognoscit!',
      translation: 'Your friend? Ha! The emperor wouldn’t even recognise you!',
      vocab: [['cognoscit', 'recognises, knows (a person)']],
      onEnter: { trust: { senator: -1 } },
      choicesFrom: 'why',
    },

    // The imperium / imperator trap.
    treason: {
      speaker: 'senator',
      pose: 'shocked',
      narration: 'The senators nearby fall silent. Someone drops a wax tablet.',
      latin: 'Imperium?! Proditor! Milites!',
      translation: 'Supreme power?! Traitor! Soldiers!',
      vocab: [['imperium', 'supreme power, command (not “the emperor”!)'], ['proditor', 'traitor'], ['milites', 'soldiers']],
      onEnter: { recordChoice: { jailedFrom: 'treason' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    // Out of patience: game over for today.
    guards: {
      speaker: 'senator',
      pose: 'shocked',
      narration: 'Cornelius has heard enough. He waves over two soldiers standing by the Senate doors.',
      latin: 'Satis! Audire nolo! Milites!',
      translation: 'Enough! I don’t want to hear any more! Soldiers!',
      vocab: [['satis', 'enough'], ['audire nolo', 'I don’t want to hear'], ['milites', 'soldiers']],
      onEnter: { recordChoice: { jailedFrom: 'curia' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    good_answer: {
      speaker: 'senator',
      narration: 'He nods slowly.',
      latin: 'Quinque fabros. Bene. Hoc intellego.',
      translation: 'Five smiths. Good. That I understand.',
      vocab: [['quinque', 'five'], ['intellego', 'I understand']],
      next: 'homeland',
    },

    // ── Question 2: where are you from? ──────────────────────────────────────

    homeland: {
      speaker: 'senator',
      latin: 'Et unde venis? Ex Graecia? Ex Italia? Ex insula?',
      translation: 'And where do you come from? From Greece? From Italy? From an island?',
      vocab: [['unde?', 'from where?'], ['venis', 'you come'], ['ex', 'from, out of'], ['Graecia', 'Greece'], ['Italia', 'Italy'], ['insula', 'island']],
      choices: [
        { say: 'Longe, longe…', next: 'far' },
        { say: 'In futuro!', next: 'prophet' },
        { say: 'Nescio.', strike: 'senator', next: 'dont_know' },
      ],
    },

    far: {
      speaker: 'senator',
      latin: 'Longe? Hmm… mirum.',
      translation: 'Far away? Hmm… strange.',
      vocab: [['longe', 'far away'], ['mirum', 'strange']],
      next: 'rehearsal',
    },

    dont_know: {
      speaker: 'senator',
      latin: 'Patriam tuam nescis? Mirum!',
      translation: 'You don’t know your own homeland? Strange!',
      vocab: [['nescis', 'you don’t know']],
      onEnter: { trust: { senator: -1 } },
      next: 'rehearsal',
    },

    // The prophecy mini-game: practising the future tense.
    prophet: {
      speaker: 'senator',
      pose: 'amused',
      narration: 'His eyes go wide. Romans take prophets very seriously.',
      latin: 'In futuro?! Vatesne es? Dic mihi: quid cras erit?',
      translation: 'In the future?! Are you a prophet? Tell me: what will happen tomorrow?',
      vocab: [['vates', 'prophet'], ['cras', 'tomorrow'], ['erit', 'will be (future)']],
      choices: [
        { say: 'Cras tempestas erit!', effects: { setFlags: 'predictedRain' }, next: 'rain' },
        { say: 'Cras imperatorem videbis!', effects: { trust: { senator: 1 } }, next: 'flatter' },
        { say: 'Cras cenabis!', next: 'dinner' },
      ],
    },

    rain: {
      speaker: 'senator',
      narration: 'He squints up at the cloudless sky.',
      latin: 'Tempestas? … Videbimus.',
      translation: 'A storm? … We shall see.',
      vocab: [['tempestas', 'storm'], ['erit', 'will be (future)'], ['videbimus', 'we shall see (future)']],
      next: 'rehearsal',
    },

    flatter: {
      speaker: 'senator',
      pose: 'amused',
      latin: 'Ego imperatorem semper video! … Sed bene dixisti.',
      translation: 'I see the emperor all the time! … But you put that nicely.',
      vocab: [['videbis', 'you will see (future)'], ['semper', 'always, all the time'], ['dixisti', 'you said (perfect)']],
      next: 'rehearsal',
    },

    dinner: {
      speaker: 'senator',
      pose: 'amused',
      narration: 'He stares at you, then roars with laughter.',
      latin: 'Cras cenabo? Ha! Hoc verum est! Vates optimus es!',
      translation: 'Tomorrow I will eat dinner? Ha! That’s true! You’re an excellent prophet!',
      vocab: [['cenabis / cenabo', 'you will / I will eat dinner (future)'], ['verum', 'true']],
      next: 'rehearsal',
    },

    // ── Rehearsal: how to address an emperor ─────────────────────────────────

    rehearsal: {
      speaker: 'senator',
      latin: 'Bene. Cras imperatorem videbis. Primum: quid imperatori dices?',
      translation: 'All right. Tomorrow you will see the emperor. First: what will you say to the emperor?',
      vocab: [['videbis', 'you will see (future)'], ['primum', 'first'], ['imperatori', 'to the emperor'], ['dices', 'you will say (future)']],
      variants: [
        {
          if: { visited: 'curia.rehearsal' },
          narration: 'He sighs and tries again.',
          latin: 'Iterum: quid imperatori dices?',
          translation: 'Again: what will you say to the emperor?',
          vocab: [['iterum', 'again'], ['imperatori', 'to the emperor'], ['dices', 'you will say (future)']],
        },
      ],
      choices: [
        { say: 'Ave, Imperator!', effects: { trust: { senator: 1 } }, next: 'ave' },
        { say: 'Salve, amice!', once: true, strike: 'senator', next: 'too_familiar' },
        { say: 'Heus tu!', once: true, strike: 'senator', next: 'hey_you' },
        { action: 'Bow very low and say nothing', once: true, strike: 'senator', next: 'silent' },
      ],
    },

    too_familiar: {
      speaker: 'senator',
      pose: 'shocked',
      latin: 'Amice?! Minime! Imperator amicus tuus non est!',
      translation: '“Friend”?! No way! The emperor is not your friend!',
      vocab: [['amice', 'friend (speaking to someone)']],
      onEnter: { trust: { senator: -1 } },
      next: 'rehearsal',
    },

    hey_you: {
      speaker: 'senator',
      pose: 'shocked',
      narration: 'He clutches his chest.',
      latin: 'Heus tu?! Di immortales!',
      translation: '“Hey, you”?! Immortal gods!',
      vocab: [['heus tu', 'hey, you!'], ['di immortales', 'immortal gods! (an exclamation)']],
      onEnter: { trust: { senator: -1 } },
      next: 'rehearsal',
    },

    silent: {
      speaker: 'senator',
      latin: 'Tacere non potes! Imperator responsum exspectat.',
      translation: 'You can’t stay silent! The emperor expects an answer.',
      vocab: [['tacere', 'to be silent'], ['potes', 'you can'], ['responsum', 'answer'], ['exspectat', 'expects, waits for']],
      next: 'rehearsal',
    },

    ave: {
      speaker: 'senator',
      pose: 'amused',
      narration: 'He smiles for the first time.',
      latin: 'Optime! “Ave, Imperator!” Sic imperatorem salutare debes.',
      translation: 'Excellent! “Hail, Emperor!” That is how you must greet the emperor.',
      vocab: [['ave', 'hail! (a formal greeting)'], ['sic', 'so, like that'], ['salutare', 'to greet'], ['debes', 'you must']],
      onEnter: { setFlags: 'knowsAve' },
      next: 'verdict',
    },

    // ── The verdict: how you get into the palace ─────────────────────────────

    verdict: {
      speaker: 'senator',
      latin: 'Bene. Cras ad Palatium veni. Nomen tuum Praetorianis dabo.',
      translation: 'All right. Come to the Palatine tomorrow. I will give your name to the Praetorians.',
      vocab: [['Palatium', 'the Palatine (the emperor’s palace)'], ['nomen tuum', 'your name'], ['Praetorianis', 'to the Praetorian Guard'], ['dabo', 'I will give (future)']],
      onEnter: { grantAuthorizations: 'senator-list', recordChoice: { palaceAccess: 'list' } },
      variants: [
        {
          if: { minTrust: { senator: 2 } },
          narration: 'He takes a wax tablet from his secretary, writes a few lines, and presses his own ring into the wax.',
          latin: 'Cras ad Palatium veni. Ecce, tabula cum signo meo. Praetoriani te intrare sinent.',
          translation: 'Come to the Palatine tomorrow. Here is a tablet with my seal. The Praetorians will let you in.',
          vocab: [['tabula', 'writing tablet'], ['cum signo meo', 'with my seal'], ['intrare', 'to enter'], ['sinent', 'they will allow (future)']],
          onEnter: {
            addItems: 'senator-tablet',
            grantAuthorizations: ['senator-list', 'senator-seal'],
            recordChoice: { palaceAccess: 'sealed' },
          },
        },
      ],
      continueText: 'Thank him and leave',
      next: 'end',
    },

    // ── End of Chapter VI ────────────────────────────────────────────────────

    end: {
      character: null,
      ending: {
        id: 'chapter-6-complete',
        type: 'chapter',
        title: 'Finis Capituli VI',
        subtitle: 'End of Chapter VI',
        text: [
          'Cornelius sweeps off down the steps, his petitioners trailing behind him.',
          'Tomorrow: the Palatine Hill, the Praetorian Guard, and at last, the emperor. You practise under your breath all the way back through the Forum: “Ave, Imperator… Ave, Imperator…”',
        ],
        next: { scene: 'palatium' },
      },
      variants: [
        {
          if: { flags: 'predictedRain' },
          ending: {
            id: 'chapter-6-complete',
            type: 'chapter',
            title: 'Finis Capituli VI',
            subtitle: 'End of Chapter VI',
            text: [
              'Cornelius sweeps off down the steps, his petitioners trailing behind him.',
              'Tomorrow: the Palatine Hill, the Praetorian Guard, and at last, the emperor. You practise under your breath all the way back through the Forum: “Ave, Imperator… Ave, Imperator…”',
              'Above the city, for the first time all week, dark storm clouds are gathering.',
            ],
            next: { scene: 'palatium' },
          },
        },
      ],
    },
  },
};
