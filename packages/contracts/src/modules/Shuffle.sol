// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Interfaces
import {Player} from "../interfaces/IGame.sol";
import {IShuffle} from "../interfaces/IShuffle.sol";

import {ZgRevealVerifier, ZgShuffleVerifier, MaskedCard, Point} from "../secret-engine/Verifiers.sol";

contract Shuffle is IShuffle {
    struct RevealToken {
        address player;
        Point token;
    }

    ZgRevealVerifier public revealVerifier;
    ZgShuffleVerifier public shuffleVerifier;

    Point public gameKey;

    uint256[4][] public deck;
    uint256[] public publicKeyCommitment;

    mapping(uint256 => RevealToken[]) public _revealTokens;
    mapping(uint256 => mapping(address => RevealToken)) public _revealTokensForUser;

    mapping(address => bool) public _shuffled;
    uint256 public _totalShuffles;

    function _initShuffle(uint256[] calldata _publicKeyCommitment, uint256[4][52] calldata _newDeck) internal {
        deck = _newDeck;
        publicKeyCommitment = _publicKeyCommitment;
        _totalShuffles++;
        _shuffled[msg.sender] = true;
    }

    function _shuffle(uint256[4][52] calldata _newDeck) internal {
        require(deck.length == 52);

        deck = _newDeck;
        _totalShuffles++;
        _shuffled[msg.sender] = true;
    }

    function checkAndAddRevealToken(uint8 index, RevealToken memory token) internal {
        // check if there exists another reveal token from the same player
        RevealToken[] memory revealTokens = _revealTokens[index];
        for (uint8 i = 0; i < revealTokens.length; i++) {
            if (revealTokens[i].player == token.player) {
                revert RevealTokenAlreadyExists();
            }
        }

        _revealTokens[index].push(token);
        _revealTokensForUser[index][token.player] = token;
    }

    function _addRevealToken(uint8 index, RevealToken calldata revealToken) internal {
        checkAndAddRevealToken(index, revealToken);
    }

    function _addMultipleRevealTokens(uint8[] memory indexes, RevealToken[] calldata revealTokens) internal {
        if (indexes.length != revealTokens.length) {
            revert NotEqualIndexesAndRevealTokens();
        }
        // Proof Already verified on Frontend
        for (uint8 i = 0; i < indexes.length; i++) {
            checkAndAddRevealToken(indexes[i], revealTokens[i]);
        }
    }

    function getRevealPoints(uint8 index) public view returns (Point[] memory) {
        RevealToken[] memory tokens = _revealTokens[index];
        Point[] memory _newTokens = new Point[](tokens.length);

        for (uint8 i = 0; i < tokens.length; i++) {
            _newTokens[i] = tokens[i].token;
        }

        return _newTokens;
    }

    function getRevealTokens(uint8 index) public view returns (RevealToken[] memory) {
        return _revealTokens[index];
    }

    function revealCard(uint8 index) public view returns (uint8) {
        Point[] memory rTokens = getRevealPoints(index);
        uint8 cardId = revealVerifier.unmaskCard(
            MaskedCard(deck[index][0], deck[index][1], deck[index][2], deck[index][3]), rTokens
        );
        return cardId;
    }

    function revealMultipleCards(uint8[5] memory indexes) public view returns (uint8[5] memory) {
        uint8[5] memory results;

        for (uint8 i = 0; i < 5; i++) {
            results[i] = revealCard(indexes[i]);
        }

        return results;
    }

    function revealMultiple(uint8[] memory indexes) public view returns (uint8[] memory) {
        uint8[] memory results = new uint8[](indexes.length);

        for (uint8 i = 0; i < indexes.length; i++) {
            results[i] = revealCard(indexes[i]);
        }

        return results;
    }

    function hasRevealToken(uint8 index, address user) public view returns (bool) {
        return _revealTokensForUser[index][user].player == user;
    }
}
