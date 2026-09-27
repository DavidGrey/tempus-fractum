// Everything the player can carry. Ids are used in addItems / hasItems.
//
//   latin        Name shown in the bag (and in "Received:" messages).
//   english      Meaning.
//   description  One or two sentences; hints at why it might matter later.
//   image        Icon art (placeholder shown until it exists).

export const items = {
  'broken-hinge': {
    latin: 'cardo fractus',
    english: 'broken hinge',
    description: 'The snapped bronze hinge from your time machine’s door. A smith would need to see this.',
    image: 'assets/objects/broken-hinge.webp',
  },
  bread: {
    latin: 'panis',
    english: 'bread',
    description: 'A round, flat loaf from the farmer. Someone hungry might be glad of it.',
    image: 'assets/objects/bread.webp',
  },
  bone: {
    latin: 'os',
    english: 'bone',
    description: 'An old soup bone, given to you by a farmer who briefly believed you were a dog.',
    image: 'assets/objects/bone.webp',
  },
  cloak: {
    latin: 'pallium',
    english: 'cloak',
    description: 'A rough wool cloak. Over your strange clothes, you look almost like a Roman.',
    image: 'assets/objects/cloak.webp',
  },
  denarii: {
    latin: 'denarii',
    english: 'silver coins',
    description: 'Roman silver coins, from selling your wristwatch to a merchant who thought it was magic.',
    image: 'assets/objects/coins.webp',
  },
  poma: {
    latin: 'poma',
    english: 'apples',
    description: 'A few crisp apples from the fruit stall. Someone hungry would be glad of them.',
    image: 'assets/objects/apples.webp',
  },
  'smith-token': {
    latin: 'tessera fabri',
    english: 'the smith’s token',
    description: 'A small bronze disc stamped with a hammer: the mark of Titus the smith. Aurelius’s household will recognise it.',
    image: 'assets/objects/smith-token.webp',
  },
  anulus: {
    latin: 'anulus',
    english: 'Aurelius’s ring',
    description: 'A heavy gold signet ring. Aurelius uses it to seal his letters, and he is desperate to have it back.',
    image: 'assets/objects/ring.webp',
  },
  epistula: {
    latin: 'epistula',
    english: 'a sealed letter',
    description: 'A letter from Aurelius to Senator Cornelius, sealed with the imprint of Aurelius’s ring.',
    image: 'assets/objects/letter.webp',
  },
  'senator-tablet': {
    latin: 'tabula',
    english: 'the senator’s sealed tablet',
    description: 'A wax writing tablet from Senator Cornelius, stamped with his seal. The Praetorian Guard must let its bearer into the palace.',
    image: 'assets/objects/tablet.webp',
  },
};
