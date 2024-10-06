'use client';

import React, { useMemo } from 'react';

import { gameConfig } from '~/lib/viem';

import { zeroAddress } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';
import type { OverlayProps } from '~/types';

import { Overlay } from '../overlay';
import { Button } from '../ui/button';

export const ShuffleOverlay = ({ contractAddress }: OverlayProps) => {
  const { address } = useAccount();

  const { data } = useReadContracts({
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

  return (
    <Overlay>
      <div className='w-full'>
        <div className='text-center font-poker text-4xl'>Shuffle Stage</div>
        <div className='py-5 text-center font-poker text-5xl'>
          {playersShuffled} / {totalPlayers}
        </div>{' '}
        <div className='flex w-full items-center justify-center font-poker text-3xl'>
          {!didPlayerShuffle ? (
            <Button className='font-sans'>Shuffle Cards</Button>
          ) : (
            <>Waiting for other players...</>
          )}
        </div>
      </div>
    </Overlay>
  );
};
