// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IGame, Player} from "./interfaces/IGame.sol";
import {ZgRevealVerifier, ZgShuffleVerifier, MaskedCard, Point} from "./secret-engine/Verifiers.sol";

// Modules
import {Shuffle} from "./modules/Shuffle.sol";

contract Game is IGame, Shuffle {
    /// =================================================================
    ///                         State Variables
    /// =================================================================

    mapping(uint256 => Player) public _players;
    mapping(address => bool) public _isPlayer;
    uint8 public _totalPlayers;

    mapping(address => uint256) public _bets;
    uint8 public _nextBet;

    bool _gameStarted;

    /// =================================================================
    ///                         Constructor
    /// =================================================================

    constructor(address _revealVerifier, address _shuffleVerifier, Player memory _initialPlayer) {
        _players[_totalPlayers] = _initialPlayer;
        revealVerifier = ZgRevealVerifier(_revealVerifier);
        shuffleVerifier = ZgShuffleVerifier(_shuffleVerifier);
        _totalPlayers++;
        _isPlayer[_initialPlayer.addr] = true;
    }

    /// =================================================================
    ///                         Modifiers
    /// =================================================================

    modifier onlyPlayer(address _player) {
        if (!_isPlayer[_player]) {
            revert NotAPlayer();
        }
        _;
    }

    /// =================================================================
    ///                         Write Functions
    /// =================================================================

    function joinGame(Player memory _player) public {
        if (_isPlayer[_player.addr]) {
            revert AlreadyAPlayer();
        }
        _players[_totalPlayers] = _player;
        _totalPlayers++;
        _isPlayer[_player.addr] = true;
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
    ) public onlyPlayer(msg.sender) {
        _initShuffle(_publicKeyCommitment, _oldDeck, _newDeck, _proof);
    }

    function shuffle(uint256[4][52] calldata _newDeck, bytes calldata _proof) public onlyPlayer(msg.sender) {
        _shuffle(_newDeck, _proof);
    }

    function addRevealToken(uint8 index, RevealToken calldata revealToken, uint256[8] calldata proof) public {
        Player memory player = getPlayer(msg.sender);
        if (player.addr == address(0)) {
            revert NotAPlayer();
        }

        _addRevealToken(index, revealToken, proof, player);
    }

    function addMultipleRevealTokens(uint8[] memory indexes, RevealToken[] calldata revealTokens)
        public
        onlyPlayer(msg.sender)
    {
        _addMultipleRevealTokens(indexes, revealTokens);
    }

    function addBet(uint256 _amount) public onlyPlayer(msg.sender) {
        Player memory player = _players[_nextBet];

        if (player.addr != msg.sender) {
            revert InvalidBetSequence();
        }

        if (_nextBet == _totalPlayers - 1) {
            _nextBet = 0;
            // TODO: Round Complete Start New Round
        } else {
            _nextBet++;
        }
        _bets[msg.sender] = _amount;

        // get next bet if more than total player make it 0
    }

    /// =================================================================
    ///                         View Functions
    /// =================================================================

    function getPlayer(address addr) public view returns (Player memory) {
        Player memory player;
        for (uint8 i = 0; i < _totalPlayers; i++) {
            if (_players[i].addr == addr) {
                player = _players[i];
            }
        }
        return player;
    }
}
