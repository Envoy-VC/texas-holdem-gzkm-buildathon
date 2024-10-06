import React from 'react';

import { errorHandler } from '~/lib/utils';
import { gameConfig, wagmiConfig } from '~/lib/viem';

import { waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'sonner';
import { useReadContract, useWriteContract } from 'wagmi';
import type { OverlayProps } from '~/types';

import { Overlay } from '../overlay';
import { Button } from '../ui/button';

export const WaitingOverlay = ({ contractAddress, refresh }: OverlayProps) => {
  const { data: totalPlayers } = useReadContract({
    ...gameConfig,
    address: contractAddress,
    functionName: '_totalPlayers',
  });

  const { writeContractAsync } = useWriteContract();

  const onStartGame = async () => {
    const id = toast.loading('Starting game...');
    try {
      const hash = await writeContractAsync({
        ...gameConfig,
        address: contractAddress,
        functionName: 'startGame',
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      toast.success('Game Started Successfully!', { id });
      if (refresh) {
        await refresh();
      }
    } catch (error) {
      toast.error(errorHandler(error), { id });
    }
  };

  return (
    <Overlay>
      <div className='flex w-full flex-col gap-4'>
        <div className='text-center font-poker text-4xl'>Waiting Stage</div>
        <div className='text-center font-poker text-2xl'>
          Total Players: {totalPlayers ?? 0}
        </div>
        <div className='flex w-full items-center justify-center font-poker text-2xl'>
          Waiting for other players...
        </div>
        <Button
          className='mx-auto w-fit font-poker text-xl'
          onClick={onStartGame}
        >
          Start Game
        </Button>
      </div>
    </Overlay>
  );
};
