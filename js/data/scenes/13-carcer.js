// SCENE 13: THE PRISON (shared game-over scene, Chapters II–VII)
// When a character's patience runs out, their scene's arrest node records where you
// came from (recordChoice: { jailedFrom }) and sends you here. One background serves
// every chapter; the text changes to match who put you here.
//
//   gate           Chapter II: the gate guard
//   gate-emperor   Chapter II: "Imperator sum!"
//   forum          Chapter III: the market (Iulia and Lucius call the soldiers)
//   forum-confessed Chapter III: "Fur sum!" (I am a thief!) at the pickpocket
//   domus          Chapter V: Aurelius decides you stole his ring
//   curia          Chapter VI: Cornelius loses patience
//   treason        Chapter VI: "Imperium peto!"
//   palace         Chapter VII: the Praetorians (the Tullianum, Rome's deepest cell)
//
// Class-list words: hodie, manere, aqua, clamare, nemo, audire, servare, inimicus.
// The ending is a defeat: no retry today, the Latin to review, and next class the
// chapter starts again.

/** @type {import('../schema.js').Scene} */
export default {
  id: 'carcer',
  background: 'assets/backgrounds/carcer.webp',
  checkpoint: false,
  start: 'arrive',

  nodes: {
    arrive: {
      narration: 'Two soldiers march you through the streets to the city prison, a squat stone building that smells of damp and despair. A heavy iron door bangs shut behind you.',
      variants: [
        {
          if: { choice: { jailedFrom: 'gate-emperor' } },
          narration: 'Two soldiers march you through the gate and straight to the city prison. Claiming to be the emperor, it turns out, is a very quick way to get locked up.',
        },
        {
          if: { choice: { jailedFrom: 'forum' } },
          narration: 'The watchmen drag you out of the Forum, past a crowd of jeering shoppers, and down the worn steps of the city prison.',
        },
        {
          if: { choice: { jailedFrom: 'forum-confessed' } },
          narration: '“Fur sum” doesn’t mean “Thief!” It means “I am a thief!” The soldiers are very happy to take you at your word. To shout “Stop, thief!”, say “Siste, fur!”',
        },
        {
          if: { choice: { jailedFrom: 'domus' } },
          narration: 'Aurelius’s servants hold you until the soldiers arrive. As they march you down the Esquiline Hill, someone in the street shouts: “Fur anuli!” Thief of the ring!',
        },
        {
          if: { choice: { jailedFrom: 'curia' } },
          narration: 'The soldiers march you straight from the Senate House steps to the prison next door. You had no idea it was so close.',
        },
        {
          if: { choice: { jailedFrom: 'treason' } },
          narration: '“Imperium peto” doesn’t mean “I’m looking for the emperor.” It means “I am seeking supreme power”, which is treason on the steps of the Senate House. The soldiers march you to the prison next door. Imperator = emperor. Imperium = power.',
        },
        {
          if: { choice: { jailedFrom: 'palace' } },
          narration: 'The Praetorians do not take you to the ordinary prison. They take you to the Tullianum, and lower you on a rope through a hole in the floor into Rome’s deepest, darkest cell.',
        },
      ],
      continueText: 'Stumble into the dark',
      next: 'jailer',
    },

    jailer: {
      speaker: 'jailer',
      narration: 'An old jailer with a ring of iron keys peers at you through the bars and grins.',
      latin: 'Hodie hic manebis. Aquam et panem habebis. Clama, si vis: nemo te audit!',
      translation: 'Today you will stay here. You will have water and bread. Shout if you like: nobody can hear you!',
      vocab: [['hodie', 'today'], ['manebis', 'you will stay (future)'], ['aquam', 'water'], ['clama', 'shout!'], ['nemo', 'nobody'], ['audit', 'hears']],
      variants: [
        {
          if: { choice: { jailedFrom: 'palace' } },
          narration: 'Far above, a face appears at the hole in the ceiling: an old jailer with a ring of iron keys.',
          latin: 'Hic inimici Romae manent. Clama, si vis: nemo te servabit!',
          translation: 'The enemies of Rome stay here. Shout if you like: nobody will save you!',
          vocab: [['inimici', 'enemies'], ['manent', 'stay, remain'], ['clama', 'shout!'], ['nemo', 'nobody'], ['servabit', 'will save (future)']],
        },
      ],
      continueText: 'Sit down on the cold straw',
      next: 'cell',
    },

    cell: {
      ending: {
        id: 'prison',
        type: 'defeat',
        title: 'In Carcere',
        subtitle: 'In Prison',
        text: [
          'The iron door slams. Somewhere in the dark, water drips.',
          'Study the lines below. Next class, you’ll try this chapter again.',
        ],
      },
      variants: [
        {
          if: { choice: { jailedFrom: 'palace' } },
          ending: {
            id: 'prison',
            type: 'defeat',
            title: 'In Tulliano',
            subtitle: 'In the Tullianum',
            text: [
              'The hole above you closes with a grinding of stone. In the Tullianum, there is no light at all.',
              'So close to the emperor! Study the lines below. Next class, you’ll try again.',
            ],
          },
        },
      ],
    },
  },
};
