import React from 'react';

import { isAddress, zeroAddress } from 'viem';

import { ShuffleOverlay } from '~/components/overlays';

const GamePage = ({ params }: { params: { id: `0x${string}` } }) => {
  const contractAddress = isAddress(params.id) ? params.id : zeroAddress;

  return (
    <div>
      <ShuffleOverlay contractAddress={contractAddress} />
    </div>
  );
};

export default GamePage;
