// SCENE 6: AURELIUS'S DOOR (Chapter V, part 1 of 3)
// Getting past the doorkeeper (ianitor):
//   smith's token (Chapter IV)  → straight in
//   "Ecce, denarius!"           → a coin buys your way in (why the coins you got back by
//                                 handing Marcus to the soldiers in Chapter III are worth keeping)
//   "Cliens sum."               → come back in the morning; slip in with the salutatio
//                                 (Roman clients greeting their patron at dawn)
//   "Aurelius amicus meus est!" → "Mendax es!" (liar)
//   climb the garden wall       → comic ending in the fishpond
//
// Latin: mostly review, plus misit ("sent", perfect, glossed) and mane/cras.

/** @type {import('../schema.js').Scene} */
export default {
  id: 'domus-door',
  chapter: 'patron',
  background: 'assets/backgrounds/domus-door.webp',
  character: 'doorkeeper',
  start: 'arrive',

  nodes: {
    arrive: {
      character: 'boy',
      speaker: 'boy',
      pose: 'grinning',
      narration: 'Marcus leads you up the Esquiline Hill to a grand house with tall double doors and a gleaming bronze knocker. An old doorkeeper sits on a stool beside them.',
      latin: 'Ecce, villa Aurelii! Feliciter!',
      translation: 'Here’s Aurelius’s house! Good luck!',
      vocab: [['villa', 'house'], ['Aurelii', 'of Aurelius'], ['feliciter', 'good luck!']],
      intro: {
        latin: 'Ecce, villa Aurelii! Vale!',
        translation: 'Here’s Aurelius’s house! Bye!',
        vocab: [['villa', 'house'], ['Aurelii', 'of Aurelius'], ['vale', 'goodbye']],
      },
      continueText: 'Knock on the door',
      next: 'door',
    },

    door: {
      speaker: 'doorkeeper',
      narration: 'The doorkeeper looks you up and down, from your strange shoes to your strange hair.',
      latin: 'Quis es? Quid vis?',
      translation: 'Who are you? What do you want?',
      vocab: [['quis?', 'who?'], ['quid?', 'what?'], ['vis', 'you want']],
      variants: [
        {
          if: { visited: 'domus-door.door' },
          narration: 'The doorkeeper sighs.',
          latin: 'Iterum? Quid vis?',
          translation: 'Again? What do you want?',
          vocab: [['iterum', 'again']],
        },
      ],
      choices: [
        { action: 'Show him the smith’s token', if: { hasItems: 'smith-token' }, next: 'token' },
        { say: 'Ecce, denarius!', if: { hasItems: 'denarii' }, effects: { removeItems: 'denarii', recordChoice: { enteredDomusBy: 'coin' } }, next: 'coin' },
        { say: 'Aurelium videre volo.', once: true, next: 'see_aurelius' },
        { say: 'Titus faber me misit.', once: true, next: 'titus_sent' },
        { say: 'Cliens sum.', next: 'client' },
        { say: 'Aurelius amicus meus est!', once: true, next: 'liar' },
        { action: 'Climb over the garden wall', next: 'wall' },
      ],
    },

    token: {
      speaker: 'doorkeeper',
      narration: 'He turns the bronze disc over, sees the hammer, and his face softens.',
      latin: 'Tessera Titi! Titus amicus domus est. Intra!',
      translation: 'Titus’s token! Titus is a friend of this house. Come in!',
      vocab: [['tessera', 'token'], ['Titi', 'of Titus'], ['amicus domus', 'a friend of the house'], ['intra', 'come in!']],
      onEnter: { recordChoice: { enteredDomusBy: 'token' } },
      continueText: 'Step inside',
      next: { scene: 'domus-atrium' },
    },

    coin: {
      speaker: 'doorkeeper',
      narration: 'He bites the coin, glances up and down the street, and tucks it into his tunic.',
      latin: 'Denarius? … Hmm. Intra. Sed tace: dominus non scit!',
      translation: 'A denarius? … Hmm. Come in. But keep quiet: the master doesn’t know!',
      vocab: [['intra', 'come in!'], ['tace', 'keep quiet!'], ['dominus', 'the master'], ['scit', 'knows']],
      continueText: 'Step inside',
      next: { scene: 'domus-atrium' },
    },

    see_aurelius: {
      speaker: 'doorkeeper',
      latin: 'Omnes Aurelium videre volunt! Dominus laborat.',
      translation: 'Everyone wants to see Aurelius! The master is working.',
      vocab: [['omnes', 'everyone'], ['videre', 'to see'], ['volunt', 'they want'], ['dominus', 'master']],
      next: 'door',
    },

    titus_sent: {
      speaker: 'doorkeeper',
      narration: 'He holds out his hand.',
      latin: 'Titus te misit? Tesseram eius habes?',
      translation: 'Titus sent you? Do you have his token?',
      vocab: [['misit', 'sent (perfect tense)'], ['tesseram', 'token'], ['eius', 'his']],
      intro: {
        latin: 'Titus te misit? Tesseram Titi habes?',
        translation: 'Titus sent you? Do you have Titus’s token?',
        vocab: [['misit', 'sent (perfect tense)'], ['tesseram', 'token'], ['Titi', 'of Titus']],
      },
      next: 'door',
    },

    liar: {
      speaker: 'doorkeeper',
      narration: 'He snorts.',
      latin: 'Amicus? Mendax es! Abi!',
      translation: 'A friend? You’re a liar! Go away!',
      vocab: [['mendax', 'liar'], ['abi', 'go away!']],
      next: 'door',
    },

    client: {
      speaker: 'doorkeeper',
      latin: 'Cliens? Clientes mane veniunt, non nunc! Cras mane redi!',
      translation: 'A client? Clients come in the morning, not now! Come back tomorrow morning!',
      vocab: [['cliens', 'client (someone who depends on a rich patron)'], ['mane', 'in the morning'], ['cras', 'tomorrow'], ['redi', 'come back!']],
      choices: [
        { action: 'Wait until morning', next: 'morning' },
        { action: 'Try something else', next: 'door' },
      ],
    },

    morning: {
      character: null,
      narration: [
        'You spend the night curled up in a doorway across the street. Marcus snores beside you.',
        'At dawn, a crowd of men in white togas gathers at the door: Aurelius’s clients, here for the morning greeting, the salutatio. When the doors swing open, you shuffle in with them.',
      ],
      onEnter: { recordChoice: { enteredDomusBy: 'salutatio' } },
      continueText: 'Slip inside',
      next: { scene: 'domus-atrium' },
    },

    wall: {
      character: null,
      narration: 'You find a quiet side street, scramble up the garden wall, and swing your legs over. The drop is much farther than it looked…',
      next: 'splash',
    },

    splash: {
      character: null,
      ending: {
        id: 'fishpond',
        type: 'defeat',
        title: 'In Piscinam!',
        subtitle: 'Into the Fishpond!',
        text: [
          'You land in Aurelius’s ornamental fishpond with an enormous splash. Twelve very expensive fish flee in terror.',
          'Two burly servants haul you out, dripping, and throw you back into the street. The doorkeeper will certainly remember your face now.',
        ],
      },
    },
  },
};
