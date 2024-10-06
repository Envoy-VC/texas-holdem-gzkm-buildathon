import React, { type ComponentProps } from 'react';

import { cn } from '~/lib/utils';

import GoldBG from 'public/gold-bg.webp';
import PokerBG from 'public/poker-bg.jpg';

export const Overlay = ({
  children,
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div className='fixed inset-0 z-50 bg-black/80'>
      <div
        className='fixed left-[50%] top-[50%] z-50 flex translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[6rem] border bg-background p-3'
        style={{
          backgroundImage: `url(${GoldBG.src})`,
          objectFit: 'cover',
        }}
      >
        <div
          className={cn(
            'min-h-[20rem] w-full min-w-[36rem] rounded-[5rem] p-8',
            className
          )}
          style={{
            backgroundImage: `url(${PokerBG.src})`,
            objectFit: 'cover',
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
