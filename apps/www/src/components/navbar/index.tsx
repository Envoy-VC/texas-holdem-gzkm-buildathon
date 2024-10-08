import Link from 'next/link';

import React from 'react';

import { CreateGame } from '../create-game';
import { ConnectButton } from './connect-button';

export const Navbar = () => {
  return (
    <div className='absolute top-0 z-[2] h-[8dvh] w-full'>
      <div className='mx-auto flex h-full max-w-screen-xl items-center justify-between px-4'>
        <div className='font-poker text-4xl font-semibold'>
          Texas Hold&lsquo;em
        </div>
        <div className='flex flex-row items-center gap-3'>
          <Link href='/game'>Games</Link>
          <CreateGame />
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};
