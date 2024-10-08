'use client';

import { useRouter } from 'next/navigation';

import React, { useState } from 'react';

import { useShuffle } from '~/lib/hooks';
import { errorHandler } from '~/lib/utils';
import { gameConfig, gameFactoryConfig, wagmiConfig } from '~/lib/viem';

import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import GoldBG from 'public/gold-bg.webp';
import PokerBG from 'public/poker-bg.jpg';
import { toast } from 'sonner';
import { isAddress, keccak256 } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { Button } from './ui/button';
import { Input } from './ui/input';

export const CreateGame = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { getKey } = useShuffle();
  const router = useRouter();

  const [gameId, setGameId] = useState<string>('');

  const onCreate = async () => {
    const id = toast.loading('Creating Game...');
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
        description: `ID: ${gameAddress}`,
        id,
      });

      router.push(`/game/${gameAddress}`);
    } catch (error) {
      console.log(error);
      toast.error(errorHandler(error), { id });
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
      <DialogContent>
        <div
          className='fixed left-[50%] top-[50%] z-50 flex translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[6rem] border bg-background p-3'
          style={{
            backgroundImage: `url(${GoldBG.src})`,
            objectFit: 'cover',
          }}
        >
          <div
            className='flex min-h-[20rem] w-full min-w-[36rem] flex-col items-center gap-4 rounded-[5rem] p-8'
            style={{
              backgroundImage: `url(${PokerBG.src})`,
              objectFit: 'cover',
            }}
          >
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
          </div>
        </div>
      </DialogContent>
      <DialogTitle />
    </Dialog>
  );
};
