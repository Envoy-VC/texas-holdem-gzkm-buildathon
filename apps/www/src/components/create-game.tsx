'use client';

import React from 'react';

import { useShuffle } from '~/lib/hooks';
import { errorHandler } from '~/lib/utils';
import { gameFactoryConfig, wagmiConfig } from '~/lib/viem';

import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'sonner';
import { keccak256 } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { Button } from './ui/button';

export const CreateGame = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { getKey } = useShuffle();

  const onCreate = async () => {
    try {
      if (!address) {
        throw new Error('Please connect wallet.');
      }
      const salt = keccak256(Buffer.from(crypto.randomUUID()));
      const revealVerifier = '0x8d084e5c212834456c07Cef2c1e2a258fF04b5eb';
      const shuffleVerifier = '0xfbDF4217a3959cE4D3c39b240959c800e3c9E640';
      console.log(salt);
      const key = await getKey(address);
      console.log(key);

      const hash = await writeContractAsync({
        ...gameFactoryConfig,
        functionName: 'createGame',
        args: [
          salt,
          revealVerifier,
          shuffleVerifier,
          {
            addr: address,
            publicKey: {
              x: BigInt(key.pkxy[0]),
              y: BigInt(key.pkxy[1]),
            },
          },
        ],
      });

      await waitForTransactionReceipt(wagmiConfig, { hash });
      const gameId = await readContract(wagmiConfig, {
        ...gameFactoryConfig,
        functionName: '_nextGameId',
        args: [],
      });
      const gameAddress = await readContract(wagmiConfig, {
        ...gameFactoryConfig,
        functionName: '_games',
        args: [BigInt(Number(gameId) - 1)],
      });
      console.log(gameAddress);
      toast.success('Game Created Successfully!', {
        description: `Id: ${gameAddress}`,
      });
    } catch (error) {
      console.log(error);
      toast.error(errorHandler(error));
    }
  };
  return (
    <Dialog>
      <DialogTrigger>Create or Join a Game</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle />
          <DialogDescription>
            <Button onClick={onCreate}>Create Game</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
