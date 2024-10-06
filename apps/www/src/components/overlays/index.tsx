'use client';

import React, { useMemo } from 'react';

import { gameConfig } from '~/lib/viem';

import { zeroAddress } from 'viem';
import { useReadContracts } from 'wagmi';
import type { OverlayProps } from '~/types';

import { ShuffleOverlay } from './shuffle';
import { WaitingOverlay } from './waiting';

export const GameOverlay = ({ contractAddress }: OverlayProps) => {
  const { data } = useReadContracts({
    contracts: [
      {
        ...gameConfig,
        address: contractAddress,
        functionName: '_totalPlayers',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: '_totalShuffles',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: '_currentRound',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: 'winner',
      },
    ],
  });

  const stage = useMemo(() => {
    let currentStage:
      | 'waiting'
      | 'shuffle'
      | 'started'
      | 'choose-cards'
      | 'ended';

    const totalPlayers = data?.[0].result ?? 0;
    const totalShuffles = Number(data?.[1].result ?? 0);
    const currentRound = Number(data?.[2].result ?? 0); // 5 is end
    const winnerAddr = data?.[3].result?.[0] ?? zeroAddress;

    if (totalPlayers === 1) {
      currentStage = 'waiting';
      return currentStage;
    }

    if (totalShuffles !== totalPlayers) {
      currentStage = 'shuffle';
      return currentStage;
    }

    if (currentRound < 5) {
      currentStage = 'started';
      return currentStage;
    }

    if (winnerAddr === zeroAddress) {
      currentStage = 'choose-cards';
      return currentStage;
    }
    currentStage = 'ended';
    return currentStage;
  }, [data]);

  if (stage === 'waiting') {
    return <WaitingOverlay contractAddress={contractAddress} />;
  } else if (stage === 'shuffle') {
    return <ShuffleOverlay contractAddress={contractAddress} />;
  } else if (stage === 'started') {
    // TODO: Game started overlay
  } else if (stage === 'choose-cards') {
    // TODO: Choose cards overlay
  }

  return null;
};
