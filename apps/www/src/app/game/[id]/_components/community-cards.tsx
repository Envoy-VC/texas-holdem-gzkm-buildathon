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
          if (i !== 0) {
            return (
              <CommunityCard
                key={i}
                cardIndex={i}
                contractAddress={contractAddress}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

interface CommunityCardProps {
  contractAddress: `0x${string}`;
  cardIndex: number;
}

const CommunityCard = ({ contractAddress, cardIndex }: CommunityCardProps) => {
  const data = useQuery({
    queryKey: ['community-card', contractAddress, cardIndex],
    initialData: -1,
    refetchInterval: 2000,
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
  });

  return <PokerCard cardId={data.data} className='w-20 rounded-lg' />;
};
