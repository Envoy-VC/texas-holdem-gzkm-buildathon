import React from 'react';

import { useShuffle } from '~/lib/hooks';
import { getRevealKeys } from '~/lib/shuffle';
import { gameConfig, wagmiConfig } from '~/lib/viem';

import { useMutation } from '@tanstack/react-query';
import { waitForTransactionReceipt } from '@wagmi/core';
import { type Hex, hexToBigInt } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

import { CheckCheckIcon, TriangleAlertIcon } from 'lucide-react';

interface AddPendingCardsProps {
  contractAddress: `0x${string}`;
  pendingCards: number[];
  isPending: boolean;
  deck: Hex[][];
  refresh: () => Promise<void>;
}

export const AddPendingCards = ({
  contractAddress,
  pendingCards,
  isPending,
  deck,
  refresh,
}: AddPendingCardsProps) => {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const { getKey } = useShuffle();

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      if (!address) {
        throw new Error('Please connect wallet.');
      }
      const cards = [];
      for (const i of pendingCards) {
        cards.push(deck[i] as [Hex, Hex, Hex, Hex]);
      }
      const key = await getKey(address);
      const tokens = await getRevealKeys(cards, key.sk);

      const revealTokens = tokens.revealKeys.map((t) => ({
        player: address,
        token: {
          x: hexToBigInt(t.card[0]),
          y: hexToBigInt(t.card[1]),
        },
      }));
      const hash = await writeContractAsync({
        ...gameConfig,
        address: contractAddress,
        functionName: 'addMultipleRevealTokens',
        args: [pendingCards, revealTokens],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await refresh();
    },
  });
  return (
    <div className='absolute bottom-32 right-12'>
      <Popover>
        <PopoverTrigger className='flex h-10 w-10 flex-row items-center justify-center gap-2 rounded-full border-2 border-[#70AF8A] bg-[#204D39] !p-0 px-4 py-2 text-lg text-[#89d6a9]'>
          {isPending ? (
            <TriangleAlertIcon className='text-lg text-[#89d6a9]' />
          ) : (
            <CheckCheckIcon className='text-lg text-[#89d6a9]' />
          )}
        </PopoverTrigger>
        <PopoverContent className='flex w-fit flex-row items-center justify-center rounded-3xl bg-[#204D39]'>
          <Button
            className='rounded-full bg-neutral-300 px-6'
            disabled={isLoading}
            onClick={async () => await mutateAsync()}
          >
            {isLoading ? 'Adding Tokens...' : 'Add Tokens'}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
