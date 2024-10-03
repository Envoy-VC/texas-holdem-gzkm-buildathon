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

    function _initShuffle(
        uint256[] calldata _publicKeyCommitment,
        uint256[4][52] calldata _oldDeck,
        uint256[4][52] calldata _newDeck,
        bytes calldata _proof
    ) internal {
        if (deck.length != 0) {
            revert AlreadyShuffled();
        }

        publicKeyCommitment = _publicKeyCommitment;
        uint256[] memory input = new uint256[](52 * 4 * 2);

        for (uint8 i = 0; i < 52; i++) {
            input[i * 4 + 0] = _oldDeck[i][0];
            input[i * 4 + 1] = _oldDeck[i][1];
            input[i * 4 + 2] = _oldDeck[i][2];
            input[i * 4 + 3] = _oldDeck[i][3];

            input[i * 4 + 0 + 208] = _newDeck[i][0];
            input[i * 4 + 1 + 208] = _newDeck[i][1];
            input[i * 4 + 2 + 208] = _newDeck[i][2];
            input[i * 4 + 3 + 208] = _newDeck[i][3];
        }

        bool verified = shuffleVerifier.verifyShuffle(_proof, input, _publicKeyCommitment);

        if (!verified) {
            revert ShuffleVerificationError();
        }

        deck = _newDeck;
    }

    function _shuffle(uint256[4][52] calldata _newDeck, bytes calldata _proof) internal {
        require(deck.length == 52);

        uint256[] memory input = new uint256[](52 * 4 * 2);

        for (uint8 i = 0; i < 52; i++) {
            input[i * 4 + 0] = deck[i][0];
            input[i * 4 + 1] = deck[i][1];
            input[i * 4 + 2] = deck[i][2];
            input[i * 4 + 3] = deck[i][3];

            input[i * 4 + 0 + 208] = _newDeck[i][0];
            input[i * 4 + 1 + 208] = _newDeck[i][1];
            input[i * 4 + 2 + 208] = _newDeck[i][2];
            input[i * 4 + 3 + 208] = _newDeck[i][3];
        }

        bool verified = ZgShuffleVerifier(shuffleVerifier).verifyShuffle(_proof, input, publicKeyCommitment);

        if (!verified) {
            revert ShuffleVerificationError();
        }

        deck = _newDeck;
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
    }

    function _addRevealToken(
        uint8 index,
        RevealToken calldata revealToken,
        uint256[8] calldata proof,
        Player memory player
    ) internal {
        bool success = ZgRevealVerifier(revealVerifier).verifyRevealWithSnark(
            [
                deck[index][2],
                deck[index][3],
                revealToken.token.x,
                revealToken.token.y,
                player.publicKey.x,
                player.publicKey.y
            ],
            proof
        );

        if (!success) {
            revert RevealTokenVerificationError();
        }

        checkAndAddRevealToken(index, revealToken);
    }

    function _addMultipleRevealTokens(uint8[] memory indexes, RevealToken[] calldata revealTokens) internal {
        // Proof Already verified on Frontend
        for (uint8 i = 0; i < indexes.length; i++) {
            checkAndAddRevealToken(indexes[i], revealTokens[i]);
        }
    }

    function getRevealTokens(uint8 index) public view returns (Point[] memory) {
        RevealToken[] memory allTokens = _revealTokens[index];
        uint256 newLength = allTokens.length - 1;
        Point[] memory _newTokens = new Point[](newLength);

        for (uint8 i = 0; i < allTokens.length; i++) {
            if (allTokens[i].player != msg.sender) {
                _newTokens[i] = allTokens[i].token;
            }
        }

        return _newTokens;
    }

    function revealCard(uint8 index) public view returns (uint8) {
        Point[] memory rTokens = getRevealTokens(index);
        uint8 cardId = revealVerifier.unmaskCard(
            MaskedCard(deck[index][0], deck[index][1], deck[index][2], deck[index][3]), rTokens
        );
        return cardId;
    }
}
