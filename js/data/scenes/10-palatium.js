// SCENE 10: THE PALACE (Chapter VII)
// New Latin: the PERFECT tense in earnest (dixit, misit, clausit, venisti, rogavit,
// intravisti, intravi, praedixi, dedit, invenisti), plus "scriptum est", credo +
// dative, and commands (serva! responde! porta! ascende! noli effundere!).
//
// Storm cover: a storm is raging, and the emperor has shut the palace gate: nobody
// gets in, not even with a senator's seal. The class has to sneak in instead:
//   overhear the guards  → the centurion sent them to the garden (HORTUS), locked the
//                          stable (STABULUM), and left the kitchen (CULINA) open
//   the three doors      → HORTUS is guarded (strike), STABULUM is locked (harmless),
//                          CULINA is the way in
//   the kitchen          → the head cook takes you for the new servant; play along,
//                          and carry the emperor's wine upstairs ("scalas ascende!")
//   the throne-room door → the officer from the gate, dripping on the marble
//
// Chapter VI pays off at the throne-room door. Every route ends with the same check,
// "Ubi anulum invenisti?" (Chapter V); what you bring decides how you get there:
//   senator's tablet  → the seal answers "who sent you?"; straight to the ring question
//   predictedRain     → "Vates sum! Tempestatem praedixi." does the same; at the gate,
//                       the officer also whispers where the servants go in
//   the list          → "Who sent you?", the list, then the ring question
// Refused? If you fed Marcus in Chapter III, he vouches for you (he works in the palace
// kitchens); or plead with "Ave, Imperator!" (Chapter VI's lesson).
//
// PATIENCE: only 2 strikes, shared by the officer, the guards and the head cook. Out of
// patience means the Tullianum: game over for today. Strikes: the garden door, going
// down the stairs, blowing your cover in the kitchen, lying to the officer, and wrong
// answers at the list and ring questions.

const DOORS = 'assets/backgrounds/palace-doors.webp';
const KITCHEN = 'assets/backgrounds/palace-kitchen.webp';
const CORRIDOR = 'assets/backgrounds/palace-corridor.webp';

