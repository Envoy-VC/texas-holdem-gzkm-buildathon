import Image from 'next/image';

import React, { type PropsWithChildren } from 'react';

import PokerTableImage from 'public/poker-table.png';

const GameLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='h-screen'>
      <div className='absolute z-[-1] flex h-screen w-full items-center justify-center border'>
        <Image
          alt='Poker table'
          className='w-full max-w-7xl'
          src={PokerTableImage}
        />
      </div>
      <div className='z-[1] pt-[6rem]'>{children}</div>
    </div>
  );
};

export default GameLayout;
