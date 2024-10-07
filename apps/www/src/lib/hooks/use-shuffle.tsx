import { useLocalStorage } from 'usehooks-ts';

import { generateKey } from '../shuffle';

import type { Key } from '~/types/zypher';

export const useShuffle = () => {
  const [keys, setKeys] = useLocalStorage<Record<string, Key>>('keys', {});

  const getKey = async (address: string) => {
    let key;
    key = keys[address];
    if (!key) {
      key = await generateKey();
      const newKeys = keys;
      newKeys[address] = key;
      setKeys(newKeys);
    }
    return key;
  };
  return { getKey };
};
