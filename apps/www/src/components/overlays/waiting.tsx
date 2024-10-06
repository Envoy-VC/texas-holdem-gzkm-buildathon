import React from 'react';

import type { OverlayProps } from '~/types';

import { Overlay } from '../overlay';

export const WaitingOverlay = (_props: OverlayProps) => {
  return (
    <Overlay>
      <div className='w-full'>
        <div className='text-center font-poker text-4xl'>Waiting Stage</div>
        <div className='flex w-full items-center justify-center font-poker text-3xl py-12'>
          Waiting for other players...
        </div>
      </div>
    </Overlay>
  );
};
