// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {QuickSort} from "./QuickSort.sol";

enum CardType {
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace
}

enum CardSuit {
    Spade,
    Heart,
    Diamond,
    Club
}

struct PokerCard {
    CardType cardType;
    CardSuit cardSuit;
}

enum Result {
    Win,
    Loss,
    Tie
}

library TexasPoker {
    uint8 public constant HAND_SIZE = 5;

    error InvalidHandSize();

    function getNumbers(PokerCard[5] memory hand) public returns (uint8[] memory) {
        if (hand.length != HAND_SIZE) {
            revert InvalidHandSize();
        }

        uint8[] memory numbers = new uint8[](HAND_SIZE);
        for (uint8 i = 0; i < HAND_SIZE; i++) {
            numbers[i] = uint8(hand[i].cardType) + 2; // Start with 2 instead of 0
        }

        uint8[] memory sorted = QuickSort.sort(numbers);
        return sorted;
    }

    /// @dev Checks if a hand is straight
    /// @param numbers The number representation of the cards
    /// @return result Whether the hand is a straight
    /// @return highest The highest card in the straight
    function isStraight(uint8[] memory numbers) public pure returns (bool, uint8) {
        bool result = true;
        for (uint8 i = 0; i < HAND_SIZE - 1; i++) {
            if (numbers[i + 1] - numbers[i] != 1) {
                result = false;
                break;
            }
        }

        return (result, numbers[HAND_SIZE - 1]);
    }

    /// @dev Checks if a hand is a flush
    /// @param hand The Cards for the player
    /// @return result Whether the hand is a flush
    /// @return highest The highest card in the flush
    function isFlush(PokerCard[5] memory hand, uint8[] memory numbers) public pure returns (bool, uint8) {
        bool result = true;

        for (uint8 i = 0; i < HAND_SIZE - 1; i++) {
            if (hand[i].cardSuit != hand[i + 1].cardSuit) {
                result = false;
                break;
            }
        }

        return (result, numbers[HAND_SIZE - 1]);
    }

    /// @dev Checks if a hand is a straight flush
    /// @param hand The Cards for the player
    /// @return result Whether the hand is a straight flush
    /// @return highest The highest card in the straight flush
    function isStraightFlush(PokerCard[5] memory hand, uint8[] memory numbers) public pure returns (bool, uint8) {
        (bool isStraightResult, uint8 highestStraight) = isStraight(numbers);
        (bool isFlushResult,) = isFlush(hand, numbers);

        return (isStraightResult && isFlushResult, highestStraight);
    }

    /// @dev Checks if a hand is a royal flush
    /// @param hand The Cards for the player
    /// @return result Whether the hand is a royal flush
    /// @return highest The highest card in the royal flush
    function isRoyalFlush(PokerCard[5] memory hand, uint8[] memory numbers) public pure returns (bool, uint8) {
        (bool isStraightFlushResult, uint8 highestStraightFlush) = isStraightFlush(hand, numbers);

        return (isStraightFlushResult && highestStraightFlush == 14, 14);
    }

    /// @dev Checks if there is any card that appears t times in the hand
    /// @param numbers The number representation of the cards
    /// @param t The number of times a card should appear
    /// @return result Whether there is a card that appears t times
    /// @return max The card that appears t times
    function times(uint8 t, uint8[] memory numbers) public pure returns (bool, uint8) {
        uint8[15] memory occurencies;

        for (uint8 i = 0; i < HAND_SIZE; i++) {
            occurencies[numbers[i]] = occurencies[numbers[i]] + 1;
        }

        bool result = false;
        uint8 max;
        for (uint8 i = 0; i < HAND_SIZE; i++) {
            if (occurencies[numbers[i]] == t) {
                result = true;
                max = numbers[i];
            }
        }

        return (result, max);
    }

    /// @dev Checks if a hand is four-of-kind
    /// @param numbers The number representation of the cards
    /// @return result Whether the hand is four-of-kind
    /// @return max The card that appears four times
    function isFourOfKind(uint8[] memory numbers) public pure returns (bool, uint8) {
        return times(4, numbers);
    }

    /// @dev Checks if a hand is three-of-kind
    /// @param numbers The number representation of the cards
    /// @return result Whether the hand is three-of-kind
    /// @return max The card that appears three times
    function isThreeOfKind(uint8[] memory numbers) public pure returns (bool, uint8) {
        return times(3, numbers);
    }

    /// @dev Checks if a hand is a full house
    /// @param numbers The number representation of the cards
    /// @return result Whether the hand is a full house
    /// @return max The card that appears three times
    function isFullHouse(uint8[] memory numbers) public pure returns (bool, uint8) {
        uint8[15] memory occurencies;

        for (uint8 i = 0; i < HAND_SIZE; i++) {
            occurencies[numbers[i]] = occurencies[numbers[i]] + 1;
        }

        uint8 twoIndex = 0;
        uint8 threeIndex = 0;
        for (uint8 i = 0; i < 15; i++) {
            if (occurencies[i] == 2) {
                twoIndex = i;
            } else if (occurencies[i] == 3) {
                threeIndex = i;
            }
        }

        if (twoIndex != 0 && threeIndex != 0) {
            return (true, threeIndex);
        } else {
            return (false, 0);
        }
    }

    /// @dev Checks if a hand is two pair
    /// @param numbers The number representation of the cards
    /// @return result Whether the hand is two pair
    /// @return max The highest card in the two pair
    function isTwoPair(uint8[] memory numbers) public pure returns (bool, uint8) {
        uint8[15] memory occurencies;

        for (uint8 i = 0; i < HAND_SIZE; i++) {
            occurencies[numbers[i]] = occurencies[numbers[i]] + 1;
        }

        uint8[] memory twopairs = new uint8[](2);
        uint8 index = 0;
        for (uint8 i = 0; i < 15; i++) {
            if (occurencies[i] == 2) {
                twopairs[index] = i;
                index++;
            }
        }

        return (index == 2, twopairs[1]);
    }

    /// @dev Checks if a hand is a single pair
    /// @param numbers The number representation of the cards
    /// @return result Whether the hand is a single pair
    /// @return max The highest card in the single pair
    function isSinglePair(uint8[] memory numbers) public pure returns (bool, uint8) {
        uint8[15] memory occurencies;

        for (uint8 i = 0; i < HAND_SIZE; i++) {
            occurencies[numbers[i]] = occurencies[numbers[i]] + 1;
        }

        uint8 pair;
        uint8 max = 0;
        for (uint8 i = 0; i < 15; i++) {
            if (occurencies[i] == 2) {
                pair = i;
            } else {
                max = i;
            }
        }

        return (pair != 0, max);
    }

    /// @dev Get the weight of a hand
    /// @param hand The Cards for the player
    /// @return weight The weight of the hand
    function getWeight(PokerCard[5] memory hand) public returns (uint256) {
        uint8[] memory numbers = getNumbers(hand);

        (bool isRoyalFlushResult,) = isRoyalFlush(hand, numbers);
        if (isRoyalFlushResult) return type(uint256).max;

        (bool isStraightFlushResult, uint8 highestStraightFlush) = isStraightFlush(hand, numbers);
        if (isStraightFlushResult) return 1000 + highestStraightFlush;

        (bool isFourOfKindResult, uint8 highestFourOfKind) = isFourOfKind(numbers);
        if (isFourOfKindResult) return 900 + highestFourOfKind;

        (bool isFullHouseResult, uint8 highestFullHouse) = isFullHouse(numbers);
        if (isFullHouseResult) return 800 + highestFullHouse;

        (bool isFlushResult, uint8 highestFlush) = isFlush(hand, numbers);
        if (isFlushResult) return 700 + highestFlush;

        (bool isStraightResult, uint8 highestStraight) = isStraight(numbers);
        if (isStraightResult) return 600 + highestStraight;

        (bool isThreeOfKindResult, uint8 highestThreeOfKind) = isThreeOfKind(numbers);
        if (isThreeOfKindResult) return 500 + highestThreeOfKind;

        (bool isTwoPairResult, uint8 highestTwoPair) = isTwoPair(numbers);
        if (isTwoPairResult) return 400 + highestTwoPair;

        (bool isSinglePairResult,) = isSinglePair(numbers);
        if (isSinglePairResult) return 300;

        return numbers[HAND_SIZE - 1];
    }

    /// @dev Compare two hands
    /// @param player1Hand The Cards for the first player
    /// @param player2Hand The Cards for the second player
    /// @return result The result of the comparison with respect to the first player
    function compare(PokerCard[5] memory player1Hand, PokerCard[5] memory player2Hand) public returns (Result) {
        uint256 ourWeight = getWeight(player1Hand);
        uint256 opponentWeight = getWeight(player2Hand);

        if (ourWeight > opponentWeight) {
            return Result.Win;
        } else if (ourWeight < opponentWeight) {
            return Result.Loss;
        } else {
            uint8[] memory ourNumbers = getNumbers(player1Hand);
            uint8[] memory opponentNumbers = getNumbers(player2Hand);

            uint8 j = HAND_SIZE;
            while (j > 0) {
                if (ourNumbers[j - 1] > opponentNumbers[j - 1]) return Result.Win;
                else if (opponentNumbers[j - 1] > ourNumbers[j - 1]) return Result.Loss;
                j--;
            }
            return Result.Tie;
        }
    }

    function toPokerCard(uint8 number) public pure returns (PokerCard memory) {
        uint8 cardType = number % 13;
        uint8 cardSuit = number / 13;

        PokerCard memory card = PokerCard(CardType(cardType), CardSuit(cardSuit));

        return card;
    }

    function toPokerCards(uint8[5] memory numbers) public pure returns (PokerCard[5] memory) {
        PokerCard[5] memory cards;

        for (uint8 i = 0; i < 5; i++) {
            cards[i] = toPokerCard(numbers[i]);
        }

        return cards;
    }
}
