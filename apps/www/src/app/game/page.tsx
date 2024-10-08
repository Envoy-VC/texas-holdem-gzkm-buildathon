'use client';

import React from 'react';

import { gameFactoryConfig } from '~/lib/viem';

import { useReadContract } from 'wagmi';
import { GameCard } from '~/components';

const Games = () => {
  const { data: totalGames } = useReadContract({
    ...gameFactoryConfig,
    functionName: '_nextGameId',
  });

  return (
    <div className='flex flex-col gap-12 p-36'>
      <div className='font-poker text-5xl'>All Games</div>
      {Number(totalGames) > 0 && (
        <div className='flex flex-row flex-wrap gap-3'>
          {Array.from({ length: Number(totalGames) }, (_, i) => i).map(
            (_, index) => (
              // eslint-disable-next-line react/no-array-index-key -- safe
              <GameCard key={index + 1} id={String(index)} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Games;
