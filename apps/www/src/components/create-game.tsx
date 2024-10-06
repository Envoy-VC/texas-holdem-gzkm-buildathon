'use client';

import { useRouter } from 'next/navigation';

import React, { useState } from 'react';

import { useShuffle } from '~/lib/hooks';
import { errorHandler } from '~/lib/utils';
import { gameConfig, gameFactoryConfig, wagmiConfig } from '~/lib/viem';

import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'sonner';
import { isAddress, keccak256 } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import { Dialog, DialogTitle, DialogTrigger } from '~/components/ui/dialog';

import { Overlay } from './overlay';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const CreateGame = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { getKey } = useShuffle();
  const router = useRouter();

  const [gameId, setGameId] = useState<string>('');

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

      router.push(`/game/${gameAddress}`);
    } catch (error) {
      console.log(error);
      toast.error(errorHandler(error));
    }
  };

  const onJoin = async () => {
    const id = toast.loading('Joining Game...');
    try {
      if (!address) {
        throw new Error('Please connect wallet.');
      }
      const isValidId = isAddress(gameId);
      if (!isValidId) {
        throw new Error('Invalid game ID.');
      }
      const contractAddress = gameId;
      const key = await getKey(address);
      const hash = await writeContractAsync({
        ...gameConfig,
        address: contractAddress,
        functionName: 'joinGame',
        args: [
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
      toast.success('Game Joined Successfully!', { id });
      router.push(`/game/${contractAddress}`);
    } catch (error) {
      console.log(error);
      toast.error(errorHandler(error));
    }
  };
  return (
    <Dialog>
      <DialogTrigger>Create or Join a Game</DialogTrigger>
      <DialogTitle />
      <Overlay className='flex flex-col items-center gap-3'>
        <div className='font-poker text-5xl'>Create or Join a Game</div>
        <Button onClick={onCreate}>Create Game</Button>
        <div>OR</div>
        <div className='flex flex-row items-center gap-2'>
          <Input
            className='w-[24rem] translate-x-12 !rounded-3xl border-none outline-none'
            placeholder='Enter Game ID'
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <Button className='-translate-x-12 rounded-3xl' onClick={onJoin}>
            Join Game
          </Button>
        </div>
      </Overlay>
    </Dialog>
  );
};
