// Chapters group scenes and label the top bar. Scenes refer to these by id.

export const chapters = {
  outskirts: { numeral: 'I', latin: 'Extra Urbem', english: 'Outside the City' },
  gate: { numeral: 'II', latin: 'Porta Urbis', english: 'The City Gate' },
  forum: { numeral: 'III', latin: 'Forum', english: 'The Marketplace' },
  smith: { numeral: 'IV', latin: 'Officina Fabri', english: 'The Blacksmith' },
  patron: { numeral: 'V', latin: 'Domus Divitis', english: 'A Wealthy House' },
  senator: { numeral: 'VI', latin: 'Senator', english: 'The Senator' },
  palace: { numeral: 'VII', latin: 'Palatium', english: 'The Palace' },
  emperor: { numeral: 'VIII', latin: 'Imperator', english: 'The Emperor' },
  // The epilogue has no quiz of its own, so its endings review Chapter VIII's mistakes.
  epilogue: { numeral: 'IX', latin: 'Epilogus', english: 'The Journey Home', keepsMistakes: true },

};
