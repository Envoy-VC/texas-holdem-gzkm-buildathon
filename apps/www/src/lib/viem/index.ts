import AddressConfig from 'public/config.json';
import { opBNBTestnet } from 'viem/chains';
import {
  type Config,
  cookieStorage,
  createConfig,
  createStorage,
  http,
} from 'wagmi';
import { walletConnect } from 'wagmi/connectors';
import { env } from '~/env';

import { GAME_ABI, GAME_FACTORY_ABI } from './abi';

export const projectId = env.NEXT_PUBLIC_WALLETCONNECT_ID;

const metadata = {
  name: 'Web3 Turbo Starter',
  description: 'Web3 starter kit with turborepo, wagmi, and Next.js',
  url: 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const wagmiConfig: Config = createConfig({
  chains: [opBNBTestnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [walletConnect({ projectId, metadata, showQrModal: false })],
  transports: {
    [opBNBTestnet.id]: http(),
  },
});

export const gameFactoryConfig = {
  abi: GAME_FACTORY_ABI,
  address: AddressConfig.GAME_FACTORY_ADDRESS as `0x${string}`,
} as const;

export const gameConfig = {
  abi: GAME_ABI,
} as const;
