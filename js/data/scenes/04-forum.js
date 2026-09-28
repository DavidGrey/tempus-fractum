// SCENE 4: THE FORUM (Chapter III)
// New Latin:
//   vendo / cupio, volo + infinitive (laborare volo), -ne questions (cupisne? habesne?),
//   numbers (unus, duo, tres, quinque, octo, novem, decem, viginti), plurals (poma,
//   denarii), third-person verbs (scit, habet), imperatives (abi! veni! porta!).
//
// Goal: find a guide to a smith. The Forum has no forges; Marcus, a street boy,
// knows the way but wants food (or coins) first.
//
// Ways to pay Marcus (at least one is always open):
//   bread       left over from the farmer (if you didn't give it to the guard)
//   apples      buy them from Iulia with coins, or earn them by carrying her baskets
//   coins       sell your wristwatch to Lucius the merchant (haggling with numbers)
//   pickpocket  if Marcus steals your coins and gets away, he feels guilty and guides you anyway
//
// PATIENCE: Iulia and Lucius share one "market" meter of 3 strikes. When it runs out,
// Iulia calls the soldiers and it's prison: game over for today. Strikes: stealing an apple,
// paying one coin when she said "duo", and "Unum!" or "Viginti!" to Lucius. Offering Iulia
// the bone is a free joke.
//
// Consequences:
//   steal an apple       → Iulia bans you from her stall, reputation −1
//   ask "Unum!" (one)    → you get a single coin: not enough for apples
//   ask "Viginti!" (20)  → the merchant is offended and later offers only three
//   count coins openly   → Marcus snatches them; "Siste, fur!" gets him caught,
//                          English or chasing him does not
//   the caught thief     → a dilemma: hand him to the soldiers (coins back, but Marcus
//                          is bitter: no free guide, no palace vouching, a cool goodbye)
//                          or "Ignosco tibi" (lose the coins, gain a loyal friend)
//   Subura alone         → one warning, then a failure ending

