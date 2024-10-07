import React from 'react';

import { gameConfig, wagmiConfig } from '~/lib/viem';

import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';
import { PokerCard } from '~/components';

interface CommunityCardsProps {
  contractAddress: `0x${string}`;
  cards: number[];
}

export const CommunityCards = ({
  contractAddress,
  cards,
}: CommunityCardsProps) => {
  return (
    <div className='absolute right-1/2 top-1/2 mx-auto flex w-fit translate-x-1/2 flex-col gap-2'>
      <div className='flex flex-row items-center gap-3'>
        {cards.map((i) => {
          return (
            <CommunityCard
              key={i}
              cardIndex={i}
              contractAddress={contractAddress}
              isHidden={cards[i] === 0}
            />
          );
        })}
      </div>
    </div>
  );
};

interface CommunityCardProps {
  contractAddress: `0x${string}`;
  isHidden: boolean;
  cardIndex: number;
}

const CommunityCard = ({
  contractAddress,
  cardIndex,
  isHidden,
}: CommunityCardProps) => {
  const data = useQuery({
    queryKey: ['community-card', contractAddress, cardIndex],
    queryFn: async () => {
      try {
        const card = await readContract(wagmiConfig, {
          ...gameConfig,
          address: contractAddress,
          functionName: 'revealCard',
          args: [cardIndex],
        });
        return card;
      } catch (error) {
        console.log(error);
        return -1;
      }
    },
    enabled: !isHidden,
  });

  return <PokerCard cardId={data.data ?? -1} className='w-20 rounded-lg' />;
};
