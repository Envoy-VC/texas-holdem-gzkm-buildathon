'use client';

import React, { useMemo } from 'react';

import { firstShuffle, shuffle } from '~/lib/shuffle';
import { errorHandler } from '~/lib/utils';
import { gameConfig, wagmiConfig } from '~/lib/viem';
import { getDeck, getGameKey } from '~/lib/viem/actions';

import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { toast } from 'sonner';
import { hexToBigInt, zeroAddress } from 'viem';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import type { OverlayProps } from '~/types';

import { Overlay } from '../overlay';
import { Button } from '../ui/button';

import { RefreshCcw } from 'lucide-react';

export const ShuffleOverlay = ({ contractAddress, refresh }: OverlayProps) => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...gameConfig,
        address: contractAddress,
        functionName: '_totalPlayers',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: '_totalShuffles',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: '_shuffled',
        args: [address ?? zeroAddress],
      },
    ],
  });

  const { didPlayerShuffle, playersShuffled, totalPlayers } = useMemo(() => {
    console.log(data);
    const totalPlayers = data?.[0].result ?? 1;
    const totalShuffles = Number(data?.[1].result ?? 0);
    const shuffled = data?.[2].result ?? false;

    const didAllShuffle = totalShuffles === totalPlayers;

    return {
      didAllShuffle,
      didPlayerShuffle: shuffled,
      playersShuffled: totalShuffles,
      totalPlayers,
    };
  }, [data]);

  const onShuffle = async () => {
    const id = toast.loading('Shuffling Cards...');
    try {
      const gameKey = await getGameKey(contractAddress);
      const totalShuffles = await readContract(wagmiConfig, {
        ...gameConfig,
        address: contractAddress,
        functionName: '_totalShuffles',
      });

      if (Number(totalShuffles) === 0) {
        const res = await firstShuffle(gameKey);
        const pkc = res.pkc.map((p) => hexToBigInt(p, { size: 32 }));
        const newDeck = res.newDeck.map((o) =>
          o.map((i) => hexToBigInt(i, { size: 32 }))
        );

        const simulated = await simulateContract(wagmiConfig, {
          ...gameConfig,
          address: contractAddress,
          functionName: 'initShuffle',
          // @ts-expect-error safe as we have 52 elements in each
          args: [pkc, newDeck],
        });
        const hash = await writeContractAsync(simulated.request);
        await waitForTransactionReceipt(wagmiConfig, { hash });
      } else {
        const oldDeck = await getDeck(contractAddress);

        // @ts-expect-error safe as we have 4 elements in each
        const res = await shuffle(oldDeck, gameKey);
        console.log(res);
        const newDeck = res.shuffled.cards.map((o) =>
          o.map((i) => hexToBigInt(i))
        );
        const simulated = await simulateContract(wagmiConfig, {
          ...gameConfig,
          address: contractAddress,
          functionName: 'shuffle',
          // @ts-expect-error safe as we have 52 elements
          args: [newDeck],
        });
        const hash = await writeContractAsync(simulated.request);
        await waitForTransactionReceipt(wagmiConfig, { hash });
      }

      if (refresh) {
        await refresh();
      }
      toast.success('Cards Shuffled Successfully!', { id });
    } catch (error) {
      console.log(error);
      toast.error(errorHandler(error), { id });
    }
  };

  return (
    <Overlay>
      <div className='w-full'>
        <div className='flex flex-row items-center justify-center gap-2 text-center font-poker text-4xl'>
          Shuffle Stage
          <Button
            className='h-10 w-10 !p-0 font-sans'
            variant='link'
            onClick={async () => await refetch()}
          >
            <RefreshCcw size={24} />
          </Button>
        </div>
        <div className='py-5 text-center font-poker text-5xl'>
          {playersShuffled} / {totalPlayers}
        </div>{' '}
        <div className='flex w-full items-center justify-center font-poker text-3xl'>
          {!didPlayerShuffle ? (
            <Button className='font-sans' onClick={onShuffle}>
              Shuffle Cards
            </Button>
          ) : (
            <>Waiting for other players...</>
          )}
        </div>
      </div>
    </Overlay>
  );
};
