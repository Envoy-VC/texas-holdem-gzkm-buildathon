import { readContract } from '@wagmi/core';
import { type Hex, hexToBigInt } from 'viem';

import { gameConfig, wagmiConfig } from '.';

export const getDeck = async (gameAddress: `0x${string}`) => {
  const deck = await readContract(wagmiConfig, {
    ...gameConfig,
    address: gameAddress,
    functionName: 'getDeck',
  });
  return deck.map((o) =>
    o.map((i) => {
      const hex = i.toString(16);
      const padded = hex.padStart(64, '0');
      return `0x${padded}`;
    })
  );
};

export const getGameKey = async (gameAddress: `0x${string}`) => {
  const gameKey = await readContract(wagmiConfig, {
    ...gameConfig,
    address: gameAddress,
    functionName: 'gameKey',
  });

  return gameKey.map((i) => {
    const hex = i.toString(16);
    const padded = hex.padStart(64, '0');
    return `0x${padded}`;
  }) as [Hex, Hex];
};

// export const verifyShuffle = async (
//   pkc: bigint[],
//   oldDeck: bigint[][],
//   newDeck: bigint[][],
//   proof: `0x${string}`
// ) => {
//   const inputs: bigint[] = Array<bigint>(52 * 4 * 2).fill(BigInt(0));

//   for (let index = 0; index < 52; index++) {
//     const oldDeckRow = oldDeck[index];
//     const newDeckRow = newDeck[index];

//     inputs[index * 4 + 0] = oldDeckRow[0];
//     inputs[index * 4 + 1] = oldDeckRow[1];
//     inputs[index * 4 + 2] = oldDeckRow[2];
//     inputs[index * 4 + 3] = oldDeckRow[3];

//     inputs[index * 4 + 0 + 208] = newDeckRow[0];
//     inputs[index * 4 + 1 + 208] = newDeckRow[1];
//     inputs[index * 4 + 2 + 208] = newDeckRow[2];
//     inputs[index * 4 + 3 + 208] = newDeckRow[3];
//   }

//   const res = await readContract(wagmiConfig, {
//     abi: [
//       {
//         type: 'function',
//         name: 'verifyShuffle',
//         inputs: [
//           { name: 'proof', type: 'bytes', internalType: 'bytes' },
//           { name: 'inputs', type: 'uint256[]', internalType: 'uint256[]' },
//           {
//             name: 'publicKeyCommitment',
//             type: 'uint256[]',
//             internalType: 'uint256[]',
//           },
//         ],
//         outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
//         stateMutability: 'view',
//       },
//     ],
//     address: '0xfbDF4217a3959cE4D3c39b240959c800e3c9E640',
//     functionName: 'verifyShuffle',
//     args: [proof, inputs, pkc],
//   });
//   console.log(res);
// };

export const revealCardWagmi = async (
  card: [Hex, Hex, Hex, Hex],
  revealTokens: { x: bigint; y: bigint }[]
) => {
  const res = await readContract(wagmiConfig, {
    // prettier-ignore
    abi: [{ "type": "function", "name": "aggregateKeys", "inputs": [{ "name": "publicKeys", "type": "tuple[]", "internalType": "struct Point[]", "components": [{ "name": "x", "type": "uint256", "internalType": "uint256" }, { "name": "y", "type": "uint256", "internalType": "uint256" }] }], "outputs": [{ "name": "gameKey", "type": "tuple", "internalType": "struct Point", "components": [{ "name": "x", "type": "uint256", "internalType": "uint256" }, { "name": "y", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" }, { "type": "function", "name": "unmaskCard", "inputs": [{ "name": "card", "type": "tuple", "internalType": "struct MaskedCard", "components": [{ "name": "e2X", "type": "uint256", "internalType": "uint256" }, { "name": "e2Y", "type": "uint256", "internalType": "uint256" }, { "name": "e1X", "type": "uint256", "internalType": "uint256" }, { "name": "e1Y", "type": "uint256", "internalType": "uint256" }] }, { "name": "revealToken", "type": "tuple[]", "internalType": "struct Point[]", "components": [{ "name": "x", "type": "uint256", "internalType": "uint256" }, { "name": "y", "type": "uint256", "internalType": "uint256" }] }], "outputs": [{ "name": "cardIndex", "type": "uint8", "internalType": "uint8" }], "stateMutability": "view" }, { "type": "function", "name": "verifyReveal", "inputs": [{ "name": "pk", "type": "tuple", "internalType": "struct Point", "components": [{ "name": "x", "type": "uint256", "internalType": "uint256" }, { "name": "y", "type": "uint256", "internalType": "uint256" }] }, { "name": "masked", "type": "tuple", "internalType": "struct MaskedCard", "components": [{ "name": "e2X", "type": "uint256", "internalType": "uint256" }, { "name": "e2Y", "type": "uint256", "internalType": "uint256" }, { "name": "e1X", "type": "uint256", "internalType": "uint256" }, { "name": "e1Y", "type": "uint256", "internalType": "uint256" }] }, { "name": "reveal", "type": "tuple", "internalType": "struct Point", "components": [{ "name": "x", "type": "uint256", "internalType": "uint256" }, { "name": "y", "type": "uint256", "internalType": "uint256" }] }, { "name": "proofBytes", "type": "bytes", "internalType": "bytes" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "function", "name": "verifyRevealWithSnark", "inputs": [{ "name": "pi", "type": "uint256[6]", "internalType": "uint256[6]" }, { "name": "proof", "type": "uint256[8]", "internalType": "uint256[8]" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }],
    address: '0x8d084e5c212834456c07Cef2c1e2a258fF04b5eb',
    functionName: 'unmaskCard',
    args: [
      {
        e2X: hexToBigInt(card[0]),
        e2Y: hexToBigInt(card[1]),
        e1X: hexToBigInt(card[2]),
        e1Y: hexToBigInt(card[3]),
      },
      revealTokens,
    ],
  });

  console.log(res);
};
