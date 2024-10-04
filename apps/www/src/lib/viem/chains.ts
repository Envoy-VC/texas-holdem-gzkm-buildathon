import { defineChain } from 'viem';

export const opBNBTestnetFork = defineChain({
  id: 5611,
  name: 'opBNB Testnet Forked',
  nativeCurrency: { name: 'Binance Coin', symbol: 'tBNB', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  testnet: true,
  blockExplorers: {
    default: {
      name: 'Block Explorer',
      url: 'https://opbnb-testnet.bscscan.com',
    },
  },
});

export const opBNBTestnet = defineChain({
  id: 5611,
  name: 'opBNB Testnet',
  nativeCurrency: { name: 'Binance Coin', symbol: 'tBNB', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://opbnb-testnet-rpc.bnbchain.org'],
    },
  },
  testnet: true,
  blockExplorers: {
    default: {
      name: 'Block Explorer',
      url: 'https://opbnb-testnet.bscscan.com',
    },
  },
});
