import React, { type ComponentProps } from 'react';

import { cn } from '~/lib/utils';

import GoldBG from 'public/gold-bg.webp';
import PokerBG from 'public/poker-bg.jpg';

export const PokerBox = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className='rounded-[2rem] border bg-background p-1'
      style={{
        backgroundImage: `url(${GoldBG.src})`,
        objectFit: 'cover',
      }}
    >
      <div
        className={cn('rounded-[2rem] p-2', className)}
        style={{
          backgroundImage: `url(${PokerBG.src})`,
          objectFit: 'cover',
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};
