import Link from 'next/link';

import React from 'react';

import { gameFactoryConfig, wagmiConfig } from '~/lib/viem';

import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';
import { zeroAddress } from 'viem';

import { Button } from './ui/button';

interface GameCardProps {
  id: string;
}

export const GameCard = ({ id }: GameCardProps) => {
  const { data: gameAddress } = useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      const addr = await readContract(wagmiConfig, {
        ...gameFactoryConfig,
        functionName: '_games',
        args: [BigInt(String(id))],
      });
      return addr;
    },
  });

  return (
    <div className='flex flex-row items-center justify-between rounded-3xl border bg-neutral-900 p-2 px-6'>
      <div className='text-lg font-medium'>
        Game Address: {gameAddress ?? zeroAddress}
      </div>
      <Link href={`/game/${gameAddress ?? zeroAddress}`}>
        <Button className='h-8 rounded-3xl'>Join</Button>
      </Link>
    </div>
  );
};
