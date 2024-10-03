// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";

import {TexasPoker, CardType, CardSuit, PokerCard, Result} from "src/libraries/TexasPoker.sol";

contract TexasPokerTest is Test {
    function setUp() public virtual {}

    function test_RoyalFlush() public {
        // AS KS QS JS TS
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Ace, CardSuit.Spade);
        hand[1] = PokerCard(CardType.King, CardSuit.Spade);
        hand[2] = PokerCard(CardType.Queen, CardSuit.Spade);
        hand[3] = PokerCard(CardType.Jack, CardSuit.Spade);
        hand[4] = PokerCard(CardType.Ten, CardSuit.Spade);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, type(uint256).max);
    }

    function test_StraightFlush() public {
        // TS 9S 8S 7S 6S
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Ten, CardSuit.Spade);
        hand[1] = PokerCard(CardType.Nine, CardSuit.Spade);
        hand[2] = PokerCard(CardType.Eight, CardSuit.Spade);
        hand[3] = PokerCard(CardType.Seven, CardSuit.Spade);
        hand[4] = PokerCard(CardType.Six, CardSuit.Spade);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, 1010);
    }

    function test_FourOfAKind() public {
        // JD JC JS JH KD
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Jack, CardSuit.Diamond);
        hand[1] = PokerCard(CardType.Jack, CardSuit.Club);
        hand[2] = PokerCard(CardType.Jack, CardSuit.Spade);
        hand[3] = PokerCard(CardType.Jack, CardSuit.Heart);
        hand[4] = PokerCard(CardType.King, CardSuit.Diamond);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, 911);
    }

    function test_FullHouse() public {
        // AH AC AD 9S 9C
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Ace, CardSuit.Heart);
        hand[1] = PokerCard(CardType.Ace, CardSuit.Club);
        hand[2] = PokerCard(CardType.Ace, CardSuit.Diamond);
        hand[3] = PokerCard(CardType.Nine, CardSuit.Spade);
        hand[4] = PokerCard(CardType.Nine, CardSuit.Club);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, 814);
    }

    function test_Flush() public {
        // AS JS 8S 4S 3S
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Ace, CardSuit.Spade);
        hand[1] = PokerCard(CardType.Jack, CardSuit.Spade);
        hand[2] = PokerCard(CardType.Eight, CardSuit.Spade);
        hand[3] = PokerCard(CardType.Four, CardSuit.Spade);
        hand[4] = PokerCard(CardType.Three, CardSuit.Spade);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, 714);
    }

    function test_Straight() public {
        // 9H 8S 7C 6D 5C
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Nine, CardSuit.Heart);
        hand[1] = PokerCard(CardType.Eight, CardSuit.Spade);
        hand[2] = PokerCard(CardType.Seven, CardSuit.Club);
        hand[3] = PokerCard(CardType.Six, CardSuit.Diamond);
        hand[4] = PokerCard(CardType.Five, CardSuit.Club);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, 609);
    }

    function test_ThreeOfAKind() public {
        // 7S 7D 7C KD QC
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Seven, CardSuit.Spade);
        hand[1] = PokerCard(CardType.Seven, CardSuit.Diamond);
        hand[2] = PokerCard(CardType.Seven, CardSuit.Club);
        hand[3] = PokerCard(CardType.King, CardSuit.Diamond);
        hand[4] = PokerCard(CardType.Queen, CardSuit.Club);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, 507);
    }

    function test_TwoPair() public {
        // 9C 9D 6C 6S QH
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Nine, CardSuit.Club);
        hand[1] = PokerCard(CardType.Nine, CardSuit.Diamond);
        hand[2] = PokerCard(CardType.Six, CardSuit.Club);
        hand[3] = PokerCard(CardType.Six, CardSuit.Spade);
        hand[4] = PokerCard(CardType.Queen, CardSuit.Heart);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, 409);
    }

    function test_OnePair() public {
        // AD AH KS 9D 4H
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Ace, CardSuit.Diamond);
        hand[1] = PokerCard(CardType.Ace, CardSuit.Heart);
        hand[2] = PokerCard(CardType.King, CardSuit.Spade);
        hand[3] = PokerCard(CardType.Nine, CardSuit.Diamond);
        hand[4] = PokerCard(CardType.Four, CardSuit.Heart);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, 300);
    }

    function test_HighCard() public {
        // AS JD 8C 6S 2H
        PokerCard[5] memory hand;
        hand[0] = PokerCard(CardType.Ace, CardSuit.Spade);
        hand[1] = PokerCard(CardType.Jack, CardSuit.Diamond);
        hand[2] = PokerCard(CardType.Eight, CardSuit.Club);
        hand[3] = PokerCard(CardType.Six, CardSuit.Spade);
        hand[4] = PokerCard(CardType.Two, CardSuit.Heart);

        uint256 weight = TexasPoker.getWeight(hand);
        assertEq(weight, 14);
    }

    function test_Tie() public {
        // AS KS QS JS TS
        PokerCard[5] memory hand1;
        hand1[0] = PokerCard(CardType.Ace, CardSuit.Spade);
        hand1[1] = PokerCard(CardType.King, CardSuit.Spade);
        hand1[2] = PokerCard(CardType.Queen, CardSuit.Spade);
        hand1[3] = PokerCard(CardType.Jack, CardSuit.Spade);
        hand1[4] = PokerCard(CardType.Ten, CardSuit.Spade);

        // AS KS QS JS TS
        PokerCard[5] memory hand2;
        hand2[0] = PokerCard(CardType.Ace, CardSuit.Spade);
        hand2[1] = PokerCard(CardType.King, CardSuit.Spade);
        hand2[2] = PokerCard(CardType.Queen, CardSuit.Spade);
        hand2[3] = PokerCard(CardType.Jack, CardSuit.Spade);
        hand2[4] = PokerCard(CardType.Ten, CardSuit.Spade);

        Result result = TexasPoker.compare(hand1, hand2);
        assertEq(uint256(result), uint256(Result.Tie));
    }

    function test_Win() public {
        // AS KS QS JS TS
        PokerCard[5] memory hand1;
        hand1[0] = PokerCard(CardType.Ace, CardSuit.Spade);
        hand1[1] = PokerCard(CardType.King, CardSuit.Spade);
        hand1[2] = PokerCard(CardType.Queen, CardSuit.Spade);
        hand1[3] = PokerCard(CardType.Jack, CardSuit.Spade);
        hand1[4] = PokerCard(CardType.Ten, CardSuit.Spade);

        // 9S 9H 9D 9C 8S
        PokerCard[5] memory hand2;
        hand2[0] = PokerCard(CardType.Nine, CardSuit.Spade);
        hand2[1] = PokerCard(CardType.Nine, CardSuit.Heart);
        hand2[2] = PokerCard(CardType.Nine, CardSuit.Diamond);
        hand2[3] = PokerCard(CardType.Nine, CardSuit.Club);
        hand2[4] = PokerCard(CardType.Eight, CardSuit.Spade);

        Result result = TexasPoker.compare(hand1, hand2);
        assertEq(uint256(result), uint256(Result.Win));
    }

    function test_Loss() public {
        // 9S 9H 9D 9C 8S
        PokerCard[5] memory hand1;
        hand1[0] = PokerCard(CardType.Nine, CardSuit.Spade);
        hand1[1] = PokerCard(CardType.Nine, CardSuit.Heart);
        hand1[2] = PokerCard(CardType.Nine, CardSuit.Diamond);
        hand1[3] = PokerCard(CardType.Nine, CardSuit.Club);
        hand1[4] = PokerCard(CardType.Eight, CardSuit.Spade);

        // AS KS QS JS TS
        PokerCard[5] memory hand2;
        hand2[0] = PokerCard(CardType.Ace, CardSuit.Spade);
        hand2[1] = PokerCard(CardType.King, CardSuit.Spade);
        hand2[2] = PokerCard(CardType.Queen, CardSuit.Spade);
        hand2[3] = PokerCard(CardType.Jack, CardSuit.Spade);
        hand2[4] = PokerCard(CardType.Ten, CardSuit.Spade);

        Result result = TexasPoker.compare(hand1, hand2);
        assertEq(uint256(result), uint256(Result.Loss));
    }
}
