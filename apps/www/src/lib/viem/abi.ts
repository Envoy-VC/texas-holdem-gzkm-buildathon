export const GAME_FACTORY_ABI = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: '_games',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_nextGameId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createGame',
    inputs: [
      { name: 'salt', type: 'bytes32', internalType: 'bytes32' },
      { name: '_revealVerifier', type: 'address', internalType: 'address' },
      { name: '_shuffleVerifier', type: 'address', internalType: 'address' },
      {
        name: '_initialPlayer',
        type: 'tuple',
        internalType: 'struct Player',
        components: [
          { name: 'addr', type: 'address', internalType: 'address' },
          {
            name: 'publicKey',
            type: 'tuple',
            internalType: 'struct Point',
            components: [
              { name: 'x', type: 'uint256', internalType: 'uint256' },
              { name: 'y', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getGameByteCode',
    inputs: [
      { name: '_revealVerifier', type: 'address', internalType: 'address' },
      { name: '_shuffleVerifier', type: 'address', internalType: 'address' },
      {
        name: '_initialPlayer',
        type: 'tuple',
        internalType: 'struct Player',
        components: [
          { name: 'addr', type: 'address', internalType: 'address' },
          {
            name: 'publicKey',
            type: 'tuple',
            internalType: 'struct Point',
            components: [
              { name: 'x', type: 'uint256', internalType: 'uint256' },
              { name: 'y', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    stateMutability: 'pure',
  },
  { type: 'error', name: 'Create2EmptyBytecode', inputs: [] },
  { type: 'error', name: 'Create2FailedDeployment', inputs: [] },
  {
    type: 'error',
    name: 'Create2InsufficientBalance',
    inputs: [
      { name: 'balance', type: 'uint256', internalType: 'uint256' },
      { name: 'needed', type: 'uint256', internalType: 'uint256' },
    ],
  },
] as const;

export const GAME_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_revealVerifier', type: 'address', internalType: 'address' },
      { name: '_shuffleVerifier', type: 'address', internalType: 'address' },
      {
        name: '_initialPlayer',
        type: 'tuple',
        internalType: 'struct Player',
        components: [
          { name: 'addr', type: 'address', internalType: 'address' },
          {
            name: 'publicKey',
            type: 'tuple',
            internalType: 'struct Point',
            components: [
              { name: 'x', type: 'uint256', internalType: 'uint256' },
              { name: 'y', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: '_bets',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_communityCards',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_currentRound',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'enum GameRound' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_gameStarted',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_highestBet',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_isFolded',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_isPlayer',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_nextBet',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_nextCard',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_playerCards',
    inputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_players',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'addr', type: 'address', internalType: 'address' },
      {
        name: 'publicKey',
        type: 'tuple',
        internalType: 'struct Point',
        components: [
          { name: 'x', type: 'uint256', internalType: 'uint256' },
          { name: 'y', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_revealTokens',
    inputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [
      { name: 'player', type: 'address', internalType: 'address' },
      {
        name: 'token',
        type: 'tuple',
        internalType: 'struct Point',
        components: [
          { name: 'x', type: 'uint256', internalType: 'uint256' },
          { name: 'y', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_shuffled',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_totalPlayers',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: '_totalShuffles',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addMultipleRevealTokens',
    inputs: [
      { name: 'indexes', type: 'uint8[]', internalType: 'uint8[]' },
      {
        name: 'revealTokens',
        type: 'tuple[]',
        internalType: 'struct Shuffle.RevealToken[]',
        components: [
          { name: 'player', type: 'address', internalType: 'address' },
          {
            name: 'token',
            type: 'tuple',
            internalType: 'struct Point',
            components: [
              { name: 'x', type: 'uint256', internalType: 'uint256' },
              { name: 'y', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addRevealToken',
    inputs: [
      { name: 'index', type: 'uint8', internalType: 'uint8' },
      {
        name: 'revealToken',
        type: 'tuple',
        internalType: 'struct Shuffle.RevealToken',
        components: [
          { name: 'player', type: 'address', internalType: 'address' },
          {
            name: 'token',
            type: 'tuple',
            internalType: 'struct Point',
            components: [
              { name: 'x', type: 'uint256', internalType: 'uint256' },
              { name: 'y', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
      { name: 'proof', type: 'uint256[8]', internalType: 'uint256[8]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'chooseCards',
    inputs: [{ name: 'cards', type: 'uint8[3]', internalType: 'uint8[3]' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deck',
    inputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'declareWinner',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'fold',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'gameKey',
    inputs: [],
    outputs: [
      { name: 'x', type: 'uint256', internalType: 'uint256' },
      { name: 'y', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCommunityCards',
    inputs: [],
    outputs: [{ name: '', type: 'uint8[5]', internalType: 'uint8[5]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPlayer',
    inputs: [{ name: 'addr', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Player',
        components: [
          { name: 'addr', type: 'address', internalType: 'address' },
          {
            name: 'publicKey',
            type: 'tuple',
            internalType: 'struct Point',
            components: [
              { name: 'x', type: 'uint256', internalType: 'uint256' },
              { name: 'y', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPlayerCards',
    inputs: [{ name: 'player', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint8[5]', internalType: 'uint8[5]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPotAmount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRevealTokens',
    inputs: [{ name: 'index', type: 'uint8', internalType: 'uint8' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct Point[]',
        components: [
          { name: 'x', type: 'uint256', internalType: 'uint256' },
          { name: 'y', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initShuffle',
    inputs: [
      {
        name: '_publicKeyCommitment',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
      {
        name: '_oldDeck',
        type: 'uint256[4][52]',
        internalType: 'uint256[4][52]',
      },
      {
        name: '_newDeck',
        type: 'uint256[4][52]',
        internalType: 'uint256[4][52]',
      },
      { name: '_proof', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'joinGame',
    inputs: [
      {
        name: '_player',
        type: 'tuple',
        internalType: 'struct Player',
        components: [
          { name: 'addr', type: 'address', internalType: 'address' },
          {
            name: 'publicKey',
            type: 'tuple',
            internalType: 'struct Point',
            components: [
              { name: 'x', type: 'uint256', internalType: 'uint256' },
              { name: 'y', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'nextPlayer',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Player',
        components: [
          { name: 'addr', type: 'address', internalType: 'address' },
          {
            name: 'publicKey',
            type: 'tuple',
            internalType: 'struct Point',
            components: [
              { name: 'x', type: 'uint256', internalType: 'uint256' },
              { name: 'y', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'placeBet',
    inputs: [{ name: '_amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'publicKeyCommitment',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'revealCard',
    inputs: [{ name: 'index', type: 'uint8', internalType: 'uint8' }],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'revealMultipleCards',
    inputs: [{ name: 'indexes', type: 'uint8[5]', internalType: 'uint8[5]' }],
    outputs: [{ name: '', type: 'uint8[5]', internalType: 'uint8[5]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'revealVerifier',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract ZgRevealVerifier' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'shuffle',
    inputs: [
      {
        name: '_newDeck',
        type: 'uint256[4][52]',
        internalType: 'uint256[4][52]',
      },
      { name: '_proof', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'shuffleVerifier',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'contract ZgShuffleVerifier' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'startGame',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'winner',
    inputs: [],
    outputs: [
      { name: 'addr', type: 'address', internalType: 'address' },
      {
        name: 'publicKey',
        type: 'tuple',
        internalType: 'struct Point',
        components: [
          { name: 'x', type: 'uint256', internalType: 'uint256' },
          { name: 'y', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  { type: 'error', name: 'AlreadyAPlayer', inputs: [] },
  { type: 'error', name: 'AlreadyFolded', inputs: [] },
  { type: 'error', name: 'AlreadyShuffled', inputs: [] },
  { type: 'error', name: 'DuplicateCommunityCard', inputs: [] },
  { type: 'error', name: 'GameAlreadyStarted', inputs: [] },
  { type: 'error', name: 'GameEnded', inputs: [] },
  { type: 'error', name: 'GameNotEnded', inputs: [] },
  { type: 'error', name: 'GameNotStarted', inputs: [] },
  { type: 'error', name: 'InvalidBetAmount', inputs: [] },
  { type: 'error', name: 'InvalidBetSequence', inputs: [] },
  { type: 'error', name: 'LastRound', inputs: [] },
  { type: 'error', name: 'NotACommunityCard', inputs: [] },
  { type: 'error', name: 'NotAPlayer', inputs: [] },
  { type: 'error', name: 'NotEnoughPlayers', inputs: [] },
  { type: 'error', name: 'NotShuffled', inputs: [] },
  { type: 'error', name: 'PlayerFolded', inputs: [] },
  { type: 'error', name: 'RevealTokenAlreadyExists', inputs: [] },
  { type: 'error', name: 'RevealTokenVerificationError', inputs: [] },
  { type: 'error', name: 'ShuffleVerificationError', inputs: [] },
  { type: 'error', name: 'WinnerAlreadyDeclared', inputs: [] },
] as const;