/** @type {import('../schema.js').Scene} */
export default {
  id: 'palatium',
  chapter: 'palace',
  background: 'assets/backgrounds/palatium-storm.webp',
  character: 'praetorian',
  patience: [{ npc: 'palace', speakers: ['praetorian', 'praetorians', 'headCook'], max: 2, fail: 'tullianum' }],
  start: 'arrive',

  nodes: {
    arrive: {
      character: null,
      narration: [
        'The Palatine Hill rises above the Forum, crowned with the emperor’s palace. But today a storm is raging: thunder rolls, and rain streams down the marble steps.',
        'The great gate is shut. The Praetorians, the emperor’s own bodyguard, huddle under the archway, dripping and miserable.',
      ],
      variants: [
        {
          if: { flags: 'predictedRain' },
          narration: [
            'The Palatine Hill rises above the Forum, crowned with the emperor’s palace. A storm is raging, exactly as you predicted: thunder rolls, and rain streams down the marble steps.',
            'The great gate is shut. The Praetorians, the emperor’s own bodyguard, huddle under the archway, dripping and miserable.',
          ],
        },
      ],
      continueText: 'Approach the gate',
      next: 'gate',
    },

    // ── The shut gate ────────────────────────────────────────────────────────

    gate: {
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'An officer with a crested helmet shouts at you over the thunder.',
      latin: 'Siste! Porta clausa est. Imperator dixit: “Hodie nemo intrat!”',
      translation: 'Stop! The gate is shut. The emperor said: “Today nobody goes in!”',
      vocab: [['porta', 'gate, door'], ['clausa est', 'is shut'], ['dixit', 'said (perfect)'], ['hodie', 'today'], ['nemo', 'nobody'], ['intrat', 'goes in']],
      variants: [
        {
          if: { flags: 'predictedRain', notVisited: 'palatium.gate' },
          pose: 'default',
          narration: 'An officer with a crested helmet squints at you through the rain. Then his eyes go wide.',
          latin: 'Tu… tu es vates! Cornelius nobis dixit: “Vates tempestatem praedixit!” Sed porta clausa est. Imperator dixit: “Hodie nemo intrat.”',
          translation: 'You… you’re the prophet! Cornelius told us: “The prophet predicted the storm!” But the gate is shut. The emperor said: “Today nobody goes in.”',
          vocab: [['vates', 'prophet'], ['nobis', 'to us'], ['tempestatem', 'storm (accusative)'], ['praedixit', 'predicted (perfect)'], ['clausa est', 'is shut'], ['nemo', 'nobody']],
        },
        {
          if: { visited: 'palatium.gate' },
          narration: 'The officer wipes rain out of his eyes.',
          latin: 'Iterum? Porta clausa est! Nemo intrat!',
          translation: 'Again? The gate is shut! Nobody goes in!',
          vocab: [['iterum', 'again'], ['nemo', 'nobody']],
        },
      ],
      choices: [
        { action: 'Show him the senator’s sealed tablet', if: { hasItems: 'senator-tablet' }, once: true, next: 'gate_tablet' },
        { say: 'Cornelius nomen meum tibi dedit.', if: { authorizations: 'senator-list', lacksItems: 'senator-tablet' }, once: true, next: 'gate_list' },
        { say: 'Quomodo intrare possum?', if: { flags: 'predictedRain' }, once: true, next: 'prophet_hint' },
        { say: 'Imperatorem videre volo!', once: true, next: 'everyone' },
        { action: 'Shelter under the archway and listen', if: { notFlags: 'overheardGuards' }, next: 'overhear' },
        { action: 'Slip around the side of the palace', next: 'doors' },
      ],
    },

    gate_tablet: {
      speaker: 'praetorian',
      narration: 'He wipes the rain off the wax and peers at the seal.',
      latin: 'Signum Cornelii. Verum est. Sed imperator dixit: “Nemo!” Tabulam serva.',
      translation: 'Cornelius’s seal. It’s genuine. But the emperor said: “Nobody!” Keep the tablet.',
      vocab: [['signum', 'seal'], ['verum', 'true, genuine'], ['nemo', 'nobody'], ['serva', 'keep!']],
      next: 'gate',
    },

    gate_list: {
      speaker: 'praetorian',
      latin: 'Fortasse. Sed imperator dixit: “Nemo!”',
      translation: 'Maybe. But the emperor said: “Nobody!”',
      vocab: [['fortasse', 'maybe'], ['nemo', 'nobody']],
      next: 'gate',
    },

    everyone: {
      speaker: 'praetorian',
      latin: 'Omnes imperatorem videre volunt! Sed hodie nemo intrat!',
      translation: 'Everyone wants to see the emperor! But today nobody goes in!',
      vocab: [['omnes', 'everyone'], ['volunt', 'they want'], ['hodie', 'today']],
      next: 'gate',
    },

    // Chapter VI pays off: the prophet gets a whispered tip.
    prophet_hint: {
      speaker: 'praetorian',
      pose: 'approving',
      narration: 'He glances at the other guards, then leans close and whispers.',
      latin: 'Vates, tibi dico: servi per portam culinae semper intrant.',
      translation: 'Prophet, I’m telling you: the servants always go in through the kitchen door.',
      vocab: [['tibi dico', 'I tell you'], ['servi', 'servants, slaves'], ['per portam', 'through the door'], ['culinae', 'of the kitchen'], ['semper', 'always']],
      next: 'gate',
    },

    // The clue: which side door is safe.
    overhear: {
      character: null,
      speaker: 'praetorians',
      narration: 'You squeeze in under the archway, dripping. Two soldiers beside you pull their cloaks tight and grumble.',
      latin: 'Heu! Centurio nos ad hortum misit. In horto pluit!',
      translation: 'Ugh! The centurion sent us to the garden. It’s raining in the garden!',
      vocab: [['heu', 'ugh, alas'], ['centurio', 'the officer'], ['nos', 'us'], ['misit', 'sent (perfect)'], ['ad hortum', 'to the garden'], ['pluit', 'it’s raining']],
      next: 'overhear_2',
    },

    overhear_2: {
      character: null,
      speaker: 'praetorians',
      latin: 'Et portam stabuli clausit. Sed portam culinae non clausit: servi cenam portant.',
      translation: 'And he locked the stable door. But he didn’t lock the kitchen door: the servants are carrying in dinner.',
      vocab: [['portam', 'door'], ['stabuli', 'of the stable'], ['clausit', 'shut, locked (perfect)'], ['culinae', 'of the kitchen'], ['cenam', 'dinner'], ['portant', 'they carry']],
      onEnter: { setFlags: 'overheardGuards' },
      continueText: 'Step back out into the rain',
      next: 'gate',
    },

    // ── The side doors ───────────────────────────────────────────────────────

    doors: {
      character: null,
      background: DOORS,
      narration: 'You slip along the palace wall through the pouring rain. Around the corner are three doors, each with a word carved above it:',
      latin: 'HORTUS · STABULUM · CULINA',
      latinStyle: 'inscription',
      translation: 'Garden · Stable · Kitchen',
      vocab: [['hortus', 'garden'], ['stabulum', 'stable'], ['culina', 'kitchen']],
      variants: [
        { if: { visited: 'palatium.doors' }, narration: 'Rain drums on the three doors.' },
      ],
      choices: [
        {
          action: 'Go through the door marked HORTUS',
          strike: 'palace',
          review: {
            latin: 'Centurio nos ad hortum misit.',
            translation: 'The centurion sent us to the garden.',
            vocab: [['hortus / ad hortum', 'garden / to the garden'], ['misit', 'sent (perfect)']],
          },
          next: 'garden',
        },
        { action: 'Try the door marked STABULUM', once: true, next: 'stable' },
        { action: 'Go through the door marked CULINA', next: 'kitchen' },
        { action: 'Go back to the gate', next: 'gate' },
      ],
    },

    garden: {
      character: null,
      background: DOORS,
      speaker: 'praetorians',
      narration: 'You push open the garden gate… straight into two very wet, very grumpy Praetorians. You bolt back into the rain before they get a good look at you.',
      latin: 'Quis erat? … Heus! Siste!',
      translation: 'Who was that? … Hey! Stop!',
      vocab: [['erat', 'was'], ['heus', 'hey!'], ['siste', 'stop!']],
      continueText: 'Run!',
      next: 'doors',
    },

    stable: {
      character: null,
      background: DOORS,
      narration: 'You rattle the stable door. It is locked tight. From inside, a horse snorts at you.',
      variants: [
        {
          if: { flags: 'overheardGuards' },
          narration: 'You rattle the stable door. Locked tight, just as the guards said. From inside, a horse snorts at you.',
        },
      ],
      next: 'doors',
    },

    // ── The kitchen: storm cover ─────────────────────────────────────────────

    kitchen: {
      background: KITCHEN,
      character: 'headCook',
      speaker: 'headCook',
      narration: 'You step into a huge, steaming kitchen. Cooks shout, pots bubble, and servants rush past with silver trays. The head cook grabs your arm. You are soaked, just like every servant who has run in from the rain.',
      latin: 'Tu! Cur tarde venisti? Novus servus es?',
      translation: 'You! Why did you come late? Are you the new servant?',
      vocab: [['cur?', 'why?'], ['tarde', 'late'], ['venisti', 'you came (perfect)'], ['novus', 'new'], ['servus', 'servant, slave']],
      variants: [
        {
          if: { helped: 'boy', notVisited: 'palatium.kitchen' },
          narration: [
            'You step into a huge, steaming kitchen. Cooks shout, pots bubble, and servants rush past with silver trays. Across the room, Marcus looks up from a pile of loaves and nearly drops one.',
            'The head cook grabs your arm. You are soaked, just like every servant who has run in from the rain.',
          ],
        },
      ],
      choices: [
        { say: 'Ita, novus servus sum.', next: 'job' },
        { say: 'Pluit!', once: true, next: 'raining' },
        { say: 'Imperatorem videre volo!', meaning: 'I want to see the emperor!', once: true, strike: 'palace', next: 'suspicious' },
        { say: 'Minime! Peregrinus sum.', meaning: 'No! I am a foreigner.', once: true, strike: 'palace', next: 'suspicious' },
      ],
    },

    // A free joke: true, but not an answer.
    raining: {
      background: KITCHEN,
      character: 'headCook',
      speaker: 'headCook',
      latin: 'Pluit? Hoc scio! Responde: novus servus es?',
      translation: 'It’s raining? I know that! Answer: are you the new servant?',
      vocab: [['pluit', 'it’s raining'], ['scio', 'I know'], ['responde', 'answer!']],
      choicesFrom: 'kitchen',
    },

    suspicious: {
      background: KITCHEN,
      character: 'headCook',
      speaker: 'headCook',
      narration: 'The head cook narrows his eyes. Around you, several cooks stop stirring.',
      latin: 'Quid dixisti?! … Responde! Novus servus es?',
      translation: 'What did you say?! … Answer! Are you the new servant?',
      vocab: [['dixisti', 'you said (perfect)'], ['responde', 'answer!']],
      choicesFrom: 'kitchen',
    },

    job: {
      background: KITCHEN,
      character: 'headCook',
      speaker: 'headCook',
      narration: 'He shoves a heavy silver jug into your hands.',
      latin: 'Bene. Imperator vinum rogavit. Hoc vinum ad aulam porta! Cave: noli vinum effundere!',
      translation: 'Good. The emperor asked for wine. Carry this wine to the throne room! Careful: don’t spill the wine!',
      vocab: [['rogavit', 'asked for (perfect)'], ['vinum', 'wine'], ['ad aulam', 'to the throne room'], ['porta', 'carry!'], ['cave', 'careful!'], ['noli effundere', 'don’t spill!']],
      next: 'job_2',
    },

    job_2: {
      background: KITCHEN,
      character: 'headCook',
      speaker: 'headCook',
      narration: 'He points at a doorway.',
      latin: 'Aula est supra. Scalas ascende! Festina!',
      translation: 'The throne room is upstairs. Climb the stairs! Hurry!',
      vocab: [['supra', 'above, upstairs'], ['scalas', 'stairs'], ['ascende', 'climb! go up!'], ['festina', 'hurry!']],
      continueText: 'Hurry out with the jug',
      next: 'stairs',
    },

    // Did you understand "ascende"?
    stairs: {
      character: null,
      background: CORRIDOR,
      narration: 'You hurry down a corridor, slopping only a little wine. It ends at two staircases: one leads up toward music and lamplight, the other down into the dark.',
      choices: [
        { action: 'Climb the stairs', next: 'hall_door' },
        {
          action: 'Go down the stairs',
          strike: 'palace',
          review: {
            latin: 'Aula est supra. Scalas ascende!',
            translation: 'The throne room is upstairs. Climb the stairs!',
            vocab: [['supra', 'above, upstairs'], ['ascende', 'climb! go up!']],
          },
          next: 'barracks',
        },
      ],
    },

    barracks: {
      character: null,
      background: CORRIDOR,
      speaker: 'praetorians',
      narration: 'The stairs lead down into the Praetorians’ barracks. Twenty off-duty soldiers look up from their dinner.',
      latin: 'Quid hic facis? Servi hic non intrant! Abi!',
      translation: 'What are you doing here? Servants don’t come in here! Go away!',
      vocab: [['quid facis?', 'what are you doing?'], ['hic', 'here'], ['abi', 'go away!']],
      continueText: 'Back up the stairs, fast',
      next: 'stairs',
    },

    // ── The throne-room door: Chapter VI pays off ────────────────────────────

    hall_door: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'At the top of the stairs are tall doors hung with purple curtains. In front of them, dripping onto the marble, stands the officer from the gate. He stares at you. Then at the wine jug.',
      latin: 'Tu?! Quomodo intravisti?',
      translation: 'You?! How did you get in?',
      vocab: [['quomodo?', 'how?'], ['intravisti', 'you got in (perfect)']],
      choices: [
        { action: 'Show him the senator’s sealed tablet', if: { hasItems: 'senator-tablet' }, next: 'door_tablet' },
        { say: 'Vates sum! Tempestatem praedixi.', if: { flags: 'predictedRain' }, next: 'door_prophet' },
        { say: 'Per culinam intravi.', next: 'door_honest' },
        { say: 'Servus sum.', meaning: 'I am a servant.', once: true, strike: 'palace', next: 'door_lie' },
      ],
    },

    door_tablet: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'approving',
      narration: 'He looks at the seal, then at the jug, and shakes his head.',
      latin: 'Signum Cornelii… et vinum imperatoris! Ha! Audax es. Sed signa falsa multa sunt. Unum rogo:',
      translation: 'Cornelius’s seal… and the emperor’s wine! Ha! You’re bold. But there are lots of fake seals. I’ll ask one thing:',
      vocab: [['signum', 'seal'], ['audax', 'bold'], ['signa falsa', 'fake seals'], ['unum rogo', 'I ask one thing']],
      next: 'ring_question',
    },

    door_prophet: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'approving',
      narration: 'He takes a step back.',
      latin: 'Vere vates es! Tempestatem praedixisti, et nunc hic es! … Sed vates multi mendaces sunt. Unum rogo:',
      translation: 'You really are a prophet! You predicted the storm, and now here you are! … But lots of prophets are liars. I’ll ask one thing:',
      vocab: [['vere', 'truly, really'], ['praedixisti', 'you predicted (perfect)'], ['nunc', 'now'], ['mendaces', 'liars'], ['unum rogo', 'I ask one thing']],
      next: 'ring_question',
    },

    door_lie: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'suspicious',
      latin: 'Servus? Mendax! Te ad portam vidi!',
      translation: 'A servant? Liar! I saw you at the gate!',
      vocab: [['mendax', 'liar'], ['te', 'you'], ['vidi', 'I saw (perfect)']],
      choicesFrom: 'hall_door',
    },

    door_honest: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'He stares at you. Then, despite himself, he laughs.',
      latin: 'Per culinam?! Ha! Audax es. Sed nemo sine signo intrat. Quis te misit?',
      translation: 'Through the kitchen?! Ha! You’re bold. But nobody gets in without a seal. Who sent you?',
      vocab: [['per culinam', 'through the kitchen'], ['audax', 'bold'], ['sine signo', 'without a seal'], ['misit', 'sent (perfect)']],
      variants: [
        {
          if: { visited: 'palatium.door_honest' },
          narration: 'He folds his arms.',
          latin: 'Iterum: quis te misit?',
          translation: 'Again: who sent you?',
          vocab: [['iterum', 'again'], ['misit', 'sent']],
        },
      ],
      choices: [
        { say: 'Cornelius me misit.', next: 'list' },
        { say: 'Aurelius me misit.', meaning: 'Aurelius sent me.', once: true, strike: 'palace', next: 'sent_aurelius' },
        { say: 'Coquus me misit!', once: true, next: 'sent_cook' },
      ],
    },

    sent_aurelius: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'suspicious',
      latin: 'Aurelius? Aurelius senator non est!',
      translation: 'Aurelius? Aurelius isn’t a senator!',
      next: 'door_honest',
    },

    // A free joke: technically true.
    sent_cook: {
      background: CORRIDOR,
      speaker: 'praetorian',
      narration: 'He looks at the wine jug in your hands.',
      latin: 'Coquus? … Verum est: vinum portas. Sed coquus senator non est!',
      translation: 'The cook? … True: you’re carrying the wine. But the cook isn’t a senator!',
      vocab: [['coquus', 'cook'], ['verum', 'true'], ['portas', 'you carry']],
      next: 'door_honest',
    },

    list: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'He pulls a damp list from his belt and runs a finger down it.',
      latin: 'Hmm. Cornelius mihi indicem dedit. Hic scriptum est: “Peregrinus mirus, hospes Aurelii.” Tune es?',
      translation: 'Hmm. Cornelius gave me a list. It says here: “A strange foreigner, Aurelius’s guest.” Is that you?',
      vocab: [['indicem', 'list'], ['dedit', 'gave (perfect)'], ['scriptum est', 'it is written'], ['mirus', 'strange'], ['hospes', 'guest'], ['tune es?', 'is it you?']],
      choices: [
        { say: 'Ita, ego sum.', next: 'ring_question' },
        { say: 'Minime!', meaning: 'Not at all! (No!)', once: true, strike: 'palace', next: 'not_me' },
      ],
    },

    not_me: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'suspicious',
      latin: 'Minime? Ergo quis es?!',
      translation: 'No? Then who are you?!',
      vocab: [['ergo', 'then, so']],
      choicesFrom: 'list',
    },

    // Recalling Chapter V.
    ring_question: {
      background: CORRIDOR,
      speaker: 'praetorian',
      latin: 'Cornelius dixit: “Hospes anulum Aurelii invenit.” Ubi anulum invenisti?',
      translation: 'Cornelius said: “The guest found Aurelius’s ring.” Where did you find the ring?',
      vocab: [['dixit', 'said (perfect)'], ['invenit', 'found (perfect)'], ['invenisti', 'you found (perfect)']],
      choices: [
        { say: 'In cavea picae.', next: 'ring_right' },
        { say: 'In culina.', meaning: 'In the kitchen.', strike: 'palace', next: 'refused' },
        { say: 'In balneis.', meaning: 'In the baths.', strike: 'palace', next: 'refused' },
        { say: 'In foro.', meaning: 'In the Forum.', strike: 'palace', next: 'refused' },
      ],
    },

    ring_right: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'approving',
      narration: 'For the first time, the corner of his mouth twitches.',
      latin: 'In cavea picae! Verum est. Aurelius omnibus de pica narravit. Intra!',
      translation: 'In the magpie’s cage! That’s true. Aurelius has told everyone about that magpie. Go in!',
      vocab: [['cavea', 'cage'], ['picae', 'of the magpie'], ['omnibus', 'to everyone'], ['narravit', 'told (perfect)']],
      next: 'warning',
    },

    refused: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'He folds his arms.',
      latin: 'Minime! Aurelius aliud narravit. Tibi non credo.',
      translation: 'No! Aurelius told a different story. I don’t believe you.',
      vocab: [['aliud', 'something else'], ['narravit', 'told (perfect)'], ['tibi non credo', 'I don’t believe you']],
      choices: [
        { action: 'Look for Marcus', if: { helped: 'boy' }, next: 'marcus' },
        { say: 'Iterum rogo! Quaeso!', once: true, next: 'plead' },
        { action: 'Give up and go back down the hill', next: 'turned_away' },
      ],
    },

    // Kindness pays off: feeding Marcus in Chapter III.
    marcus: {
      background: CORRIDOR,
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      narration: 'A familiar skinny figure comes pounding up the stairs with a basket of bread. Marcus! He runs errands for the palace kitchens.',
      latin: 'Hic peregrinus amicus meus est! Homo bonus est! Ego testis sum!',
      translation: 'This stranger is my friend! A good person! I’m a witness!',
      vocab: [['amicus meus', 'my friend'], ['homo bonus', 'a good person'], ['testis', 'witness']],
      next: 'marcus_2',
    },

    marcus_2: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'approving',
      narration: 'The officer sighs. Clearly everyone at the palace knows Marcus.',
      latin: 'Marcus? Puer coquorum? … Bene. Marco credo. Intra!',
      translation: 'Marcus? The cooks’ boy? … Fine. I trust Marcus. Go in!',
      vocab: [['puer coquorum', 'the cooks’ boy'], ['Marco credo', 'I trust Marcus (credo + dative)'], ['intra', 'go in!']],
      next: 'warning',
    },

    // A second chance that tests Chapter VI's lesson.
    plead: {
      background: CORRIDOR,
      speaker: 'praetorian',
      narration: 'He studies you for a long moment.',
      latin: 'Quaeso? … Bene. Unum responsum. Quid imperatori dices?',
      translation: 'Please? … All right. One answer. What will you say to the emperor?',
      vocab: [['responsum', 'answer'], ['imperatori', 'to the emperor'], ['dices', 'you will say']],
      choices: [
        { say: 'Ave, Imperator!', next: 'plead_ok' },
        { say: 'Salve, amice!', meaning: 'Hello, friend!', strike: 'palace', next: 'turned_away' },
        { say: 'Heus tu!', meaning: 'Hey, you!', strike: 'palace', next: 'turned_away' },
      ],
    },

    plead_ok: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'approving',
      latin: 'Bene dixisti. Intra.',
      translation: 'Well said. Go in.',
      vocab: [['bene dixisti', 'you said it well']],
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
          'Two Praetorians take the wine jug and march you back down the Palatine Hill into the rain. So close.',
          'Maybe try making a better impression on the people who could vouch for you.',
        ],
      },
    },

    // Out of patience: game over for today.
    tullianum: {
      speaker: 'praetorian',
      pose: 'suspicious',
      narration: 'Suddenly the officer from the gate is there, dripping and furious, with two more Praetorians behind him.',
      latin: 'Satis! Suspectus es. In Tullianum!',
      translation: 'Enough! You’re suspicious. To the Tullianum!',
      vocab: [['satis', 'enough'], ['suspectus', 'suspicious'], ['Tullianum', 'Rome’s deepest prison cell']],
      onEnter: { recordChoice: { jailedFrom: 'palace' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    // ── Through the curtains ─────────────────────────────────────────────────

    warning: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'approving',
      narration: 'As you pass, he lowers his voice.',
      latin: 'Tace et audi: ante imperatorem genua flecte, et “Ave, Imperator” dic!',
      translation: 'Be quiet and listen: in front of the emperor, bend your knee, and say “Ave, Imperator”!',
      vocab: [['tace', 'be quiet!'], ['audi', 'listen!'], ['ante', 'in front of'], ['genua flecte', 'bend your knee!'], ['dic', 'say!']],
      choices: [
        { say: 'Scio!', if: { flags: 'knowsAve' }, next: 'already_know' },
        { say: 'Gratias!', next: 'end' },
      ],
    },

    already_know: {
      background: CORRIDOR,
      speaker: 'praetorian',
      pose: 'approving',
      latin: 'Bene. Cornelius te bene docuit.',
      translation: 'Good. Cornelius taught you well.',
      vocab: [['docuit', 'taught (perfect)']],
      next: 'end',
    },

    // ── End of Chapter VII ───────────────────────────────────────────────────

    end: {
      character: null,
      background: CORRIDOR,
      ending: {
        id: 'chapter-7-complete',
        type: 'chapter',
        title: 'Finis Capituli VII',
        subtitle: 'End of Chapter VII',
        text: [
          'You slip through the purple curtains, still dripping rainwater. A real servant snatches the wine jug out of your hands and hurries off with it.',
          'At the far end of a great hall sits the most powerful person in the world.',
        ],
        next: { scene: 'aula' },
      },
    },
  },
};
