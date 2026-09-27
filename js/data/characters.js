// Every NPC who can appear on stage or speak.
//
//   name    Shown on the nameplate (usually Latin).
//   role    Small English label after the name.
//   names   Optional: a different name once a condition holds (e.g. after he introduces himself).
//   images  Pose name → image path. 'default' is required. Nodes pick a pose with `pose: '…'`.

export const characters = {
  farmer: {
    name: 'Agricola',
    role: 'the farmer',
    names: [{ if: { flags: 'knowsFarmerName' }, name: 'Gaius' }],
    images: {
      default: 'assets/characters/farmer.webp',
      pointing: 'assets/characters/farmer-pointing.webp',
      laughing: 'assets/characters/farmer-laughing.webp',
    },
  },

  guard: {
    name: 'Miles',
    role: 'the gate guard',
    images: {
      default: 'assets/characters/guard.webp',
      blocking: 'assets/characters/guard-blocking.webp',
      laughing: 'assets/characters/guard-laughing.webp',
    },
  },

  // Speaks one line at the gate but never appears on stage, so it needs no images.
  cabbageSeller: {
    name: 'Mercator',
    role: 'a cabbage seller',
  },

  fruitSeller: {
    name: 'Iulia',
    role: 'the fruit seller',
    images: {
      default: 'assets/characters/fruit-seller.webp',
      angry: 'assets/characters/fruit-seller-angry.webp',
    },
  },

  merchant: {
    name: 'Lucius',
    role: 'a merchant',
    images: {
      default: 'assets/characters/merchant.webp',
      amazed: 'assets/characters/merchant-amazed.webp',
    },
  },

  boy: {
    name: 'Puer',
    role: 'a street boy',
    names: [{ if: { any: [{ flags: 'knowsMarcusName' }, { flags: 'heardOfMarcus' }] }, name: 'Marcus' }],
    images: {
      default: 'assets/characters/boy.webp',
      grinning: 'assets/characters/boy-grinning.webp',
    },
  },

  smith: {
    name: 'Titus',
    role: 'the blacksmith',
    images: {
      default: 'assets/characters/smith.webp',
      working: 'assets/characters/smith-working.webp',
      examining: 'assets/characters/smith-examining.webp',
      laughing: 'assets/characters/smith-laughing.webp',
    },
  },

  doorkeeper: {
    name: 'Ianitor',
    role: 'the doorkeeper',
    images: { default: 'assets/characters/doorkeeper.webp' },
  },

  aurelius: {
    name: 'Aurelius',
    role: 'a wealthy Roman',
    images: {
      default: 'assets/characters/aurelius.webp',
      delighted: 'assets/characters/aurelius-delighted.webp',
    },
  },

  cook: {
    name: 'Coquus',
    role: 'the cook',
    images: { default: 'assets/characters/cook.webp' },
  },

  maid: {
    name: 'Syra',
    role: 'a household servant',
    images: { default: 'assets/characters/maid.webp' },
  },

  // Speaks from its cage (a scene prop in the garden), so it needs no character images.
  magpie: {
    name: 'Pica',
    role: 'the magpie',
  },

  senator: {
    name: 'Cornelius',
    role: 'a senator',
    images: {
      default: 'assets/characters/senator.webp',
      amused: 'assets/characters/senator-amused.webp',
      shocked: 'assets/characters/senator-shocked.webp',
    },
  },

  // Game-over scenes. The jailer and the crowd speak but aren't drawn.
  jailer: {
    name: 'Custos',
    role: 'the jailer',
  },

  crowd: {
    name: 'Populus',
    role: 'the crowd',
  },

  lion: {
    name: 'Leo',
    role: 'a lion',
    images: {
      default: 'assets/characters/lion.webp',
      roaring: 'assets/characters/lion-roaring.webp',
    },
  },

  emperor: {
    name: 'Traianus',
    role: 'Emperor of Rome',
    images: {
      default: 'assets/characters/emperor.webp',
      curious: 'assets/characters/emperor-curious.webp',
      laughing: 'assets/characters/emperor-laughing.webp',
      stern: 'assets/characters/emperor-stern.webp',
    },
  },

  praetorian: {
    name: 'Centurio',
    role: 'a Praetorian officer',
    images: {
      default: 'assets/characters/praetorian.webp',
      suspicious: 'assets/characters/praetorian-suspicious.webp',
      approving: 'assets/characters/praetorian-approving.webp',
    },
  },

};
