import { useState } from 'react';

import { useShuffle } from '~/lib/hooks';
import { unmaskCard } from '~/lib/shuffle';
import { gameConfig, wagmiConfig } from '~/lib/viem';

import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';
import { motion } from 'framer-motion';
import { type Hex, toHex } from 'viem';
import { useAccount } from 'wagmi';
import { PokerCard } from '~/components';

const tabs = [
  {
    id: 'hand',
    label: 'Hand',
  },
  {
    label: 'Off-Hand',
    id: 'off-hand',
  },
] as const;

interface PlayerCardsProps {
  contractAddress: `0x${string}`;
  cards: number[];
  deck: Hex[][];
}

export const PlayerCards = ({
  contractAddress,
  cards,
  deck,
}: PlayerCardsProps) => {
  const maxRotation = 20;
  const filteredCards = cards.filter((c) => c !== 0);
  const midIndex = (filteredCards.length - 1) / 2;
  const [activeTab, setActiveTab] = useState<'hand' | 'off-hand'>('hand');

  return (
    <>
      <div className='absolute bottom-0 right-1/2 z-[3] translate-x-1/2 overflow-y-hidden'>
        <div className='flex h-[24rem] w-[66rem] flex-row items-end justify-center gap-2'>
          {filteredCards.map((card, index) => {
            const relativeIndex = index - midIndex;
            const rotation = relativeIndex * (maxRotation / midIndex);
            const translateY = Math.pow(Math.abs(relativeIndex), 2) * 15 + 10;
            const translateX = relativeIndex * -60;

            return (
              <motion.div
                key={card}
                transition={{ type: 'spring', stiffness: 100 }}
                animate={{
                  translateX: activeTab === 'hand' ? translateX : 0,
                  translateY: activeTab === 'hand' ? translateY : -100,
                  rotateZ: activeTab === 'hand' ? rotation : 0,
                }}
                style={{
                  zIndex: 3,
                }}
              >
                <PlayerCard
                  cardIndex={card}
                  contractAddress={contractAddress}
                  deck={deck}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className='absolute bottom-0 right-1/2 z-[4] translate-x-1/2'>
        <div className='mb-6 flex flex-row items-center space-x-1 rounded-3xl bg-neutral-800 px-2 py-2'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              className={`${
                activeTab === tab.id ? '' : 'hover:text-white/60'
              } relative rounded-full px-3 py-1.5 text-sm font-medium text-white outline-sky-400 transition focus-visible:outline-2`}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {activeTab === tab.id && (
                <motion.span
                  className='absolute inset-0 z-10 bg-white mix-blend-difference'
                  layoutId='bubble'
                  style={{ borderRadius: 9999 }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

interface PlayerCard {
  contractAddress: `0x${string}`;
  cardIndex: number;
  deck: Hex[][];
}

const PlayerCard = ({ cardIndex, contractAddress, deck }: PlayerCard) => {
  const { address } = useAccount();
  const { getKey } = useShuffle();
  const { data } = useQuery({
    queryKey: ['player-card', contractAddress, cardIndex],
    initialData: -1,
    refetchInterval: 2000,
    queryFn: async () => {
      try {
        if (!address) {
          throw new Error('Please connect wallet.');
        }
        const res = await readContract(wagmiConfig, {
          ...gameConfig,
          address: contractAddress,
          functionName: 'getRevealTokens',
          args: [cardIndex],
        });
        const rTokens = res
          .filter((t) => t.player !== address)
          .map(
            (r) =>
              [
                toHex(r.token.x, { size: 32 }),
                toHex(r.token.y, { size: 32 }),
              ] as [Hex, Hex]
          );
        const key = await getKey(address);
        const card = await unmaskCard(
          deck[cardIndex] as [Hex, Hex, Hex, Hex],
          key.sk,
          rTokens
        );
        return card.result;
      } catch (error) {
        return -1;
      }
    },
  });

  return <PokerCard cardId={data} className='w-36' />;
};
