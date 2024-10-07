export const getCurrentRound = (num: number) => {
  if (num === 0) return 'Ante';
  if (num === 1) return 'Pre-Flop';
  if (num === 2) return 'Flop';
  if (num === 3) return 'Turn';
  if (num === 4) return 'River';
  return 'End';
};

const suits: Record<number, string> = {
  0: 'SPADE',
  1: 'HEART',
  2: 'DIAMOND',
  3: 'CLUB',
};

const ranks: Record<number, string> = {
  0: '2',
  1: '3',
  2: '4',
  3: '5',
  4: '6',
  5: '7',
  6: '8',
  7: '9',
  8: '10',
  9: '11',
  10: '12',
  11: '13',
  12: '1',
};

export const getPokerCardImage = (id: number) => {
  if (id === -1) {
    return '/cards/BACK.svg';
  }
  const suit = Math.floor(id / 13);
  const rank = id % 13;

  return `/cards/${suits[suit] ?? ''}-${ranks[rank] ?? ''}.svg`;
};
