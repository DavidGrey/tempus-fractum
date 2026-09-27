// SCENE 5: THE FORGE (Chapter IV)
// New Latin:
//   possum / debeo + infinitive (discedere non possum, laborare debeo),
//   si ("if"), accusative plurals (portas), and a first taste of the perfect
//   tense in the smith's speech (fecit, feci), always glossed in the hint.
//
// Story beat: the player finally meets a smith who understands the repair, and
// learns he can't simply leave. The job needs five smiths, and Titus is bound to
// his work for Aurelius, a rich man. "If Aurelius says yes, I'll come." That leads
// into Chapter V.
//
// Getting his attention (he starts out hammering and ignoring you):
//   show the broken hinge    → he stops at once (craftsman's curiosity)
//   wait patiently           → +1 trust
//   pump the bellows         → +1 trust
//   pick up a hammer         → you hit your thumb; he laughs, and listens
//
// Smith trust: +1 wait, +1 bellows, +1 "Faber in patria mea", +1 "Tria milia passuum"
// (if you read the milestone in Chapter I), −1 "Ego feci!" (an obvious lie).
// Trust 1+ earns his bronze token (tessera), which will help at Aurelius's house.
//
// PATIENCE: 3 strikes and Titus throws you in the horse trough: game over for today.
// Strikes: nagging him while he works ("Auxilium tuum volo", "Machina mea est fracta")
// and lying ("Ego feci!"). Stealing a hammer is an instant game over.

