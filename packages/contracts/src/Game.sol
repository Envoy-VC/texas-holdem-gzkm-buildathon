// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IGame} from "./interfaces/IGame.sol";
import {ZgRevealVerifier, ZgShuffleVerifier, MaskedCard, Point} from "./secret-engine/Verifiers.sol";

contract Game is IGame {
    mapping(uint256 => Player) public _players;
    uint8 public _totalPlayers;
    Point public gameKey;

    bool _gameStarted;

    ZgRevealVerifier public revealVerifier;
    ZgShuffleVerifier public shuffleVerifier;

    uint256[4][] public deck;
    uint256[] public publicKeyCommitment;

    mapping(uint256 => RevealToken[]) public _revealTokens;

    constructor(address _revealVerifier, address _shuffleVerifier, Player memory _initialPlayer) {
        _players[_totalPlayers] = _initialPlayer;
        _totalPlayers++;
        revealVerifier = ZgRevealVerifier(_revealVerifier);
        shuffleVerifier = ZgShuffleVerifier(_shuffleVerifier);
    }

    function startGame() public {
        if (_gameStarted) {
            revert GameAlreadyStarted();
        }
        if (_totalPlayers < 2) {
            revert NotEnoughPlayers();
        }
        _gameStarted = true;
        Point[] memory publicKeys = new Point[](_totalPlayers);
        for (uint256 i = 0; i < _totalPlayers; i++) {
            publicKeys[i] = _players[i].publicKey;
        }
        gameKey = revealVerifier.aggregateKeys(publicKeys);
    }

    function initShuffle(
        uint256[] calldata _publicKeyCommitment,
        uint256[4][52] calldata _oldDeck,
        uint256[4][52] calldata _newDeck,
        bytes calldata _proof
    ) public {
        require(deck.length == 0);
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

    function shuffle(uint256[4][52] calldata _newDeck, bytes calldata _proof) public {
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

    function getPlayer(address addr) public view returns (Player memory) {
        Player memory player;
        for (uint8 i = 0; i < _totalPlayers; i++) {
            if (_players[i].addr == addr) {
                player = _players[i];
            }
        }

        return player;
    }

    function addRevealToken(uint8 index, RevealToken memory token) internal {
        // check if there exists another reveal token from the same player
        RevealToken[] memory revealTokens = _revealTokens[index];
        for (uint8 i = 0; i < revealTokens.length; i++) {
            if (revealTokens[i].player == token.player) {
                revert RevealTokenAlreadyExists();
            }
        }

        _revealTokens[index].push(token);
    }

    function addRevealToken(uint8 index, RevealToken calldata revealToken, uint256[8] calldata proof) public {
        Player memory player = getPlayer(msg.sender);
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

        addRevealToken(index, revealToken);
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
