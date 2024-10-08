import { handle } from '@hono/node-server/vercel';
import * as SE from '@zypher-game/secret-engine';
import { Hono } from 'hono';
import type { PageConfig } from 'next';
import { type Hex } from 'viem';

export const config: PageConfig = {
  maxDuration: 60,
  api: {
    bodyParser: false,
  },
};

const DECK_SIZE = 52;

const app = new Hono().basePath('/api');

app.get('/generate-key', (c) => {
  const key = SE.generate_key();
  return c.json(key);
});

app.post('/get-masked-cards', async (c) => {
  const body = (await c.req.json()) as unknown;
  const gameKey = (body as { gameKey: [string, string] }).gameKey;

  SE.init_prover_key(DECK_SIZE);
  const gameKeyCompressed = SE.public_compress([gameKey[0], gameKey[1]]);
  const pkc = SE.refresh_joint_key(gameKeyCompressed, DECK_SIZE);
  const maskedDeck = SE.init_masked_cards(gameKeyCompressed, DECK_SIZE);
  const oldDeck = maskedDeck.map((masked) => masked.card);

  return c.json({
    pkc,
    maskedCards: oldDeck,
  });
});

app.post('/first-shuffle', async (c) => {
  const body = (await c.req.json()) as unknown;
  const b = body as {
    gameKey: [string, string];
    maskedCards: [Hex, Hex, Hex, Hex][];
  };
  const gameKey = b.gameKey;

  SE.init_prover_key(DECK_SIZE);
  const gameKeyCompressed = SE.public_compress([gameKey[0], gameKey[1]]);
  SE.refresh_joint_key(gameKeyCompressed, DECK_SIZE);

  const firstShuffled = SE.shuffle_cards(gameKeyCompressed, b.maskedCards);
  const newDeck = firstShuffled.cards;

  return c.json({
    newDeck,
    proof: firstShuffled.proof,
  });
});

app.post('/shuffle', async (c) => {
  const body = (await c.req.json()) as unknown;
  const b = body as {
    oldDeck: [Hex, Hex, Hex, Hex][];
    gameKey: [Hex, Hex];
  };

  const gameKeyCompressed = SE.public_compress([b.gameKey[0], b.gameKey[1]]);
  const secondShuffled = SE.shuffle_cards(gameKeyCompressed, b.oldDeck);
  console.log(secondShuffled);

  return c.json({ shuffled: secondShuffled });
});

app.post('/get-reveal-token', async (c) => {
  const body = (await c.req.json()) as unknown;
  const b = body as {
    card: [Hex, Hex, Hex, Hex];
    sk: Hex;
  };

  const revealKey = SE.reveal_card(b.sk, b.card);

  return c.json(revealKey);
});

app.post('/unmask-card', async (c) => {
  try {
    const body = (await c.req.json()) as unknown;
    const b = body as {
      card: [Hex, Hex, Hex, Hex];
      sk: Hex;
      tokens: [Hex, Hex][];
    };

    const result = SE.unmask_card(b.sk, b.card, b.tokens);

    return c.json({ result });
  } catch (error) {
    console.log(error);
  }
});

app.post('/get-reveal-tokens', async (c) => {
  const body = (await c.req.json()) as unknown;
  const b = body as {
    cards: [Hex, Hex, Hex, Hex][];
    sk: Hex;
  };

  const revealKeys = [];
  for (const card of b.cards) {
    revealKeys.push(SE.reveal_card(b.sk, card));
  }

  return c.json({ revealKeys });
});

app.post('/unmask-cards', async (c) => {
  const body = (await c.req.json()) as unknown;
  const b = body as {
    cards: [Hex, Hex, Hex, Hex][];
    sk: Hex;
    tokens: [Hex, Hex][][];
  };

  const result: number[] = [];

  console.log(b);

  for (let i = 0; i < b.cards.length; i++) {
    const tokens = b.tokens[i];
    const unmasked = SE.unmask_card(b.sk, b.cards[i], tokens);
    console.log('Unmasked: ', unmasked);
    result.push(unmasked);
  }

  return c.json({ result });
});

// eslint-disable-next-line import/no-default-export -- required
export default handle(app);
