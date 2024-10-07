import React from 'react';

import { truncate } from '~/lib/utils';

import MotionNumber from 'motion-number';
import type { Address } from 'viem';
import { PokerBox } from '~/components';

interface GameStatisticsProps {
  highestBid: number;
  winner: Address;
  nextTurn: string;
}

export const GameStatistics = ({
  highestBid,
  winner,
  nextTurn,
}: GameStatisticsProps) => {
  return (
    <div className='absolute right-12 top-24 flex flex-col items-center gap-3 text-xl'>
      <PokerBox className='flex w-[20rem] flex-col gap-2 px-6 py-4 text-lg'>
        <div className='flex flex-row justify-between'>
          <div>Highest Bet: </div>
          <MotionNumber
            className='text-xl'
            format={{ style: 'currency', currency: 'USD' }}
            value={highestBid}
          />
        </div>
        <div className='flex flex-row justify-between'>
          <div>Winner: </div>
          {truncate(winner, 8)}
        </div>
        <div className='flex flex-row justify-between'>
          <div>Next Turn: </div>
          {nextTurn}
        </div>
      </PokerBox>
    </div>
  );
};
