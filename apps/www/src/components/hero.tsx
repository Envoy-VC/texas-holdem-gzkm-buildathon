import React from 'react';

import Spline from '@splinetool/react-spline/next';

export const Hero = () => {
  return (
    <div className='h-screen w-full'>
      <div className='h-[100dvh] overflow-hidden'>
        <Spline
          className='min-h-screen scale-[150%]'
          scene='https://prod.spline.design/wgwNW6QZCeRL2mBz/scene.splinecode'
        />
      </div>
    </div>
  );
};
