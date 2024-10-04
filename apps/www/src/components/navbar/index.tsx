import React from 'react';

import { ConnectButton } from './connect-button';

export const Navbar = () => {
  return (
    <div className='absolute top-0 z-[2] h-[8dvh] w-full'>
      <div className='mx-auto flex h-full max-w-screen-xl items-center justify-between px-4'>
        <div className='font-poker text-4xl font-semibold'>
          Texas Hold&lsquo;em
        </div>
        <ConnectButton />
      </div>
    </div>
  );
};
