// SCENE 11: THE THRONE ROOM (Chapter VIII)
// The hardest Latin in the game: all tenses together (present, imperfect, perfect,
// future), a future-tense conditional (si … dabo, quid … dabis?), a first ut + subjunctive
// (ut machinam reficiant), a deliberative subjunctive (cur tibi credam?), numquam + perfect,
// a future passive (memorabitur), and the locative Romae. Everything is glossed.
//
// The emperor is Trajan (reigned 98–117 AD), famous as a builder. Trajan's Column
// really does still stand in Rome.
//
// PATIENCE: only 2 strikes with an emperor. Out of patience: "Ad leones!", the
// Colosseum (14-arena.js), game over for today. Strikes: any rude greeting (even a
// plain "Salve!"), "Canis sum", "Nihil accidit", offering money, "Nihil habeo", asking him
// to come to the future too early, and the wrong sentences at "Cur tibi credam?".
// "Heus tu!" goes straight to the lions.
//
// Emperor favour ("emperor" trust):
//   greeting      "Ave, Imperator!" +2, "Salve!" 0, "Salve, amice!" −1, silent bow −1,
//                 "Heus tu!" → thrown out (comic ending)
//   storm prophet +1 (predictedRain in Chapter VI)
//   what happened +1 correct, 0 "Canis sum", −1 "Nihil accidit"
//   the hinge     +1
//   what will you give me?  +2 story of the future, +1 the hinge as a gift, 0 thanks,
//                 −1 money, −1 nothing
// Favour 4+ → he agrees at once. Otherwise "Cur tibi credam?": Cornelius vouches (if you
// have his sealed tablet), or you must pick the right Latin sentence.
//
// Endings: success → the finale (12-finale.js); "Aurum volo!" (rich but stranded);
// "Romae manere volo." (Roman citizen, a happy alternative); "Veni mecum in futurum!"
// (Trajan comes with you, if favour is 4+); the lions (14-arena.js).

