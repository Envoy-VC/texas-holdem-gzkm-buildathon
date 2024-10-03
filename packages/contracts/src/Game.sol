// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IGame, Player, GameRound} from "./interfaces/IGame.sol";
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

    // Bets
    mapping(address => uint256) public _bets;
    uint8 public _nextBet;
    uint256 public _highestBet;

    // Game State
    bool _gameStarted;
    GameRound public _currentRound;
    mapping(address => bool) public _isFolded;

    // Cards
    mapping(uint256 => uint8[5]) _playerCards;
    uint8 public _nextCard;

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
        // gameKey = revealVerifier.aggregateKeys(publicKeys);
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

    function placeBet(uint256 _amount) public onlyPlayer(msg.sender) {
        _isPlayerTurn(msg.sender);
        _isValidBet(_amount);

        if (_nextBet == _totalPlayers - 1) {
            _nextBet = 0;
            _nextRound();
        } else {
            _nextBet++;
        }

        _bets[msg.sender] += _amount;
        if (_amount > _highestBet) {
            _highestBet = _amount;
        }
    }

    function fold() public onlyPlayer(msg.sender) {
        _isPlayerTurn(msg.sender);
        if (_isFolded[msg.sender]) {
            revert AlreadyFolded();
        }
        _isFolded[msg.sender] = true;
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

    function nextPlayer() public view returns (Player memory) {
        return _players[_nextBet];
    }

    function getPotAmount() public view returns (uint256) {
        uint256 potAmount = 0;
        for (uint8 i = 0; i < _totalPlayers; i++) {
            potAmount += _bets[_players[i].addr];
        }
        return potAmount;
    }

    function getPlayerCards(address player) public view returns (uint8[5] memory) {
        uint256 index = 0;
        for (uint256 i = 0; i < _totalPlayers; i++) {
            if (_players[i].addr == player) {
                index = i;
            }
        }
        return _playerCards[index];
    }

    /// =================================================================
    ///                         Internal Functions
    /// =================================================================

    function _nextRound() internal {
        if (_currentRound == GameRound.Ante) {
            _distributeCards();
            _currentRound = GameRound.PreFlop;
        } else if (_currentRound == GameRound.PreFlop) {
            _currentRound = GameRound.Flop;
            // TODO: Reveal Three Community Cards
        } else if (_currentRound == GameRound.Flop) {
            // TODO: Reveal Next Card
            _currentRound = GameRound.Turn;
        } else if (_currentRound == GameRound.Turn) {
            // TODO: Reveal Last Card
            _currentRound = GameRound.River;
        } else {
            // TODO: Calculate Results
        }
    }

    function _distributeCards() internal {
        // Discard first card and the give 2 cards to each
        uint8 nextCard = 1;
        for (uint256 i = 0; i < _totalPlayers; i++) {
            _playerCards[i][0] = nextCard;
            _playerCards[i][1] = nextCard + 1;
            nextCard += 2;
        }
        _nextCard = nextCard;
    }

    function _isPlayerTurn(address player) internal view {
        if (_players[_nextBet].addr != player) {
            revert InvalidBetSequence();
        }
    }

    function _isValidBet(uint256 amount) internal view {
        if (amount < _highestBet) {
            revert InvalidBetAmount();
        }
    }
}
