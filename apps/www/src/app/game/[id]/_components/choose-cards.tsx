import React, { useState } from 'react';

import { cn, errorHandler } from '~/lib/utils';
import { gameConfig, wagmiConfig } from '~/lib/viem';

import { waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';

import { Button } from '~/components/ui/button';

interface ChooseCardsProps {
  cards: number[];
  contractAddress: `0x${string}`;
}

export const ChooseCards = ({ cards, contractAddress }: ChooseCardsProps) => {
  const [selected, setSelected] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const { writeContractAsync } = useWriteContract();

  const onChooseCards = async () => {
    const id = toast.loading('Choosing Cards...');
    try {
      const indexes = Object.keys(selected)
        .filter((k) => selected[Number(k)])
        .map((k) => Number(k));
      if (indexes.length !== 3) {
        throw new Error('Please select 3 different cards.');
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- safe
      const cardsToChoose = indexes.map((i) => cards[i]!) as [
        number,
        number,
        number,
      ];
      const hash = await writeContractAsync({
        ...gameConfig,
        address: contractAddress,
        functionName: 'chooseCards',
        args: [cardsToChoose],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      toast.success('Cards Chosen Successfully!', { id });
    } catch (error) {
      toast.error(errorHandler(error), { id });
      console.error(error);
    }
  };
  return (
    <div className='absolute bottom-1/4 right-1/2 z-[3] mx-auto flex w-fit translate-x-1/2 flex-col gap-2'>
      <div className='flex flex-row items-center gap-3'>
        {Array.from({ length: 5 }, (_, i) => i).map((i) => {
          return (
            <div
              key={`choose-card-${String(i)}`}
              className='flex w-20 items-center justify-center'
            >
              <button
                type='button'
                className={cn(
                  'flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-1 font-medium shadow-md',
                  selected[i]
                    ? 'border-[#204D39] bg-[#337a5a]'
                    : 'border-[#70AF8A] bg-[#204D39]'
                )}
                onClick={() => {
                  const newState = {
                    ...selected,
                    [i]: !selected[i],
                  };
                  setSelected(newState);
                }}
              >
                {i + 1}
              </button>
            </div>
          );
        })}
      </div>
      <Button
        className='mt-4 !rounded-full border-2 border-[#70AF8A] bg-[#204D39] px-4 py-3 text-base text-[#89d6a9]'
        onClick={onChooseCards}
      >
        Choose Cards
      </Button>
    </div>
  );
};
