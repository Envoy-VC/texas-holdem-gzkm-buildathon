import React from 'react';

import { errorHandler } from '~/lib/utils';
import { gameConfig, wagmiConfig } from '~/lib/viem';

import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog';

interface DeclareResultProps {
  contractAddress: `0x${string}`;
  refresh: () => Promise<void>;
}

export const DeclareResult = ({
  contractAddress,
  refresh,
}: DeclareResultProps) => {
  const { writeContractAsync, isPending } = useWriteContract();
  const onDeclare = async () => {
    const id = toast.loading('Declaring Result...');
    try {
      const hash = await writeContractAsync({
        ...gameConfig,
        address: contractAddress,
        functionName: 'declareWinner',
        args: [],
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await refresh();
      toast.success('Result Declared Successfully!', { id });
    } catch (error) {
      toast.error(errorHandler(error), { id });
    }
  };
  return (
    <div className='absolute bottom-12 left-12'>
      <Dialog>
        <DialogTrigger className='flex flex-row items-center gap-2 rounded-full border-2 border-[#70AF8A] bg-[#204D39] px-4 py-2 text-lg text-[#89d6a9]'>
          Declare Result
        </DialogTrigger>
        <DialogContent className='flex w-full max-w-xl flex-row items-center justify-center !rounded-3xl bg-[#204D39] py-8'>
          <DialogHeader>
            <DialogTitle className='text-xl font-medium'>
              Declare Game Result
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to declare the game result? Make sure all
              players have provided Pending Reveal Tokens in order to compute
              the Winner.
            </DialogDescription>
            <Button disabled={isPending} onClick={onDeclare}>
              Declare Result
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
