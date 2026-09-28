// SCENE 7: AURELIUS'S ATRIUM (Chapter V, part 2 of 3)
// New Latin: the IMPERFECT tense ("was ___ing", "used to"), introduced through
// witnesses describing yesterday: habebam, sedebam, eram, laborabam, sedebat,
// ponebat, volabat, edebat, cantabat, ridebat, ibat. Always glossed in the hint.
// Also dative pronouns in set phrases: tibi (to you), gratias tibi ago.
//
// The favour: Aurelius has lost his signet ring, and without it he can't seal
// letters, so he can't help anyone. Witnesses point to the garden and the magpie
// (the garden is scene 08-domus-garden.js).
//
// PATIENCE: 3 wrong accusations and Aurelius decides YOU took the ring: prison, game
// over for today. Strikes: "Coquus anulum habet!", "Syra anulum habet!", and
// "Anulus in balneis erat!" (Syra's clue says he went to the baths WITHOUT it).
//
// The dilemma, when you hand over the ring ("Quis eum habebat?"):
//   "Pica anulum habebat!"     the truth: +1, and Syra is cleared (helped: maid), but the
//                              letter to the senator is a plain one
//   "Ego anulum inveni!"       take the credit: +2, a warm letter, but the cook blames Syra;
//                              own up (−1, plain letter, Syra cleared) or say nothing
//                              (syraBlamed: she's punished, and the chapter card says so)
//
// Aurelius trust: +1 the truth about the magpie or +2 taking the credit, −1 owning up
// afterwards, −1 accusing the cook, −1 asking for money.
// Trust 2+ gets a warmer letter to the senator (letterTone: 'warm'). In Chapter VI that's
// +1 with Cornelius, which makes his sealed tablet (and his help in Chapter VIII) easier.

