import { handle } from '@hono/node-server/vercel';
import * as SE from '@zypher-game/secret-engine';
import { Hono } from 'hono';
import type { PageConfig } from 'next';

import type { Key } from '~/types/zypher';

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

const app = new Hono().basePath('/api');

app.get('/hello', (c) => {
  const key = SE.generate_key() as Key;

  console.log(key);
  return c.json(key);
});

// eslint-disable-next-line import/no-default-export -- required
export default handle(app);
