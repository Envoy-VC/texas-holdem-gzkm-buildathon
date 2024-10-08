import Image from 'next/image';

import React, { type PropsWithChildren } from 'react';

import PokerTableImage from 'public/poker-table.png';

const GameLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='relative h-screen'>
      <div className='z-[2] flex h-screen w-full items-center justify-center'>
        <Image
          alt='Poker table'
          className='w-full max-w-7xl pt-24'
          src={PokerTableImage}
        />
      </div>
      {children}
    </div>
  );
};

export default GameLayout;
