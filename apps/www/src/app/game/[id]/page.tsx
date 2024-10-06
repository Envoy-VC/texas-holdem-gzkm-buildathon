import React from 'react';

import { isAddress, zeroAddress } from 'viem';

import { GameOverlay } from '~/components/overlays';

const GamePage = ({ params }: { params: { id: `0x${string}` } }) => {
  const contractAddress = isAddress(params.id) ? params.id : zeroAddress;

  return (
    <div>
      <GameOverlay contractAddress={contractAddress} />
    </div>
  );
};

export default GamePage;