/** @type {import('../schema.js').Scene} */
export default {
  id: 'forge',
  chapter: 'smith',
  background: 'assets/backgrounds/forge.webp',
  character: 'smith',
  patience: [{ npc: 'smith', max: 3, fail: 'had_enough' }],
  start: 'arrive',

  nodes: {
    // ── Arriving with Marcus ─────────────────────────────────────────────────

    arrive: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      narration: 'Marcus stops outside a smoky workshop. Inside, a huge man in a leather apron is hammering a bar of glowing iron.',
      latin: 'Ecce, officina fabri! Titus hic habitat. Cave: Titus semper laborat! Vale!',
      translation: 'Look, the smith’s workshop! Titus lives here. Careful: Titus is always working! Bye!',
      vocab: [['officina', 'workshop'], ['fabri', 'of the smith'], ['hic habitat', 'lives here'], ['semper', 'always'], ['laborat', 'works, is working']],
      variants: [
        {
          if: { choice: { paidMarcusWith: 'stolen coins' } },
          latin: 'Ecce, officina fabri! Titus hic laborat. Nunc pares sumus! Vale!',
          translation: 'Look, the smith’s workshop! Titus works here. Now we’re even! Bye!',
          vocab: [['officina', 'workshop'], ['fabri', 'of the smith'], ['hic', 'here'], ['pares sumus', 'we are even']],
        },
      ],
      continueText: 'Step inside',
      next: 'busy',
    },

    // ── He's busy: get his attention ─────────────────────────────────────────

    busy: {
      speaker: 'smith',
      pose: 'working',
      narration: 'The smith doesn’t look up. CLANG. CLANG. CLANG.',
      latin: 'Quid vis? Laboro!',
      translation: 'What do you want? I’m working!',
      vocab: [['quid?', 'what?'], ['vis', 'you want'], ['laboro', 'I am working']],
      variants: [
        {
          if: { visited: 'forge.busy' },
          narration: 'CLANG. CLANG. Sparks fly.',
          latin: 'Adhuc laboro!',
          translation: 'I’m still working!',
          vocab: [['adhuc', 'still'], ['laboro', 'I am working']],
        },
      ],
      choices: [
        { say: 'Auxilium tuum volo.', meaning: 'I want your help.', once: true, strike: 'smith', next: 'busy_help' },
        { say: 'Machina mea est fracta.', meaning: 'My machine is broken.', once: true, strike: 'smith', next: 'busy_broken' },
        { action: 'Show him the broken hinge', if: { hasItems: 'broken-hinge' }, next: 'examine' },
        { action: 'Wait patiently', once: true, next: 'wait' },
        { action: 'Pump the bellows for him', once: true, next: 'bellows' },
        { action: 'Pick up a hammer and help', once: true, next: 'thumb' },
      ],
    },

    busy_help: {
      speaker: 'smith',
      pose: 'working',
      latin: 'Auxilium? Ego auxilium volo! Laboro!',
      translation: 'Help? I want help! I’m working!',
      vocab: [['auxilium', 'help'], ['volo', 'I want']],
      next: 'busy',
    },

    busy_broken: {
      speaker: 'smith',
      pose: 'working',
      latin: 'Multae res sunt fractae. Laboro!',
      translation: 'Lots of things are broken. I’m working!',
      vocab: [['multae res', 'many things'], ['fractae', 'broken']],
      next: 'busy',
    },

    wait: {
      speaker: 'smith',
      narration: 'You sit on an upturned bucket and wait. And wait. The smith finishes a horseshoe, then another, then a third. At last he looks at you.',
      latin: 'Adhuc hic es? … Bene. Patiens es.',
      translation: 'You’re still here? … All right. You’re patient.',
      vocab: [['adhuc', 'still'], ['hic', 'here'], ['patiens', 'patient']],
      onEnter: { trust: { smith: 1 } },
      next: 'listen',
    },

    bellows: {
      speaker: 'smith',
      narration: 'You grab the handles of the big leather bellows and pump. The fire roars white-hot. The smith raises an eyebrow, then grins.',
      latin: 'Tam bene laboras!',
      translation: 'You work so well!',
      vocab: [['tam', 'so'], ['bene', 'well'], ['laboras', 'you work']],
      onEnter: { trust: { smith: 1 } },
      next: 'listen',
    },

    thumb: {
      speaker: 'smith',
      pose: 'laughing',
      narration: 'You pick up a hammer, swing it at the glowing iron… and hit your own thumb. The smith roars with laughter. At least he has stopped hammering.',
      latin: 'Ha! Ha! Faber non es!',
      translation: 'Ha! Ha! You’re no smith!',
      vocab: [['faber', 'smith']],
      next: 'listen',
    },

    listen: {
      speaker: 'smith',
      narration: 'He sets down his hammer.',
      latin: 'Bene. Quid vis?',
      translation: 'All right. What do you want?',
      vocab: [['bene', 'all right, good'], ['quid?', 'what?'], ['vis', 'you want']],
      choices: [
        { action: 'Show him the broken hinge', if: { hasItems: 'broken-hinge' }, next: 'examine' },
        { say: 'Machina mea est fracta.', next: 'show_me' },
      ],
    },

    show_me: {
      speaker: 'smith',
      latin: 'Machina fracta? Monstra!',
      translation: 'A broken machine? Show me!',
      vocab: [['fracta', 'broken'], ['monstra', 'show (me)!']],
      choices: [{ action: 'Show him the broken hinge', next: 'examine' }],
    },

    // ── The hinge ────────────────────────────────────────────────────────────

    examine: {
      speaker: 'smith',
      pose: 'examining',
      narration: 'He stops. He takes the hinge in his huge, scarred fingers and turns it over and over in the firelight.',
      latin: 'Mirum! Hoc metallum est durum… et leve. Quis hoc fecit?',
      translation: 'Amazing! This metal is hard… and light. Who made this?',
      vocab: [['mirum', 'amazing'], ['hoc', 'this'], ['durum', 'hard'], ['leve', 'light (not heavy)'], ['fecit', 'made (perfect tense of facere)']],
      choices: [
        { say: 'Nescio.', next: 'where' },
        { say: 'Ego feci!', meaning: 'I made it!', strike: 'smith', next: 'lie' },
        { say: 'Faber in patria mea.', next: 'homeland' },
      ],
    },

    lie: {
      speaker: 'smith',
      pose: 'laughing',
      narration: 'He grabs your hand and looks at your palm.',
      latin: 'Tu? Ha! Manus tuae sunt mollissimae!',
      translation: 'You? Ha! Your hands are super soft!',
      vocab: [['feci', 'I made (perfect tense)'], ['manus tuae', 'your hands'], ['mollissimae', 'very soft']],
      onEnter: { trust: { smith: -1 } },
      next: 'where',
    },

    homeland: {
      speaker: 'smith',
      pose: 'examining',
      narration: 'He whistles softly.',
      latin: 'Patria tua? Fabri ibi sunt mirabiles!',
      translation: 'Your homeland? The smiths there are amazing!',
      vocab: [['patria', 'homeland'], ['ibi', 'there'], ['mirabiles', 'amazing']],
      onEnter: { trust: { smith: 1 } },
      next: 'where',
    },

    where: {
      speaker: 'smith',
      latin: 'Et ubi est machina tua?',
      translation: 'And where is your machine?',
      vocab: [['ubi?', 'where?'], ['machina tua', 'your machine']],
      choices: [
        { say: 'Extra urbem est.', next: 'verdict' },
        // Pays off reading the milestone in Chapter I.
        {
          say: 'Tria milia passuum extra urbem.',
          if: { flags: 'readMilestone' },
          effects: { trust: { smith: 1 } },
          next: 'precise',
        },
      ],
    },

    precise: {
      speaker: 'smith',
      narration: 'He nods, impressed.',
      latin: 'Tria milia passuum? Bene. Accuratus es.',
      translation: 'Three miles? Good. You’re precise.',
      vocab: [['tria milia passuum', 'three miles'], ['accuratus', 'precise, careful']],
      next: 'verdict',
    },

    // ── The verdict: he can't leave ──────────────────────────────────────────

    verdict: {
      speaker: 'smith',
      narration: 'He sets the hinge down gently and wipes his hands on his leather apron.',
      latin: 'Opus magnum et difficile est! Unus faber non satis est. Quinque fabri necessarii sunt.',
      translation: 'It’s a big, difficult job! One smith isn’t enough. Five smiths are needed.',
      vocab: [['opus', 'job, work'], ['difficile', 'difficult'], ['unus', 'one'], ['satis', 'enough'], ['quinque', 'five'], ['necessarii sunt', 'are needed, are necessary']],
      next: 'cannot_leave',
    },

    cannot_leave: {
      speaker: 'smith',
      latin: 'Et ego hic laborare debeo. Ex officina venire non possum.',
      translation: 'And I must work here. I can’t come out of the workshop.',
      vocab: [['laborare', 'to work'], ['debeo', 'I must'], ['ex officina', 'out of the workshop'], ['venire', 'to come'], ['possum', 'I can']],
      choices: [
        { say: 'Cur?', once: true, next: 'why' },
        { say: 'Alii fabri?', once: true, next: 'other_smiths' },
        { say: 'Pecuniam habeo!', if: { hasItems: 'denarii' }, once: true, next: 'money' },
        { say: 'Quaeso!', once: true, next: 'please' },
        { say: 'Quid facere possum?', next: 'solution' },
        { action: 'Steal a hammer and fix it yourself', next: 'steal_hammer' },
      ],
    },

    why: {
      speaker: 'smith',
      narration: 'He points at a half-finished pair of bronze doors leaning against the wall.',
      latin: 'Aurelius, vir dives, portas aeneas vult. Ego portas facio!',
      translation: 'Aurelius, a rich man, wants bronze doors. I am making the doors!',
      vocab: [['vir dives', 'a rich man'], ['portas', 'doors (accusative plural)'], ['aeneas', 'bronze'], ['facio', 'I make']],
      onEnter: { setFlags: 'knowsAurelius' },
      choicesFrom: 'cannot_leave',
    },

    other_smiths: {
      speaker: 'smith',
      latin: 'Omnes fabri laborant: pro divitibus… aut pro imperatore.',
      translation: 'All the smiths are working: for the rich… or for the emperor.',
      vocab: [['omnes', 'all'], ['laborant', 'they work, are working'], ['pro', 'for'], ['divitibus', 'rich people'], ['imperatore', 'emperor']],
      onEnter: { setFlags: 'heardEmperorEmploysSmiths' },
      choicesFrom: 'cannot_leave',
    },

    money: {
      speaker: 'smith',
      pose: 'laughing',
      narration: 'He looks at your handful of coins and laughs.',
      latin: 'Pecuniam? Aurelius multam pecuniam habet!',
      translation: 'Money? Aurelius has lots of money!',
      vocab: [['pecuniam', 'money'], ['multam', 'a lot of']],
      onEnter: { setFlags: 'knowsAurelius' },
      choicesFrom: 'cannot_leave',
    },

    please: {
      speaker: 'smith',
      narration: 'For a moment he looks genuinely sorry.',
      latin: 'Ignosce. Non possum.',
      translation: 'I’m sorry. I can’t.',
      vocab: [['ignosce', 'sorry, forgive me'], ['possum', 'I can']],
      choicesFrom: 'cannot_leave',
    },

    solution: {
      speaker: 'smith',
      narration: 'He thinks for a long moment, scratching his beard with a sooty finger.',
      latin: 'Aurelium roga! Si Aurelius “ita” dicit, ego venio.',
      translation: 'Ask Aurelius! If Aurelius says “yes”, I’ll come.',
      vocab: [['roga', 'ask!'], ['si', 'if'], ['dicit', 'says'], ['venio', 'I come, I will come']],
      onEnter: { setFlags: 'knowsAurelius' },
      next: 'his_house',
    },

    his_house: {
      speaker: 'smith',
      latin: 'Villa Aurelii est in colle Esquilino.',
      translation: 'Aurelius’s house is on the Esquiline Hill.',
      vocab: [['villa', 'house'], ['Aurelii', 'of Aurelius'], ['in colle', 'on the hill']],
      variants: [{ if: { minTrust: { smith: 1 } }, next: 'token' }],
      next: 'to_aurelius',
    },

    token: {
      speaker: 'smith',
      narration: 'He digs in a pouch and presses a small bronze disc into your hand. It is stamped with a hammer.',
      latin: 'Ecce, tessera mea. Servi Aurelii amici mei sunt.',
      translation: 'Here, my token. Aurelius’s household are my friends.',
      vocab: [['tessera', 'token'], ['servi', 'household slaves, servants'], ['amici mei', 'my friends']],
      onEnter: { addItems: 'smith-token' },
      next: 'to_aurelius',
    },

    // ── Comic failure ────────────────────────────────────────────────────────

    steal_hammer: {
      speaker: 'smith',
      narration: 'While his back is turned, you slip a hammer under your jacket. You make it two steps. A hand the size of a shovel lands on your shoulder.',
      latin: 'Fur! Foras!',
      translation: 'Thief! Out!',
      vocab: [['fur', 'thief'], ['foras', 'out!, outside!']],
      next: 'thrown_out',
    },

    thrown_out: {
      character: null,
      ending: {
        id: 'thrown-in-trough',
        type: 'defeat',
        title: 'Foras!',
        subtitle: 'Out You Go!',
        text: [
          'Titus picks you up by your collar and drops you headfirst into the horse trough outside.',
          'Dripping, you realise two things: you are no longer welcome at the forge, and you could never have fixed a time machine with one hammer anyway.',
        ],
      },
    },

    // Out of patience: game over for today.
    had_enough: {
      speaker: 'smith',
      narration: 'Titus slams his hammer down on the anvil. The whole workshop rings.',
      latin: 'Satis! Tace et abi! Foras!',
      translation: 'Enough! Be quiet and go away! Out!',
      vocab: [['satis', 'enough'], ['tace', 'be quiet!'], ['abi', 'go away!'], ['foras', 'out!']],
      next: 'trough',
    },

    trough: {
      character: null,
      ending: {
        id: 'thrown-in-trough',
        type: 'defeat',
        title: 'Foras!',
        subtitle: 'Out You Go!',
        text: [
          'Titus drops you headfirst into the horse trough. You’ll need better Latin, and better manners.',
          'Study the lines below and try again next class.',
        ],
      },
    },

    // ── End of Chapter IV ────────────────────────────────────────────────────

    to_aurelius: {
      character: null,
      ending: {
        id: 'chapter-4-complete',
        type: 'chapter',
        title: 'Finis Capituli IV',
        subtitle: 'End of Chapter IV',
        text: [
          'Titus turns back to his anvil. CLANG. Outside, Marcus is waiting for you, grinning: “Esquilinum? Viam scio!”',
          'Somewhere on the Esquiline Hill lives Aurelius, the one man who can set Titus free. Now you just have to convince him to see you.',
        ],
        next: { scene: 'domus-door' },
      },
      variants: [
        {
          if: { hasItems: 'smith-token' },
          ending: {
            id: 'chapter-4-complete',
            type: 'chapter',
            title: 'Finis Capituli IV',
            subtitle: 'End of Chapter IV',
            text: [
              'Titus turns back to his anvil. CLANG. Outside, Marcus is waiting for you, grinning: “Esquilinum? Viam scio!”',
              'Somewhere on the Esquiline Hill lives Aurelius, the one man who can set Titus free. You grip the smith’s bronze token. With it, Aurelius’s household might actually let you through the door.',
            ],
            next: { scene: 'domus-door' },
          },
        },
      ],
    },
  },
};
