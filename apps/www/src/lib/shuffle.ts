import type { Hex, Key } from '~/types/zypher';

export const generateKey = async () => {
  return fetch('/api/generate-key', {
    method: 'GET',
  }).then(async (res) => (await res.json()) as Key);
};

export const getMaskedCads = async (gameKey: [string, string]) => {
  return fetch('/api/get-masked-cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameKey }),
  }).then(
    async (res) =>
      (await res.json()) as {
        pkc: Hex[];
        maskedCards: [Hex, Hex, Hex, Hex][];
      }
  );
};

export const firstShuffle = async (
  gameKey: [string, string],
  maskedCards: [Hex, Hex, Hex, Hex][]
) => {
  return fetch('/api/first-shuffle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameKey, maskedCards }),
  }).then(
    async (res) =>
      (await res.json()) as {
        newDeck: [Hex, Hex, Hex, Hex][];
        proof: Hex;
      }
  );
};

export const shuffle = async (
  oldDeck: [Hex, Hex, Hex, Hex][],
  gameKey: [Hex, Hex]
) => {
  return fetch('/api/shuffle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ oldDeck, gameKey }),
  }).then(
    async (res) =>
      (await res.json()) as {
        shuffled: {
          cards: [Hex, Hex, Hex, Hex][];
          proof: Hex;
        };
      }
  );
};

export const getRevealKey = async (card: [Hex, Hex, Hex, Hex], sk: Hex) => {
  return fetch('/api/get-reveal-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ card, sk }),
  }).then(
    async (res) =>
      (await res.json()) as {
        card: [Hex, Hex];
        proof: Hex;
      }
  );
};

export const getRevealKeys = async (cards: [Hex, Hex, Hex, Hex][], sk: Hex) => {
  return fetch('/api/get-reveal-tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cards, sk }),
  }).then(
    async (res) =>
      (await res.json()) as {
        revealKeys: {
          card: [Hex, Hex];
          proof: Hex;
        }[];
      }
  );
};

export const unmaskCard = async (
  card: [Hex, Hex, Hex, Hex],
  sk: Hex,
  tokens: [Hex, Hex][]
) => {
  return fetch('/api/unmask-card', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ card, sk, tokens }),
  }).then(
    async (res) =>
      (await res.json()) as {
        result: number;
      }
  );
};

export const unmaskCards = async (
  cards: [Hex, Hex, Hex, Hex][],
  sk: Hex,
  tokens: [Hex, Hex][][]
) => {
  return fetch('/api/unmask-cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cards, sk, tokens }),
  }).then(
    async (res) =>
      (await res.json()) as {
        result: number[];
      }
  );
};