/** @type {import('../schema.js').Scene} */
export default {
  id: 'forum',
  chapter: 'forum',
  background: 'assets/backgrounds/forum.webp',
  patience: [{ npc: 'market', speakers: ['fruitSeller', 'merchant'], max: 3, fail: 'soldiers' }],
  start: 'hub',

  nodes: {
    // ── The Forum (hub) ──────────────────────────────────────────────────────

    hub: {
      character: null,
      narration: [
        'Through the gate, the street opens onto the Forum: temples with tall columns, shops under striped awnings, and more people than you have ever seen in one place.',
        'Sellers shout. Someone is selling sausages. Someone else is selling a goat. But nobody is hammering metal. There are no smiths here.',
      ],
      variants: [
        {
          if: { visited: 'forum.hub' },
          narration: 'The Forum roars around you: sellers shouting, sandals slapping on stone, a goat bleating somewhere.',
        },
      ],
      choices: [
        { action: 'Visit the fruit stall', next: 'fruit' },
        { action: 'Visit the merchant’s stall', next: 'merchant' },
        { action: 'Talk to the boy by the fountain', next: 'boy' },
        { action: 'Count your coins', if: { hasItems: 'denarii', notFlags: 'pickpocketed' }, next: 'pickpocket' },
        { action: 'Head into the Subura alone', if: { flags: 'knowsSubura' }, next: 'subura_alone' },
      ],
    },

    // ── Iulia, the fruit seller ──────────────────────────────────────────────

    fruit: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      narration: 'A woman stands behind a stall heaped with apples, figs, and pears.',
      latin: 'Salve! Poma bona vendo! Cupisne poma?',
      translation: 'Hello! I sell good apples! Do you want apples?',
      vocab: [['poma', 'apples'], ['bona', 'good'], ['vendo', 'I sell'], ['cupisne?', 'do you want?']],
      variants: [
        {
          if: { flags: 'stoleFromIulia' },
          pose: 'angry',
          narration: 'The fruit seller spots you and grabs a broom.',
          latin: 'Tu! Fur! Abi!',
          translation: 'You! Thief! Go away!',
          vocab: [['fur', 'thief'], ['abi', 'go away!']],
          choices: [{ action: 'Back away slowly', next: 'hub' }],
        },
        {
          if: { visited: 'forum.fruit' },
          narration: 'The fruit seller holds up an apple.',
          latin: 'Quid vis?',
          translation: 'What do you want?',
          vocab: [['quid?', 'what?'], ['vis', 'you want']],
        },
      ],
      choices: [
        { say: 'Poma cupio.', if: { lacksItems: 'poma' }, next: 'buy' },
        { say: 'Ubi est faber?', once: true, next: 'fruit_smith' },
        { say: 'Laborare volo.', if: { notFlags: 'workedForIulia' }, next: 'work' },
        { action: 'Offer her your bone', if: { hasItems: 'bone' }, once: true, next: 'fruit_bone' },
        { action: 'Grab an apple and run', if: { lacksItems: 'poma' }, strike: 'market', next: 'steal' },
        { say: 'Vale!', next: 'hub' },
      ],
    },

    buy: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      narration: 'She holds up two fingers.',
      latin: 'Duo denarii.',
      translation: 'Two denarii.',
      vocab: [['duo', 'two'], ['denarii', 'silver coins']],
      choices: [
        {
          action: 'Pay her two coins',
          if: { hasItems: 'denarii', not: { choice: { watchPrice: 1 } } },
          next: 'bought',
        },
        { action: 'Offer her your one coin', if: { hasItems: 'denarii', choice: { watchPrice: 1 } }, next: 'one_coin' },
        // A number check: she said duo, not unus.
        {
          action: 'Pay her one coin',
          if: { hasItems: 'denarii', not: { choice: { watchPrice: 1 } } },
          once: true,
          strike: 'market',
          next: 'wrong_price',
        },
        { say: 'Pecuniam non habeo.', if: { lacksItems: 'denarii' }, next: 'no_money' },
        { say: 'Nimis est!', next: 'too_much' },
      ],
    },

    bought: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      latin: 'Gratias! Ecce, poma!',
      translation: 'Thank you! Here are your apples!',
      vocab: [['gratias', 'thank you'], ['ecce', 'here!'], ['poma', 'apples']],
      onEnter: { addItems: 'poma' },
      next: 'fruit',
    },

    wrong_price: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      pose: 'angry',
      narration: 'She stares at the single coin in her palm.',
      latin: 'Unum? Minime! DUO denarii! Audisne?',
      translation: 'One? No! TWO denarii! Are you listening?',
      vocab: [['unum', 'one'], ['duo', 'two'], ['audisne?', 'are you listening? do you hear?']],
      choicesFrom: 'buy',
    },

    one_coin: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      narration: 'She looks at your single coin, then at you.',
      latin: 'Unus denarius? Non satis!',
      translation: 'One denarius? Not enough!',
      vocab: [['unus', 'one'], ['non satis', 'not enough']],
      next: 'fruit',
    },

    no_money: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      narration: 'She glances across the way at the merchant’s stall, where people are selling things for coins.',
      latin: 'Sine pecunia, nulla poma!',
      translation: 'No money, no apples!',
      vocab: [['sine', 'without'], ['pecunia', 'money'], ['nulla', 'no, none']],
      next: 'fruit',
    },

    too_much: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      narration: 'She puts her hands on her hips.',
      latin: 'Nimis? Poma mea sunt optima!',
      translation: 'Too much? My apples are the best!',
      vocab: [['nimis', 'too much'], ['mea', 'my'], ['optima', 'the best']],
      next: 'fruit',
    },

    fruit_smith: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      narration: 'She points her chin at a skinny boy sitting on the edge of the fountain.',
      latin: 'Faber? Nescio. Sed Marcus scit! Marcus omnia scit.',
      translation: 'A smith? I don’t know. But Marcus knows! Marcus knows everything.',
      vocab: [['nescio', 'I don’t know'], ['scit', 'knows'], ['omnia', 'everything']],
      onEnter: { setFlags: 'heardOfMarcus' },
      next: 'fruit',
    },

    work: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      narration: 'She looks you up and down, then points at a cart piled with baskets.',
      latin: 'Laborare? Bene! Porta cistas!',
      translation: 'Work? Good! Carry the baskets!',
      vocab: [['laborare', 'to work'], ['porta', 'carry!'], ['cistas', 'baskets']],
      next: 'work_2',
    },

    work_2: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      narration: 'For the next hour you haul heavy baskets of figs from the cart to the stall. Your arms ache. The fruit seller looks impressed.',
      latin: 'Bene laboras! Ecce, poma!',
      translation: 'You work well! Here, apples!',
      vocab: [['bene', 'well'], ['laboras', 'you work'], ['poma', 'apples']],
      onEnter: { addItems: 'poma', setFlags: 'workedForIulia', helped: 'fruitSeller', reputation: 1 },
      next: 'fruit',
    },

    fruit_bone: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      narration: 'She stares at the bone. Then at you.',
      latin: 'Os? Ego canis non sum!',
      translation: 'A bone? I am not a dog!',
      vocab: [['os', 'bone'], ['canis', 'dog']],
      next: 'fruit',
    },

    steal: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      pose: 'angry',
      narration: 'You snatch an apple and bolt. Behind you, the fruit seller screams:',
      latin: 'Fur! Fur! Siste!',
      translation: 'Thief! Thief! Stop!',
      vocab: [['fur', 'thief'], ['siste', 'stop!']],
      next: 'steal_2',
    },

    steal_2: {
      character: null,
      narration: [
        'You make it three steps before a sausage seller sticks out his foot. You sprawl on the stones. The apple rolls away, and a goat eats it.',
        'Everyone nearby is glaring at you. The sausage seller just laughs:',
      ],
      latin: 'Ha! Cadis!',
      translation: 'Ha! Down you go!',
      vocab: [['cadis', 'you fall']],
      onEnter: { setFlags: 'stoleFromIulia', reputation: -1 },
      next: 'hub',
    },

    // ── Lucius, the merchant: selling the wristwatch ─────────────────────────

    merchant: {
      character: 'merchant',
      speaker: 'merchant',
      narration: 'A plump merchant sits among oil lamps, bronze mirrors, and little statues of the gods.',
      latin: 'Salve! Mercator sum. Multa vendo! Quid cupis?',
      translation: 'Hello! I’m a merchant. I sell many things! What do you want?',
      vocab: [['mercator', 'merchant'], ['multa', 'many things'], ['vendo', 'I sell'], ['cupis', 'you want']],
      variants: [{ if: { visited: 'forum.merchant' }, narration: 'The merchant looks up hopefully.' }],
      choices: [
        { say: 'Pecuniam non habeo.', if: { lacksItems: 'denarii', notFlags: 'soldWatch' }, next: 'merchant_watch' },
        { action: 'Show him your wristwatch', if: { notFlags: 'soldWatch' }, next: 'merchant_watch' },
        { say: 'Ubi est faber?', once: true, next: 'merchant_smith' },
        { say: 'Vale!', next: 'hub' },
      ],
    },

    merchant_watch: {
      character: 'merchant',
      speaker: 'merchant',
      pose: 'amazed',
      narration: 'His eyes go wide. He grabs your wrist and stares at your watch. It is ticking.',
      latin: 'Quid est hoc?! Hoc volo! Quinque denarios do!',
      translation: 'What is this?! I want this! I’ll give five denarii!',
      vocab: [['hoc', 'this'], ['volo', 'I want'], ['quinque', 'five'], ['do', 'I give']],
      variants: [
        {
          if: { flags: 'merchantOffended' },
          pose: 'default',
          narration: 'He sniffs and crosses his arms.',
          latin: 'Hmm. Tres denarios do. Non plus.',
          translation: 'Hmm. I’ll give three denarii. No more.',
          vocab: [['tres', 'three'], ['non plus', 'no more']],
          choices: [
            { say: 'Ita!', effects: { recordChoice: { watchPrice: 3 } }, next: 'deal' },
            { say: 'Minime!', next: 'merchant' },
          ],
        },
      ],
      choices: [
        { say: 'Ita!', effects: { recordChoice: { watchPrice: 5 } }, next: 'deal' },
        { say: 'Decem!', next: 'haggle' },
        { say: 'Unum!', meaning: 'One!', effects: { recordChoice: { watchPrice: 1 } }, strike: 'market', next: 'deal_one' },
        { say: 'Viginti!', meaning: 'Twenty!', strike: 'market', next: 'offended' },
        { say: 'Minime!', next: 'merchant' },
      ],
    },

    haggle: {
      character: 'merchant',
      speaker: 'merchant',
      narration: 'He clutches his chest as if you have wounded him.',
      latin: 'Decem?! … Octo!',
      translation: 'Ten?! … Eight!',
      vocab: [['decem', 'ten'], ['octo', 'eight']],
      choices: [
        { say: 'Ita!', effects: { recordChoice: { watchPrice: 8 } }, next: 'deal' },
        { say: 'Novem!', next: 'haggle_2' },
        { say: 'Minime!', next: 'merchant' },
      ],
    },

    haggle_2: {
      character: 'merchant',
      speaker: 'merchant',
      latin: 'Novem?! Octo. Non plus!',
      translation: 'Nine?! Eight. No more!',
      vocab: [['novem', 'nine'], ['octo', 'eight'], ['non plus', 'no more']],
      choices: [
        { say: 'Ita!', effects: { recordChoice: { watchPrice: 8 } }, next: 'deal' },
        { say: 'Minime!', next: 'merchant' },
      ],
    },

    offended: {
      character: 'merchant',
      speaker: 'merchant',
      narration: 'He drops your wrist as if it were hot.',
      latin: 'Viginti?! Insanus es! Abi!',
      translation: 'Twenty?! You’re crazy! Go away!',
      vocab: [['viginti', 'twenty'], ['insanus', 'crazy'], ['abi', 'go away!']],
      onEnter: { setFlags: 'merchantOffended' },
      next: 'hub',
    },

    deal: {
      character: 'merchant',
      speaker: 'merchant',
      narration: 'He counts silver coins into your palm and straps your watch onto his own wrist, grinning.',
      latin: 'Bene! Ecce, denarii!',
      translation: 'Good! Here are the denarii!',
      vocab: [['ecce', 'here!'], ['denarii', 'silver coins']],
      onEnter: { addItems: 'denarii', setFlags: 'soldWatch' },
      next: 'merchant',
    },

    // Understanding the number matters: "Unum!" means "One!"
    deal_one: {
      character: 'merchant',
      speaker: 'merchant',
      pose: 'amazed',
      narration: 'The merchant blinks. Then he grins very, very widely.',
      latin: 'Unum? … Ita! Ecce, unus denarius!',
      translation: 'One? … Yes! Here is one denarius!',
      vocab: [['unum / unus', 'one']],
      onEnter: { addItems: 'denarii', setFlags: 'soldWatch' },
      next: 'merchant',
    },

    merchant_smith: {
      character: 'merchant',
      speaker: 'merchant',
      narration: 'He waves vaguely toward a maze of narrow, crowded streets.',
      latin: 'Faber? Multi fabri sunt in Subura.',
      translation: 'A smith? There are many smiths in the Subura.',
      vocab: [['multi', 'many'], ['fabri', 'smiths'], ['Subura', 'a crowded neighbourhood of Rome']],
      onEnter: { setFlags: 'knowsSubura' },
      next: 'merchant',
    },

    // ── The pickpocket ───────────────────────────────────────────────────────

    pickpocket: {
      character: null,
      narration: 'You pull out your coins and start counting them. Suddenly a small hand snatches them, and a skinny boy darts away into the crowd! Someone shouts:',
      latin: 'Fur fugit! Celeriter currit!',
      translation: 'The thief is getting away! He’s running fast!',
      vocab: [['fur', 'thief'], ['fugit', 'flees, is getting away'], ['celeriter', 'quickly, fast'], ['currit', 'runs']],
      onEnter: { removeItems: 'denarii', setFlags: 'pickpocketed' },
      choices: [
        { say: 'Siste, fur!', next: 'caught' },
        // Instant game over: "I am a thief!" instead of "Stop, thief!"
        { say: 'Fur sum!', meaning: 'I am a thief!', strike: 'market', fatal: true, next: 'confessed' },
        { action: 'Shout “Stop, thief!”', next: 'not_understood' },
        { action: 'Chase him', next: 'chase' },
      ],
    },

    caught: {
      character: 'boy',
      speaker: 'boy',
      narration: 'Heads turn. A huge baker drops his tray, grabs the boy by the tunic, and hauls him back to you.',
      latin: 'Ignosce! Ignosce! Cibum valde cupio!',
      translation: 'Forgive me! Forgive me! I really want food!',
      vocab: [['ignosce', 'forgive me!'], ['cibum valde cupio', 'I really want food']],
      onEnter: { setFlags: ['caughtMarcus', 'knowsMarcusName'] },
      next: 'baker',
    },

    // The dilemma: your coins, or the boy.
    baker: {
      character: 'boy',
      speaker: 'baker',
      narration: 'The baker holds the squirming boy by the collar in one hand and your coins in the other. The boy is skin and bone. He looks at the coins, then at you.',
      latin: 'Fur parvus! Ecce, denarii tui. Ad milites eum duco?',
      translation: 'A little thief! Here are your denarii. Shall I take him to the soldiers?',
      vocab: [['fur parvus', 'a little thief'], ['denarii tui', 'your coins'], ['ad milites', 'to the soldiers'], ['eum duco', 'I take him']],
      choices: [
        {
          say: 'Ita! Ad milites!',
          effects: { addItems: 'denarii', setFlags: 'handedOverMarcus' },
          next: 'handed_over',
        },
        {
          say: 'Ignosco tibi. Denarios tene!',
          effects: { setFlags: 'forgaveMarcus', helped: 'boy', recordChoice: { paidMarcusWith: 'forgiveness' } },
          next: 'forgiven',
        },
      ],
    },

    handed_over: {
      character: 'boy',
      speaker: 'boy',
      pose: 'sulking',
      narration: 'The baker drops your coins into your hand and hauls the boy off toward two soldiers. Over his shoulder, the boy shouts back at you:',
      latin: 'Minime! Quaeso! … Numquam tibi ignoscam!',
      translation: 'No! Please! … I’ll never forgive you!',
      vocab: [['quaeso', 'please'], ['numquam', 'never'], ['tibi ignoscam', 'I will forgive you (ignosco + dative)']],
      next: 'hub',
    },

    forgiven: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      narration: 'The baker shrugs and lets go. The boy stares at the coins in his hand as if they might vanish.',
      latin: 'Mihi ignoscis?! … Gratias! Marcus sum. Quid quaeris? Ego omnia scio!',
      translation: 'You forgive me?! … Thank you! I’m Marcus. What are you looking for? I know everything!',
      vocab: [['mihi ignoscis', 'you forgive me (ignosco + dative)'], ['quaeris', 'you are looking for'], ['omnia', 'everything'], ['scio', 'I know']],
      choices: [{ say: 'Fabrum quaero.', next: 'forgiven_2' }],
    },

    forgiven_2: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      latin: 'Fabrum? Viam scio! Pro te, gratis! Veni, sequere me!',
      translation: 'A smith? I know the way! For you, free! Come on, follow me!',
      vocab: [['viam', 'the way'], ['pro te', 'for you'], ['gratis', 'for free'], ['sequere me', 'follow me!']],
      continueText: 'Follow Marcus',
      next: 'to_smith',
    },

    confessed: {
      character: null,
      speaker: 'crowd',
      narration: 'The whole Forum goes quiet. Everyone turns and stares at you. A woman clutches her purse. Somewhere in the crowd, the boy with your coins starts to laugh.',
      latin: 'Tu fur es? Milites! Milites!',
      translation: 'You’re a thief? Soldiers! Soldiers!',
      vocab: [['tu… es', 'you are'], ['fur', 'thief'], ['milites', 'soldiers']],
      onEnter: { recordChoice: { jailedFrom: 'forum-confessed' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    not_understood: {
      character: null,
      narration: 'Everyone stares at you. A woman asks her husband what language that was. The boy is long gone, and so are your coins.',
      onEnter: { setFlags: 'robbedByMarcus' },
      next: 'hub',
    },

    chase: {
      character: null,
      narration: 'You sprint after him, crash through a stall of clay pots, and end up sitting in a heap of broken pottery. The boy is long gone, and so are your coins. The potter would like a word.',
      onEnter: { setFlags: 'robbedByMarcus', reputation: -1 },
      next: 'hub',
    },

    // ── Marcus, the street boy ───────────────────────────────────────────────

    boy: {
      character: 'boy',
      speaker: 'boy',
      narration: 'A skinny, barefoot boy sits on the edge of the fountain, swinging his legs and watching everyone.',
      latin: 'Salve, peregrine! Quid quaeris?',
      translation: 'Hello, stranger! What are you looking for?',
      vocab: [['peregrine', 'stranger (speaking to someone)'], ['quid?', 'what?'], ['quaeris', 'you are looking for']],
      variants: [
        {
          if: { flags: 'robbedByMarcus' },
          pose: 'grinning',
          narration: 'It’s the boy who stole your coins! He is eating a sausage, probably bought with your money.',
          latin: 'Eheu… Salve. Denarios tuos… iam non habeo.',
          translation: 'Uh-oh… Hello. Your denarii… I don’t have them anymore.',
          vocab: [['eheu', 'uh-oh, alas'], ['tuos', 'your'], ['iam non', 'no longer, not anymore']],
          choices: [
            { say: 'Fur es!', next: 'boy_guilty' },
            { say: 'Ubi est faber?', next: 'boy_guilty' },
          ],
        },
        {
          if: { flags: 'handedOverMarcus', notVisited: 'forum.boy' },
          pose: 'sulking',
          narration: 'The boy is back on the fountain, rubbing a sore ear. The soldiers let him go with a warning. He glares at you.',
          latin: 'Tu! Milites me ceperunt… propter te! Quid quaeris?',
          translation: 'You! The soldiers grabbed me… because of you! What are you looking for?',
          vocab: [['milites', 'soldiers'], ['ceperunt', 'caught, grabbed (perfect)'], ['propter te', 'because of you'], ['quaeris', 'you are looking for']],
        },
        {
          if: { visited: 'forum.boy' },
          narration: 'The boy is still swinging his legs on the fountain.',
          latin: 'Quid quaeris?',
          translation: 'What are you looking for?',
        },
      ],
      choices: [
        { say: 'Fabrum quaero.', next: 'boy_deal' },
        { say: 'Quis es?', if: { notFlags: 'knowsMarcusName' }, next: 'boy_name' },
        { say: 'Vale!', next: 'hub' },
      ],
    },

    boy_name: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      latin: 'Marcus sum. Pater meus nauta erat. Ego omnia scio!',
      translation: 'I’m Marcus. My father was a sailor. I know everything!',
      vocab: [['pater meus', 'my father'], ['nauta', 'sailor'], ['erat', 'was (imperfect)'], ['omnia', 'everything'], ['scio', 'I know']],
      onEnter: { setFlags: 'knowsMarcusName' },
      choicesFrom: 'boy',
    },

    boy_guilty: {
      character: 'boy',
      speaker: 'boy',
      narration: 'He shuffles his bare feet.',
      latin: 'Ignosce! Pro denariis tuis… viam ad fabrum monstro!',
      translation: 'Sorry! In return for your denarii… I’ll show you the way to the smith!',
      vocab: [['pro', 'for, in return for'], ['viam', 'way, road'], ['ad fabrum', 'to the smith'], ['monstro', 'I show']],
      onEnter: { setFlags: 'knowsMarcusName', recordChoice: { paidMarcusWith: 'stolen coins' } },
      continueText: 'Follow Marcus',
      next: 'to_smith',
    },

    boy_deal: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      latin: 'Fabrum? Viam scio! Sed cibum cupio. Habesne cibum?',
      translation: 'A smith? I know the way! But I want food. Do you have any food?',
      vocab: [['viam', 'the way'], ['scio', 'I know'], ['cupio', 'I want'], ['habesne?', 'do you have?']],
      variants: [
        {
          if: { flags: 'handedOverMarcus', notVisited: 'forum.boy_deal' },
          pose: 'sulking',
          latin: 'Viam scio. Sed pro te nihil gratis facio! Cibum aut denarios da!',
          translation: 'I know the way. But I do nothing for you for free! Give me food or coins!',
          vocab: [['pro te', 'for you'], ['nihil gratis', 'nothing for free'], ['aut', 'or'], ['da', 'give!']],
        },
        {
          if: { visited: 'forum.boy_deal' },
          latin: 'Cibum habesne?',
          translation: 'Do you have any food?',
          vocab: [['cibum', 'food'], ['habesne?', 'do you have?']],
        },
      ],
      choices: [
        {
          action: 'Give him your bread',
          if: { hasItems: 'bread' },
          effects: { removeItems: 'bread', recordChoice: { paidMarcusWith: 'bread' } },
          next: 'boy_fed',
        },
        {
          action: 'Give him your apples',
          if: { hasItems: 'poma' },
          effects: { removeItems: 'poma', recordChoice: { paidMarcusWith: 'apples' } },
          next: 'boy_fed',
        },
        { action: 'Give him your bone', if: { hasItems: 'bone' }, once: true, next: 'boy_bone' },
        {
          action: 'Offer him your coins',
          if: { hasItems: 'denarii' },
          effects: { removeItems: 'denarii', recordChoice: { paidMarcusWith: 'coins' } },
          next: 'boy_paid',
        },
        { say: 'Cibum non habeo.', next: 'boy_no_food' },
      ],
    },

    boy_fed: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      narration: 'He wolfs it down in about four seconds.',
      latin: 'Mmm! Gratias! Veni, sequere me!',
      translation: 'Mmm! Thanks! Come on, follow me!',
      vocab: [['veni', 'come!'], ['sequere me', 'follow me!']],
      onEnter: { setFlags: 'knowsMarcusName', helped: 'boy' },
      variants: [
        {
          if: { flags: 'handedOverMarcus' },
          pose: 'sulking',
          narration: 'He wolfs it down without a word of thanks.',
          latin: 'Hmph. Veni.',
          translation: 'Hmph. Come on.',
          vocab: [['veni', 'come!']],
          onEnter: { setFlags: 'knowsMarcusName' },
        },
      ],
      continueText: 'Follow Marcus',
      next: 'to_smith',
    },

    boy_paid: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      narration: 'His eyes light up.',
      latin: 'Denarii?! Etiam melius! Veni, sequere me!',
      translation: 'Denarii?! Even better! Come on, follow me!',
      vocab: [['etiam melius', 'even better'], ['veni', 'come!'], ['sequere me', 'follow me!']],
      onEnter: { setFlags: 'knowsMarcusName' },
      continueText: 'Follow Marcus',
      next: 'to_smith',
    },

    boy_bone: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      narration: 'He holds the bone up and looks at it. Then he hands it back.',
      latin: 'Os? Canis non sum!',
      translation: 'A bone? I’m not a dog!',
      vocab: [['os', 'bone'], ['canis', 'dog']],
      next: 'boy_deal',
    },

    boy_no_food: {
      character: 'boy',
      speaker: 'boy',
      narration: 'He shrugs and goes back to watching the crowd.',
      latin: 'Nullus cibus, nulla via!',
      translation: 'No food, no directions!',
      vocab: [['nullus / nulla', 'no, none'], ['cibus', 'food'], ['via', 'way, road']],
      next: 'hub',
    },

    // ── Out of patience: the market calls the soldiers ───────────────────────

    soldiers: {
      character: 'fruitSeller',
      speaker: 'fruitSeller',
      pose: 'angry',
      narration: 'The whole market has had enough of you. Iulia climbs onto her stall and shouts at the top of her voice:',
      latin: 'Milites voco! Milites! Hic peregrinus malus est!',
      translation: 'I’m calling the soldiers! Soldiers! This foreigner is trouble!',
      vocab: [['voco', 'I call'], ['milites', 'soldiers'], ['malus', 'bad, trouble']],
      onEnter: { recordChoice: { jailedFrom: 'forum' } },
      continueText: 'Get dragged away',
      next: { scene: 'carcer' },
    },

    // ── The Subura alone: one warning, then a failure ending ─────────────────

    subura_alone: {
      character: null,
      narration: [
        'You plunge into the narrow streets of the Subura. Tall apartment blocks lean over you, laundry drips on your head, and every alley looks exactly the same.',
        'Behind you, you can still hear the Forum. Just barely.',
      ],
      choices: [
        { action: 'Turn back to the Forum', next: 'hub' },
        { action: 'Keep going', next: 'subura_lost' },
      ],
    },

    subura_lost: {
      character: null,
      ending: {
        id: 'lost-in-subura',
        type: 'defeat',
        title: 'Perditus in Subura!',
        subtitle: 'Lost in the Subura!',
        text: [
          'Three hours, forty alleys, and one very angry goose later, you have no idea where you are.',
          'Then someone empties a chamber pot out of a third-floor window. Directly onto you.',
          'Next time, maybe find a guide.',
        ],
      },
    },

    // ── End of Chapter III ───────────────────────────────────────────────────

    to_smith: {
      character: null,
      ending: {
        id: 'chapter-3-complete',
        type: 'chapter',
        title: 'Finis Capituli III',
        subtitle: 'End of Chapter III',
        text: 'Marcus leads you out of the Forum and into the tangled streets of the Subura, ducking under laundry lines and around snoring dogs. Then you hear it: the ring of hammers on metal. Somewhere ahead is a forge.',
        next: { scene: 'forge' },
      },
    },
  },
};
