/* eslint-disable @next/next/no-img-element -- safe */
import React, { type ComponentProps } from 'react';

import { getPokerCardImage } from '~/lib/helpers';
import { cn } from '~/lib/utils';

interface PokerCardProps extends ComponentProps<'img'> {
  cardId: number;
}

export const PokerCard = ({
  cardId,
  className,
  style,
  ...props
}: PokerCardProps) => {
  const src = getPokerCardImage(cardId);
  return (
    <img
      alt='Poker Card'
      className={cn('rounded-xl object-scale-down shadow-md', className)}
      src={src}
      style={{
        backgroundImage: `url(${src})`,
        aspectRatio: 63 / 88,
        ...style,
      }}
      {...props}
    />
  );
};