/** @type {import('../schema.js').Scene} */
export default {
  id: 'domus-atrium',
  chapter: 'patron',
  background: 'assets/backgrounds/atrium.webp',
  character: 'aurelius',
  patience: [{ npc: 'aurelius', max: 3, fail: 'accused' }],
  start: 'meet',

  nodes: {
    // ── Meeting Aurelius ─────────────────────────────────────────────────────

    meet: {
      speaker: 'aurelius',
      narration: 'In the cool, dim atrium, a man in a fine toga paces back and forth, tugging at his hair.',
      latin: 'Quis es? Non nunc! Tristis sum! Heri anulum meum habebam. Nunc non habeo!',
      translation: 'Who are you? Not now! I’m miserable! Yesterday I had my ring. Now I don’t!',
      vocab: [['tristis', 'sad, miserable'], ['heri', 'yesterday'], ['anulum', 'ring (a signet ring for sealing letters)'], ['habebam', 'I had (imperfect)']],
      variants: [
        {
          if: { choice: { enteredDomusBy: 'salutatio' } },
          narration: 'Aurelius barely looks at his clients. When he reaches you, he frowns.',
        },
      ],
      choices: [
        { say: 'Anulum tuum quaero!', next: 'quest' },
        { say: 'Titum volo.', once: true, next: 'want_titus' },
        { say: 'Ubi erat anulus?', once: true, next: 'where_was' },
      ],
    },

    want_titus: {
      speaker: 'aurelius',
      narration: 'He waves at a pile of letters on a table. None of them are sealed.',
      latin: 'Titum? Sine anulo, nihil facio!',
      translation: 'Titus? Without my ring, I do nothing!',
      vocab: [['sine anulo', 'without my ring'], ['nihil', 'nothing'], ['facio', 'I do']],
      choicesFrom: 'meet',
    },

    where_was: {
      speaker: 'aurelius',
      latin: 'Nescio! Heri in horto sedebam. Tum in balneis eram. Tum… nihil!',
      translation: 'I don’t know! Yesterday I was sitting in the garden. Then I was at the baths. Then… nothing!',
      vocab: [['sedebam', 'I was sitting (imperfect)'], ['in horto', 'in the garden'], ['in balneis', 'at the baths'], ['eram', 'I was (imperfect)'], ['tum', 'then']],
      choicesFrom: 'meet',
    },

    quest: {
      speaker: 'aurelius',
      narration: 'He stops pacing and looks at you properly for the first time.',
      latin: 'Tu? … Bene! Si anulum invenis, ego tibi auxilium do.',
      translation: 'You? … All right! If you find the ring, I will help you.',
      vocab: [['si', 'if'], ['invenis', 'you find'], ['tibi', 'to you'], ['auxilium', 'help'], ['do', 'I give']],
      next: 'hub',
    },

    // ── The house (hub) ──────────────────────────────────────────────────────

    hub: {
      character: null,
      narration: 'The house is enormous: a kitchen full of steam, a young servant dusting statues, and beyond the atrium, a garden full of sunlight.',
      variants: [{ if: { visited: 'domus-atrium.hub' }, narration: 'Aurelius is still pacing in the atrium, muttering to himself.' }],
      choices: [
        { action: 'Talk to the cook', next: 'cook' },
        { action: 'Talk to the servant dusting statues', next: 'maid' },
        { action: 'Search the garden', next: { scene: 'domus-garden' } },
        { action: 'Go back to Aurelius', next: 'report' },
      ],
    },

    // ── Witnesses (imperfect tense) ──────────────────────────────────────────

    cook: {
      character: 'cook',
      speaker: 'cook',
      narration: 'The cook bursts out of the kitchen, sweaty and furious, waving a wooden spoon.',
      latin: 'Anulus? Ego in culina laborabam! Dominus in culina non erat!',
      translation: 'The ring? I was working in the kitchen! The master wasn’t in the kitchen!',
      vocab: [['culina', 'kitchen'], ['laborabam', 'I was working (imperfect)'], ['erat', 'was (imperfect)']],
      variants: [
        {
          if: { visited: 'domus-atrium.cook' },
          latin: 'Iterum? Laboro! Pica mala est!',
          translation: 'Again? I’m working! That magpie is a menace!',
          vocab: [['iterum', 'again'], ['pica', 'magpie'], ['mala', 'bad']],
          next: 'hub',
        },
      ],
      next: 'cook_2',
    },

    cook_2: {
      character: 'cook',
      speaker: 'cook',
      latin: 'Sed pica in culina volabat… et mel meum edebat!',
      translation: 'But the magpie was flying around the kitchen… and eating my honey!',
      vocab: [['pica', 'magpie'], ['volabat', 'was flying (imperfect)'], ['mel', 'honey'], ['edebat', 'was eating (imperfect)']],
      onEnter: { setFlags: 'suspectMagpie' },
      next: 'hub',
    },

    maid: {
      character: 'maid',
      speaker: 'maid',
      narration: 'A young servant is dusting a marble statue of Aurelius’s grandfather. She glances around, then whispers.',
      latin: 'Heri dominus in horto sedebat. Anulum in mensa ponebat.',
      translation: 'Yesterday the master was sitting in the garden. He was putting his ring on the table.',
      vocab: [['sedebat', 'was sitting (imperfect)'], ['in mensa', 'on the table'], ['ponebat', 'was putting (imperfect)']],
      variants: [
        {
          if: { visited: 'domus-atrium.maid' },
          latin: 'Anulus in horto erat, non in balneis!',
          translation: 'The ring was in the garden, not at the baths!',
          vocab: [['erat', 'was (imperfect)'], ['in horto', 'in the garden']],
          next: 'hub',
        },
      ],
      next: 'maid_2',
    },

    maid_2: {
      character: 'maid',
      speaker: 'maid',
      latin: 'Pica cantabat, et dominus ridebat. Tum dominus ad balnea ibat… sine anulo!',
      translation: 'The magpie was singing, and the master was laughing. Then the master went off to the baths… without his ring!',
      vocab: [['cantabat', 'was singing (imperfect)'], ['ridebat', 'was laughing (imperfect)'], ['ibat', 'was going (imperfect)'], ['sine anulo', 'without the ring']],
      onEnter: { setFlags: 'ringInGarden' },
      next: 'hub',
    },

    // ── Reporting back ───────────────────────────────────────────────────────

    report: {
      speaker: 'aurelius',
      latin: 'Anulum invenisti?',
      translation: 'Did you find the ring?',
      vocab: [['invenisti', 'you found (perfect tense)']],
      choices: [
        { action: 'Give him the ring', if: { hasItems: 'anulus' }, effects: { removeItems: 'anulus' }, next: 'delighted' },
        { say: 'Coquus anulum habet!', meaning: 'The cook has the ring!', if: { lacksItems: 'anulus' }, once: true, strike: 'aurelius', next: 'accuse_cook' },
        { say: 'Syra anulum habet!', meaning: 'Syra has the ring!', if: { lacksItems: 'anulus' }, once: true, strike: 'aurelius', next: 'accuse_syra' },
        { say: 'Anulus in balneis erat!', meaning: 'The ring was in the baths!', if: { lacksItems: 'anulus' }, once: true, strike: 'aurelius', next: 'wrong_baths' },
        { say: 'Pica anulum habet!', if: { lacksItems: 'anulus', flags: 'suspectMagpie' }, once: true, next: 'accuse_magpie' },
        { say: 'Nondum.', if: { lacksItems: 'anulus' }, next: 'not_yet' },
      ],
    },

    accuse_cook: {
      speaker: 'aurelius',
      narration: 'From the kitchen comes a furious crash of pots.',
      latin: 'Coquus? Minime! Coquus meus est optimus!',
      translation: 'The cook? No way! My cook is the best!',
      vocab: [['coquus', 'cook'], ['optimus', 'the best']],
      onEnter: { trust: { aurelius: -1 } },
      next: 'hub',
    },

    accuse_syra: {
      speaker: 'aurelius',
      narration: 'Across the atrium, Syra drops her dusting cloth.',
      latin: 'Syra? Minime! Syra fidelis est. Semper laborat!',
      translation: 'Syra? No! Syra is loyal. She is always working!',
      vocab: [['fidelis', 'loyal'], ['semper', 'always'], ['laborat', 'works']],
      onEnter: { trust: { aurelius: -1 } },
      next: 'hub',
    },

    wrong_baths: {
      speaker: 'aurelius',
      narration: 'He frowns at you.',
      latin: 'In balneis? Ego in balneis eram, sed anulum non habebam!',
      translation: 'At the baths? I was at the baths, but I didn’t have the ring!',
      vocab: [['in balneis', 'at the baths'], ['eram', 'I was (imperfect)'], ['habebam', 'I had (imperfect)']],
      next: 'hub',
    },

    // Out of patience: game over for today.
    accused: {
      speaker: 'aurelius',
      narration: 'Aurelius’s face darkens. He looks at you for a long moment, then at his servants.',
      latin: 'Satis! Tibi credere nolo. Fortasse TU anulum habebas! Milites!',
      translation: 'Enough! I refuse to believe you. Maybe YOU had the ring! Soldiers!',
      vocab: [['satis', 'enough'], ['credere nolo', 'I don’t want to believe, I refuse to believe'], ['habebas', 'you had (imperfect)'], ['milites', 'soldiers']],
      onEnter: { recordChoice: { jailedFrom: 'domus' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    accuse_magpie: {
      speaker: 'aurelius',
      narration: 'He blinks. Then he looks toward the garden.',
      latin: 'Pica? … Fortasse. I, quaere!',
      translation: 'The magpie? … Maybe. Go, look!',
      vocab: [['fortasse', 'maybe'], ['i', 'go!'], ['quaere', 'search!']],
      next: 'hub',
    },

    not_yet: {
      speaker: 'aurelius',
      latin: 'Nondum? Quaere!',
      translation: 'Not yet? Keep looking!',
      vocab: [['nondum', 'not yet'], ['quaere', 'search!']],
      next: 'hub',
    },

    delighted: {
      speaker: 'aurelius',
      pose: 'delighted',
      narration: [
        'Aurelius snatches the ring and slides it onto his finger. Then he looks at you sharply.',
        'You can see him thinking: whoever found this ring deserves a very good letter to the senator.',
      ],
      latin: 'Anulus meus! Gratias tibi ago! Sed… quis eum habebat?',
      translation: 'My ring! Thank you! But… who had it?',
      vocab: [['gratias tibi ago', 'I thank you (literally, “I give thanks to you”)'], ['eum', 'it (the ring)'], ['habebat', 'had (imperfect)']],
      choices: [
        { say: 'Pica anulum habebat!', effects: { trust: { aurelius: 1 } }, next: 'explained' },
        { say: 'Ego anulum inveni! Difficile erat!', effects: { trust: { aurelius: 2 } }, next: 'credit' },
      ],
    },

    // The truth: the magpie. It clears Syra.
    explained: {
      speaker: 'aurelius',
      pose: 'delighted',
      narration: 'You explain about the magpie. Aurelius stares at you, then bursts out laughing.',
      latin: 'Pica?! Pica mea anulum habebat? Ha! Et Syra innocens est!',
      translation: 'The magpie?! My magpie had the ring? Ha! So Syra is innocent!',
      vocab: [['habebat', 'had, was keeping (imperfect)'], ['innocens', 'innocent']],
      next: 'syra_thanks',
    },

    syra_thanks: {
      character: 'maid',
      speaker: 'maid',
      narration: 'Across the atrium, Syra catches your eye.',
      latin: 'Gratias tibi ago!',
      translation: 'Thank you!',
      vocab: [['gratias tibi ago', 'I thank you']],
      onEnter: { helped: 'maid' },
      next: 'reward',
    },

    // The dilemma: take the credit (a warmer letter), and Syra takes the blame.
    credit: {
      speaker: 'aurelius',
      pose: 'delighted',
      narration: 'Aurelius beams at you.',
      latin: 'Tu anulum invenisti? Fidelis et sapiens es!',
      translation: 'You found the ring? You’re loyal and wise!',
      vocab: [['invenisti', 'you found (perfect)'], ['fidelis', 'loyal'], ['sapiens', 'wise']],
      next: 'cook_mutters',
    },

    cook_mutters: {
      character: 'cook',
      speaker: 'cook',
      narration: 'From the kitchen doorway, the cook mutters, just loud enough:',
      latin: 'Hmm… sed quis anulum ceperat? Syra heri in horto erat…',
      translation: 'Hmm… but who had taken the ring? Syra was in the garden yesterday…',
      vocab: [['ceperat', 'had taken (pluperfect)'], ['heri', 'yesterday'], ['in horto', 'in the garden']],
      next: 'syra_suspected',
    },

    syra_suspected: {
      speaker: 'aurelius',
      narration: 'Aurelius’s smile fades. He turns to Syra, who has gone pale. She looks at you.',
      latin: 'Syra? … Syra, veni huc!',
      translation: 'Syra? … Syra, come here!',
      vocab: [['veni huc', 'come here!']],
      choices: [
        { say: 'Syra innocens est! Pica anulum habebat.', effects: { trust: { aurelius: -1 } }, next: 'owned_up' },
        { action: 'Say nothing', next: 'syra_blamed' },
      ],
    },

    owned_up: {
      speaker: 'aurelius',
      narration: 'Aurelius stares at you. Then, slowly, he starts to laugh.',
      latin: 'Pica?! … Ha! Pica mea! Bene: verum dixisti, tandem.',
      translation: 'The magpie?! … Ha! My magpie! Good: you told the truth, at last.',
      vocab: [['verum', 'the truth'], ['dixisti', 'you said, you told (perfect)'], ['tandem', 'at last']],
      next: 'syra_thanks',
    },

    syra_blamed: {
      speaker: 'aurelius',
      narration: 'You say nothing. Syra drops her dusting cloth and walks slowly toward the kitchen. She doesn’t look at you.',
      latin: 'Syra, hodie in culina cum coquo laborabis!',
      translation: 'Syra, today you will work in the kitchen with the cook!',
      vocab: [['hodie', 'today'], ['in culina', 'in the kitchen'], ['cum coquo', 'with the cook'], ['laborabis', 'you will work (future)']],
      onEnter: { setFlags: 'syraBlamed' },
      next: 'reward',
    },

    // ── The reward ───────────────────────────────────────────────────────────

    reward: {
      speaker: 'aurelius',
      pose: 'delighted',
      latin: 'Nunc: quid vis? Pete!',
      translation: 'Now: what do you want? Ask!',
      vocab: [['nunc', 'now'], ['pete', 'ask!']],
      choices: [
        { say: 'Titum volo… et quinque fabros.', next: 'smiths' },
        { say: 'Pecuniam volo!', once: true, next: 'greedy' },
        { say: 'Epistulam ad imperatorem volo!', once: true, next: 'emperor_letter' },
      ],
    },

    greedy: {
      speaker: 'aurelius',
      narration: 'He raises an eyebrow and tosses you a small purse.',
      latin: 'Pecuniam? Ecce. Et quid aliud?',
      translation: 'Money? Here. And what else?',
      vocab: [['quid aliud?', 'what else?']],
      onEnter: { addItems: 'denarii', trust: { aurelius: -1 } },
      choicesFrom: 'reward',
    },

    emperor_letter: {
      speaker: 'aurelius',
      pose: 'delighted',
      latin: 'Ad imperatorem? Ha! Imperator me non cognoscit!',
      translation: 'To the emperor? Ha! The emperor wouldn’t even recognise me!',
      vocab: [['ad imperatorem', 'to the emperor'], ['cognoscit', 'recognises, knows (a person)']],
      choicesFrom: 'reward',
    },

    smiths: {
      speaker: 'aurelius',
      latin: 'Titum tibi do! Sed quinque fabri… Fabri optimi pro imperatore laborant.',
      translation: 'I give you Titus! But five smiths… The best smiths work for the emperor.',
      vocab: [['tibi do', 'I give (to) you'], ['optimi', 'the best'], ['pro imperatore', 'for the emperor']],
      onEnter: { setFlags: 'titusFreed' },
      next: 'senator_idea',
    },

    senator_idea: {
      speaker: 'aurelius',
      narration: 'He taps his chin, thinking.',
      latin: 'Ego imperatorem non video. Sed senator Cornelius imperatorem semper videt! Epistulam scribo.',
      translation: 'I don’t see the emperor. But Senator Cornelius sees the emperor all the time! I’ll write a letter.',
      vocab: [['semper', 'always, all the time'], ['epistulam', 'letter'], ['scribo', 'I write']],
      next: 'letter',
    },

    letter: {
      speaker: 'aurelius',
      narration: 'He writes quickly on a sheet of papyrus, rolls it up, and presses his ring into a blob of hot wax to seal it.',
      latin: 'Ecce, epistula ad Cornelium. Signum meum habet. Cornelius eam leget.',
      translation: 'Here is a letter to Cornelius. It has my seal. Cornelius will read it.',
      vocab: [['epistula', 'letter'], ['signum', 'seal, mark'], ['eam', 'it (the letter)'], ['leget', 'will read (future)']],
      onEnter: { addItems: 'epistula', grantAuthorizations: 'aurelius-letter', recordChoice: { letterTone: 'plain' } },
      variants: [
        {
          if: { minTrust: { aurelius: 2 } },
          narration: 'He writes quickly on a sheet of papyrus, pauses, smiles, and adds a few more lines about you. Then he rolls it up and presses his ring into a blob of hot wax to seal it.',
          onEnter: { addItems: 'epistula', grantAuthorizations: 'aurelius-letter', recordChoice: { letterTone: 'warm' } },
        },
      ],
      next: 'end',
    },

    // ── End of Chapter V ─────────────────────────────────────────────────────

    end: {
      character: null,
      ending: {
        id: 'chapter-5-complete',
        type: 'chapter',
        title: 'Finis Capituli V',
        subtitle: 'End of Chapter V',
        text: [
          'You step out into the evening with a sealed letter in your bag. Aurelius has promised you Titus, but five smiths need an order from someone far more powerful.',
          'Senator Cornelius sees the emperor every day. Tomorrow, you will see Senator Cornelius.',
        ],
        next: { scene: 'curia' },
      },
      variants: [
        {
          if: { flags: 'syraBlamed' },
          ending: {
            id: 'chapter-5-complete',
            type: 'chapter',
            title: 'Finis Capituli V',
            subtitle: 'End of Chapter V',
            text: [
              'You step out into the evening with a sealed letter in your bag. Aurelius has promised you Titus, but five smiths need an order from someone far more powerful.',
              'As the door closes behind you, you hear a clatter of pots from the kitchen, and the cook shouting at Syra.',
              'Senator Cornelius sees the emperor every day. Tomorrow, you will see Senator Cornelius.',
            ],
            next: { scene: 'curia' },
          },
        },
      ],
    },
  },
};