/** @type {import('../schema.js').Scene} */
export default {
  id: 'aula',
  chapter: 'emperor',
  background: 'assets/backgrounds/aula.webp',
  character: 'emperor',
  patience: [{ npc: 'emperor', max: 2, fail: 'ad_leones' }],
  start: 'enter',

  nodes: {
    // ── Entering the hall ────────────────────────────────────────────────────

    enter: {
      character: null,
      narration: [
        'The throne room is enormous: coloured marble, gilded ceilings, and purple curtains taller than houses. Courtiers whisper along the walls.',
        'At the far end, in front of a raised throne, stands a broad-shouldered man with short grey hair and a soldier’s face: Trajan, Emperor of Rome.',
      ],
      variants: [
        {
          if: { choice: { palaceAccess: 'sealed' } },
          narration: [
            'The throne room is enormous: coloured marble, gilded ceilings, and purple curtains taller than houses. Courtiers whisper along the walls. Among them you spot Senator Cornelius, who gives you a tiny nod.',
            'At the far end, in front of a raised throne, stands a broad-shouldered man with short grey hair and a soldier’s face: Trajan, Emperor of Rome.',
          ],
        },
      ],
      continueText: 'Walk toward the throne',
      next: 'greeting',
    },

    greeting: {
      character: null,
      narration: 'The whole hall falls silent. Every eye is on you. This is the moment Cornelius warned you about.',
      choices: [
        { say: 'Ave, Imperator!', effects: { trust: { emperor: 2 } }, next: 'greeted' },
        { say: 'Salve!', meaning: 'Hello!', strike: 'emperor', next: 'plain_salve' },
        { say: 'Salve, amice!', meaning: 'Hello, friend!', effects: { trust: { emperor: -1 } }, strike: 'emperor', next: 'too_familiar' },
        { action: 'Bow low and say nothing', effects: { trust: { emperor: -1 } }, strike: 'emperor', next: 'silent' },
        { say: 'Heus tu!', meaning: 'Hey, you!', strike: 'emperor', next: 'hey_you' },
      ],
    },

    greeted: {
      speaker: 'emperor',
      narration: 'You bend your knee. A murmur of approval runs through the courtiers.',
      latin: 'Surge, peregrine.',
      translation: 'Rise, stranger.',
      vocab: [['surge', 'rise!, stand up!'], ['peregrine', 'stranger (speaking to someone)']],
      next: 'prophet_check',
    },

    plain_salve: {
      speaker: 'emperor',
      narration: 'A few courtiers raise their eyebrows. “Salve” is what you say to a neighbour.',
      latin: 'Salve… peregrine.',
      translation: 'Hello… stranger.',
      vocab: [['salve', 'hello (informal)'], ['peregrine', 'stranger']],
      next: 'prophet_check',
    },

    too_familiar: {
      speaker: 'emperor',
      pose: 'stern',
      narration: 'The courtiers gasp. Somewhere, Cornelius puts his head in his hands.',
      latin: 'Amice? … Hmm. Audax es.',
      translation: '“Friend”? … Hmm. You’re bold.',
      vocab: [['amice', 'friend (speaking to someone)'], ['audax', 'bold, cheeky']],
      next: 'prophet_check',
    },

    silent: {
      speaker: 'emperor',
      narration: 'You bow very low and stay there. The silence goes on for a long, long time.',
      latin: 'Tacesne? Lingua tua ubi est?',
      translation: 'You say nothing? Where is your tongue?',
      vocab: [['taces', 'you are silent'], ['lingua', 'tongue, language']],
      next: 'prophet_check',
    },

    hey_you: {
      speaker: 'emperor',
      pose: 'stern',
      narration: 'Nobody breathes. The emperor slowly raises one finger, and two Praetorians step forward.',
      latin: 'Heus tu? … Ad leones!',
      translation: '“Hey, you”? … To the lions!',
      vocab: [['heus tu', 'hey, you!'], ['ad leones', 'to the lions']],
      continueText: 'Get dragged away',
      next: { scene: 'arena' },
    },


    // Chapter VI pays off: the storm prophecy.
    prophet_check: {
      skipIf: { notFlags: 'predictedRain' },
      speaker: 'emperor',
      pose: 'curious',
      narration: 'The emperor leans forward.',
      latin: 'Tu es vates qui tempestatem praedixit? Cornelius mihi narravit!',
      translation: 'Are you the prophet who predicted the storm? Cornelius told me!',
      vocab: [['vates', 'prophet'], ['qui', 'who'], ['tempestatem', 'storm'], ['praedixit', 'predicted (perfect)'], ['narravit', 'told (perfect)']],
      onEnter: { trust: { emperor: 1 } },
      next: 'what_happened',
    },

    // ── What happened to you? (perfect tense) ────────────────────────────────

    what_happened: {
      speaker: 'emperor',
      latin: 'Cornelius mihi de te narravit. Fabulam tuam audire volo: quid tibi accidit?',
      translation: 'Cornelius has told me about you. I want to hear your story: what happened to you?',
      vocab: [['narravit', 'told (perfect)'], ['de te', 'about you'], ['fabulam', 'story'], ['audire', 'to hear'], ['accidit', 'happened (perfect)']],
      choices: [
        { say: 'Machina mea fracta est, et Romam veni.', effects: { trust: { emperor: 1 } }, next: 'tell_story' },
        { say: 'Canis sum.', meaning: 'I am a dog.', strike: 'emperor', next: 'dog_finale' },
        { say: 'Nihil accidit.', meaning: 'Nothing happened.', effects: { trust: { emperor: -1 } }, strike: 'emperor', next: 'nothing_happened' },
      ],
    },

    tell_story: {
      speaker: 'emperor',
      pose: 'curious',
      narration: 'You tell him everything: the broken door, the farmer, the gate, the smith. He listens without interrupting once.',
      latin: 'Machina? Monstra mihi!',
      translation: 'A machine? Show me!',
      vocab: [['fracta est', 'broke, was broken (perfect)'], ['veni', 'I came (perfect)'], ['monstra', 'show!']],
      choices: [
        { action: 'Show him the broken hinge', if: { hasItems: 'broken-hinge' }, next: 'hinge' },
        { say: 'Machina extra urbem est.', next: 'outside' },
      ],
    },

    // The running joke's finale.
    dog_finale: {
      speaker: 'emperor',
      pose: 'laughing',
      narration: 'There is a stunned silence. Then the Emperor of Rome laughs so hard he has to wipe his eyes.',
      latin: 'Canis?! Ha! Mirum! Cornelius hoc non dixit!',
      translation: 'A dog?! Ha! Amazing! Cornelius didn’t mention that!',
      vocab: [['mirum', 'amazing, strange'], ['dixit', 'said (perfect)']],
      choices: [{ say: 'Machina mea fracta est, et Romam veni.', effects: { trust: { emperor: 1 } }, next: 'tell_story' }],
    },

    nothing_happened: {
      speaker: 'emperor',
      pose: 'stern',
      latin: 'Nihil? Cur ergo hic es?',
      translation: 'Nothing? Then why are you here?',
      vocab: [['ergo', 'then, therefore']],
      choices: [{ say: 'Machina mea fracta est, et Romam veni.', next: 'tell_story' }],
    },

    hinge: {
      speaker: 'emperor',
      pose: 'curious',
      narration: 'A servant carries the hinge up to the emperor. He turns it over and over, and holds it up to the light, just as Titus did.',
      latin: 'Hoc metallum numquam vidi!',
      translation: 'I have never seen this metal!',
      vocab: [['metallum', 'metal'], ['numquam', 'never'], ['vidi', 'I have seen (perfect)']],
      onEnter: { trust: { emperor: 1 } },
      next: 'bargain',
    },

    outside: {
      speaker: 'emperor',
      latin: 'Extra urbem? Hmm…',
      translation: 'Outside the city? Hmm…',
      next: 'bargain',
    },

    // ── What will you give me? (future tense) ────────────────────────────────

    bargain: {
      speaker: 'emperor',
      narration: 'He folds his arms and studies you.',
      latin: 'Si fabros tibi dabo, quid mihi dabis?',
      translation: 'If I give you smiths, what will you give me?',
      vocab: [['si', 'if'], ['dabo', 'I will give (future)'], ['dabis', 'you will give (future)']],
      choices: [
        { say: 'Fabulam futuri tibi narrabo!', effects: { trust: { emperor: 2 } }, next: 'future_story' },
        {
          say: 'Cardinem meum tibi dabo.',
          if: { hasItems: 'broken-hinge' },
          effects: { trust: { emperor: 1 }, recordChoice: { giftToEmperor: 'hinge' } },
          next: 'gift_hinge',
        },
        { say: 'Gratias maximas tibi agam!', next: 'thanks' },
        { say: 'Pecuniam tibi dabo!', meaning: 'I will give you money!', if: { hasItems: 'denarii' }, effects: { trust: { emperor: -1 } }, strike: 'emperor', next: 'money' },
        { say: 'Nihil habeo.', meaning: 'I have nothing.', effects: { trust: { emperor: -1 } }, strike: 'emperor', next: 'nothing' },
      ],
    },

    future_story: {
      speaker: 'emperor',
      pose: 'curious',
      narration: 'The courtiers go very quiet.',
      latin: 'Futuri? … Narra!',
      translation: 'Of the future? … Tell me!',
      vocab: [['futuri', 'of the future'], ['narrabo', 'I will tell (future)'], ['narra', 'tell!']],
      choices: [
        { say: 'Nomen tuum semper memorabitur. Columna tua etiam post duo milia annorum stabit!', next: 'column' },
      ],
    },

    // True: Trajan's Column (completed 113 AD) still stands in Rome.
    column: {
      speaker: 'emperor',
      pose: 'laughing',
      narration: 'The emperor stares at you. Then a slow, delighted smile spreads across his face.',
      latin: 'Duo milia annorum?! … Optime!',
      translation: 'Two thousand years?! … Excellent!',
      vocab: [['memorabitur', 'will be spoken of, remembered (future passive)'], ['columna', 'column'], ['post duo milia annorum', 'after two thousand years'], ['stabit', 'will stand (future)']],
      onEnter: { setFlags: 'toldColumn' },
      next: 'request',
    },

    gift_hinge: {
      speaker: 'emperor',
      pose: 'curious',
      latin: 'Donum mirum! Gratias.',
      translation: 'A marvellous gift! Thank you.',
      vocab: [['donum', 'gift'], ['mirum', 'marvellous, strange']],
      next: 'request',
    },

    thanks: {
      speaker: 'emperor',
      latin: 'Gratias? Hmm. Parum est.',
      translation: 'Thanks? Hmm. That’s not much.',
      vocab: [['agam', 'I will give (future of ago)'], ['parum', 'too little']],
      next: 'request',
    },

    money: {
      speaker: 'emperor',
      pose: 'laughing',
      latin: 'Mihi? Pecuniam? Ha! Omnis pecunia Romae mea est!',
      translation: 'To me? Money? Ha! All the money in Rome is mine!',
      vocab: [['omnis', 'all'], ['Romae', 'in Rome']],
      next: 'request',
    },

    nothing: {
      speaker: 'emperor',
      pose: 'stern',
      latin: 'Nihil? Hmm.',
      translation: 'Nothing? Hmm.',
      next: 'request',
    },

    // ── The request ──────────────────────────────────────────────────────────

    request: {
      speaker: 'emperor',
      latin: 'Bene. Nunc: quid vis? Dic clare!',
      translation: 'All right. Now: what do you want? Say it clearly!',
      vocab: [['dic', 'say!'], ['clare', 'clearly']],
      choices: [
        { say: 'Quinque fabros volo, ut machinam reficiant.', next: 'decision' },
        { say: 'Aurum volo!', next: 'gold' },
        { say: 'Romae manere volo.', next: 'stay' },
        // Only welcome once he likes you; before that it's a strike.
        { say: 'Veni mecum in futurum!', if: { minTrust: { emperor: 4 } }, once: true, next: 'come_with_me' },
        { say: 'Veni mecum in futurum!', meaning: 'Come with me into the future!', if: { maxTrust: { emperor: 3 } }, once: true, strike: 'emperor', next: 'come_with_me' },
      ],
    },

    decision: {
      speaker: 'emperor',
      narration: 'The hall waits.',
      latin: 'Quinque fabros… Cur tibi credam?',
      translation: 'Five smiths… Why should I believe you?',
      vocab: [['ut … reficiant', 'so that they may repair (subjunctive)'], ['cur?', 'why?'], ['credam', 'should I believe (subjunctive)']],
      variants: [
        {
          if: { minTrust: { emperor: 4 } },
          pose: 'laughing',
          narration: 'He doesn’t even hesitate.',
          latin: 'Bene! Quinque fabros tibi dabo… immo decem! Ite, machinam reficite! Titus vos ducet!',
          translation: 'Good! I will give you five smiths… no, ten! Go, repair the machine! Titus will lead you!',
          vocab: [['dabo', 'I will give (future)'], ['immo', 'no, rather'], ['ite', 'go! (to several people)'], ['reficite', 'repair! (to several people)'], ['vos ducet', 'will lead you all (future)']],
          choices: [],
          continueText: 'Bow and thank him',
          next: { scene: 'finale' },
        },
      ],
      choices: [
        { action: 'Look to Senator Cornelius', if: { choice: { palaceAccess: 'sealed' } }, next: 'cornelius_vouches' },
        { say: 'Aurelius et Titus mihi credunt.', next: 'granted' },
        { say: 'Aurelius et Titus me oderunt.', meaning: 'Aurelius and Titus hate me.', strike: 'emperor', next: 'dismissed' },
        { say: 'Aurelius et Titus pisces sunt.', meaning: 'Aurelius and Titus are fish.', strike: 'emperor', next: 'dismissed' },
      ],
    },

    cornelius_vouches: {
      speaker: 'senator',
      character: 'senator',
      narration: 'Cornelius steps out from among the courtiers.',
      latin: 'Imperator, hic hospes fidelis est. Ego pro hospite spondeo.',
      translation: 'Emperor, this guest is trustworthy. I vouch for them.',
      vocab: [['fidelis', 'loyal, trustworthy'], ['pro hospite', 'for the guest'], ['spondeo', 'I vouch, I guarantee']],
      next: 'granted',
    },

    granted: {
      speaker: 'emperor',
      narration: 'The emperor nods slowly.',
      latin: 'Bene. Quinque fabros tibi dabo. Ite, machinam reficite! Titus vos ducet!',
      translation: 'Very well. I will give you five smiths. Go, repair the machine! Titus will lead you!',
      vocab: [['credunt', 'they believe, trust'], ['dabo', 'I will give (future)'], ['ite', 'go! (to several people)'], ['reficite', 'repair! (to several people)'], ['vos ducet', 'will lead you all (future)']],
      continueText: 'Bow and thank him',
      next: { scene: 'finale' },
    },

    dismissed: {
      speaker: 'emperor',
      pose: 'stern',
      narration: 'The emperor frowns, then waves a hand. The audience is over.',
      latin: 'Hmm. Tibi non credo. Ad leones!',
      translation: 'Hmm. I don’t believe you. To the lions!',
      vocab: [['oderunt', 'they hate'], ['pisces', 'fish (plural)'], ['credo', 'I believe']],
      continueText: 'Get dragged away',
      next: { scene: 'arena' },
    },

    // Out of patience: game over for today.
    ad_leones: {
      speaker: 'emperor',
      pose: 'stern',
      narration: 'The emperor’s face goes cold. The whole hall falls silent.',
      latin: 'Satis. Tibi credere nolo. Ad leones!',
      translation: 'Enough. I refuse to believe you. To the lions!',
      vocab: [['satis', 'enough'], ['credere nolo', 'I refuse to believe'], ['ad leones', 'to the lions']],
      continueText: 'Get dragged away',
      next: { scene: 'arena' },
    },

    // ── Alternate endings ────────────────────────────────────────────────────

    gold: {
      speaker: 'emperor',
      pose: 'laughing',
      latin: 'Aurum? Facile! Ecce, aurum!',
      translation: 'Gold? Easy! Here, gold!',
      vocab: [['aurum', 'gold'], ['facile', 'easy']],
      next: 'gold_end',
    },

    gold_end: {
      character: null,
      ending: {
        id: 'rich-in-rome',
        type: 'comic',
        final: true,
        title: 'Dives in Urbe',
        subtitle: 'Rich in Rome',
        text: [
          'The emperor gives you a chest of gold, and you become the richest stranger in Rome. You buy a villa with a view of the Forum and a magpie of your own.',
          'But gold can’t fix a time machine. Once a year, you walk out along the road, sit beside the broken machine, and sigh.',
        ],
      },
    },

    stay: {
      speaker: 'emperor',
      pose: 'curious',
      narration: 'He raises his eyebrows, then smiles.',
      latin: 'Romae manere vis? Bene! Civis Romanus eris!',
      translation: 'You want to stay in Rome? Very well! You will be a Roman citizen!',
      vocab: [['Romae', 'in Rome (locative)'], ['manere', 'to stay'], ['civis', 'citizen'], ['eris', 'you will be (future)']],
      next: 'stay_end',
    },

    stay_end: {
      character: null,
      ending: {
        id: 'roman-citizen',
        type: 'success',
        title: 'Civis Romanus Sum',
        subtitle: 'I Am a Roman Citizen',
        text: [
          'You never go home. Instead, you become a citizen of Rome.',
          'Gaius teaches you to farm. Titus teaches you to work bronze. Marcus teaches you every shortcut in the Subura. And every morning at the salutatio, Aurelius’s magpie greets you by name.',
        ],
      },
    },

    come_with_me: {
      speaker: 'emperor',
      pose: 'stern',
      latin: 'In futurum? Insanus es!',
      translation: 'To the future? You’re crazy!',
      vocab: [['mecum', 'with me'], ['in futurum', 'into the future'], ['insanus', 'crazy']],
      variants: [
        {
          if: { minTrust: { emperor: 4 } },
          pose: 'laughing',
          narration: 'The emperor steps down from the dais. The courtiers gasp.',
          latin: 'In futurum? … Ita! Tecum veniam!',
          translation: 'To the future? … Yes! I will come with you!',
          vocab: [['mecum / tecum', 'with me / with you'], ['veniam', 'I will come (future)']],
          next: { scene: 'finale', node: 'emperor_comes' },
        },
      ],
      next: 'request',
    },
  },
};
