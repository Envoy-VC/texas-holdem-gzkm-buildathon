'use client';

import React, { useMemo } from 'react';

import { getCurrentRound } from '~/lib/helpers';
import { truncate } from '~/lib/utils';
import { gameConfig } from '~/lib/viem';

import MotionNumber from 'motion-number';
import { isAddress, zeroAddress } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

import { GameOverlay } from '~/components/overlays';

import { GameStatistics, PlaceBet, Results } from './_components';
import { CommunityCards } from './_components/community-cards';

const GamePage = ({ params }: { params: { id: `0x${string}` } }) => {
  const contractAddress = isAddress(params.id) ? params.id : zeroAddress;

  const { address } = useAccount();

  // const { data, refetch } = useReadContracts({
  //   contracts: [
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: '_currentRound',
  //     },
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'getPotAmount',
  //     },
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: '_highestBet',
  //     },
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'getPendingPlayerRevealTokens',
  //       args: [address ?? zeroAddress],
  //     },
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'getPendingCommunityRevealTokens',
  //       args: [address ?? zeroAddress],
  //     },
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'nextPlayer',
  //     },
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'getCommunityCards',
  //     },
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'getPlayerCards',
  //       args: [address ?? zeroAddress],
  //     },
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'getAllWeights',
  //       args: [],
  //     },
  //     {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'winner',
  //     },
  //   ],
  // });

  // const { writeContractAsync } = useWriteContract();
  // const [betAmount, setBetAmount] = useState('');
  // const [addCards, setAddCards] = useState('');

  // const onBet = async () => {
  //   const id = toast.loading('Betting...');
  //   try {
  //     if (!address) {
  //       throw new Error('Please connect wallet.');
  //     }
  //     if (betAmount === '') {
  //       throw new Error('Please enter a valid bet amount.');
  //     }
  //     const hash = await writeContractAsync({
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'placeBet',
  //       args: [BigInt(betAmount)],
  //     });
  //     await waitForTransactionReceipt(wagmiConfig, { hash });
  //     toast.success('Bet placed successfully!', { id });
  //     setBetAmount('');
  //   } catch (error) {
  //     toast.error('Error placing bet: ', { id });
  //     console.error(error);
  //   }
  // };

  // const onSubmitRevealTokens = async () => {
  //   const id = toast.loading('Submitting RevealTokens...');
  //   try {
  //     if (!address) {
  //       throw new Error('Please connect wallet.');
  //     }
  //     const pendingCommunity = data?.[4].result ?? [];
  //     const pendingPlayer = data?.[3].result ?? [];
  //     const pending = [...pendingCommunity, ...pendingPlayer].filter(
  //       (x) => x !== 0
  //     );
  //     const deck = await getDeck(contractAddress);
  //     const cards = [];
  //     for (const i of pending) {
  //       cards.push(deck[i] as [Hex, Hex, Hex, Hex]);
  //     }
  //     console.log({ pending });
  //     const key = await getKey(address);
  //     const tokens = await getRevealKeys(cards, key.sk);
  //     console.log({ tokens });
  //     const revealTokens = tokens.revealKeys.map((t) => ({
  //       player: address,
  //       token: {
  //         x: hexToBigInt(t.card[0]),
  //         y: hexToBigInt(t.card[1]),
  //       },
  //     }));
  //     const hash = await writeContractAsync({
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'addMultipleRevealTokens',
  //       args: [pending, revealTokens],
  //     });
  //     await waitForTransactionReceipt(wagmiConfig, { hash });
  //     toast.success('Reveal Tokens Added Successfully!', { id });
  //     setBetAmount('');
  //   } catch (error) {
  //     toast.error('Error ', { id });
  //     console.error(error);
  //   }
  // };

  // const onRevealCommunityCards = async () => {
  //   const cards = (data?.[6].result ?? []).filter((x) => x !== 0);
  //   const res = await readContract(wagmiConfig, {
  //     ...gameConfig,
  //     address: contractAddress,
  //     functionName: 'revealMultipleCards',
  //     args: [cards],
  //   });
  //   console.log(res);
  // };

  // const onRevealPlayerCards = async () => {
  //   const cards = (data?.[7].result ?? []).filter((x) => x !== 0);
  //   const deck = await getDeck(contractAddress);
  //   const c: [Hex, Hex, Hex, Hex][] = [];
  //   const tokens: [Hex, Hex][][] = [];
  //   for await (const card of cards) {
  //     const res = await readContract(wagmiConfig, {
  //       ...gameConfig,
  //       address: contractAddress,
  //       functionName: 'getRevealTokens',
  //       args: [card],
  //     });
  //     const rTokens = res
  //       .filter((t) => t.player !== address)
  //       .map(
  //         (r) =>
  //           [
  //             toHex(r.token.x, { size: 32 }),
  //             toHex(r.token.y, { size: 32 }),
  //           ] as [Hex, Hex]
  //       );
  //     tokens.push(rTokens);
  //     c.push(deck[card] as [Hex, Hex, Hex, Hex]);
  //   }
  //   console.log({
  //     cards: c,
  //     tokens,
  //   });
  //   const key = await getKey(address ?? zeroAddress);
  //   const res = await unmaskCards(c, key.sk, tokens);
  //   console.log(res);
  // };

  // const onDeclareWinner = async () => {
  //   const res = await writeContractAsync({
  //     ...gameConfig,
  //     address: contractAddress,
  //     functionName: 'declareWinner',
  //     args: [],
  //   });
  //   await waitForTransactionReceipt(wagmiConfig, { hash: res });
  // };

  // const onChooseCards = async () => {
  //   const cards = addCards.split(' ').map((c) => Number(c));
  //   if (cards.length !== 3) {
  //     toast.error('Please enter a valid list of 3 card indices.');
  //     return;
  //   }
  //   const res = await writeContractAsync({
  //     ...gameConfig,
  //     address: contractAddress,
  //     functionName: 'chooseCards',
  //     args: [cards],
  //   });
  //   await waitForTransactionReceipt(wagmiConfig, { hash: res });
  // };

  const res = useReadContracts({
    contracts: [
      {
        ...gameConfig,
        address: contractAddress,
        functionName: '_currentRound',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: 'getPotAmount',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: '_highestBet',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: 'winner',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: 'nextPlayer',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: '_totalPlayers',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: 'winner',
      },
      {
        ...gameConfig,
        address: contractAddress,
        functionName: 'getCommunityCards',
      },
    ],
  });

  const data = useMemo(() => {
    const currentRound = getCurrentRound(res.data?.[0].result ?? 0);
    const potAmount = Number(res.data?.[1].result ?? 0);
    const highestBet = Number(res.data?.[2].result ?? 0);
    const winnerAddress = res.data?.[3].result?.[0] ?? zeroAddress;
    const nextTurn =
      res.data?.[4].result?.addr === address
        ? 'Me'
        : truncate(res.data?.[4].result?.addr ?? '', 8);
    const playerCount = Number(res.data?.[5].result ?? 0);
    const gameEnded = res.data?.[6].result?.[0] !== zeroAddress;
    const communityCards = res.data?.[7].result?.map((c) => c) ?? [];

    return {
      currentRound,
      potAmount,
      highestBet,
      winnerAddress,
      nextTurn,
      playerCount,
      gameEnded,
      communityCards,
    };
  }, [address, res.data]);

  return (
    <div>
      <GameOverlay contractAddress={contractAddress} />
      <div className='flex flex-col'>
        <div className='absolute right-1/2 top-24 mx-auto flex w-fit translate-x-1/2 flex-col gap-2'>
          <div className='text-center font-poker text-3xl font-medium text-neutral-200'>
            {data.currentRound}
          </div>
          <MotionNumber
            className='rounded-full border-2 border-[#70AF8A] bg-[#204D39] px-8 py-4 text-5xl'
            format={{ style: 'currency', currency: 'USD' }}
            value={data.potAmount}
          />
        </div>
        <GameStatistics
          highestBid={data.highestBet}
          nextTurn={data.nextTurn}
          winner={data.winnerAddress}
        />
      </div>
      <PlaceBet
        contractAddress={contractAddress}
        highestBet={data.highestBet}
        isMyTurn={data.nextTurn === 'Me'}
      />
      {data.gameEnded ? (
        <Results
          contractAddress={contractAddress}
          totalPlayers={data.playerCount}
        />
      ) : null}
      <CommunityCards
        cards={data.communityCards}
        contractAddress={contractAddress}
      />
      {/* <div className='flex w-fit flex-col gap-2'>
        <div>Current Round: {data?.[0].result}</div>
        <div>Pot Amount: {data?.[1].result?.toLocaleString()} USD</div>
        <div>Highest Bet: {data?.[2].result?.toLocaleString()} USD</div>
        <div>Community Cards: {data?.[6].result?.join(', ')}</div>
        <div>Player Cards: {data?.[7].result?.join(', ')}</div>
        <div>Pending Player Reveal Tokens: {data?.[3].result?.join(', ')}</div>
        <div>
          Pending Community Reveal Tokens: {data?.[4].result?.join(', ')}
        </div>
        <div>
          Next Player: {data?.[5].result?.addr === address ? 'Me' : 'Other'}
        </div>
        <div>
          Weights:{' '}
          {data?.[8].result?.map((w) => w.weight.toLocaleString()).join(', ')}
        </div>
        <div>Winner: {data?.[9].result?.[0] === address ? 'Me' : 'Other'}</div>
        <Button className='w-[10rem]' onClick={async () => await refetch()}>
          Refetch
        </Button>
        <div className='flex flex-row items-center gap-2 py-12'>
          <Input
            placeholder='Enter amount'
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
          <Button className='w-[10rem]' onClick={onBet}>
            Bet
          </Button>
        </div>
        <div className='flex flex-row items-center gap-2 py-12'>
          <Input
            placeholder='Enter amount'
            value={addCards}
            onChange={(e) => setAddCards(e.target.value)}
          />
          <Button className='w-[10rem]' onClick={onChooseCards}>
            Choose Cards
          </Button>
        </div>
        <Button className='w-[10rem]' onClick={onSubmitRevealTokens}>
          Submit Reveal Tokens
        </Button>
        <Button className='w-[10rem]' onClick={onRevealCommunityCards}>
          Reveal Community Cards
        </Button>
        <Button className='w-[10rem]' onClick={onRevealPlayerCards}>
          Reveal Player Cards
        </Button>
        <Button className='w-[10rem]' onClick={onDeclareWinner}>
          Declare Winner
        </Button>
      </div> */}
    </div>
  );
};

export default GamePage;
