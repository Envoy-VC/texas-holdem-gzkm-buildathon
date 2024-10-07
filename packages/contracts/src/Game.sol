// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IGame, Player, GameRound, PlayerWitWeight} from "./interfaces/IGame.sol";
import {ZgRevealVerifier, ZgShuffleVerifier, MaskedCard, Point} from "./secret-engine/Verifiers.sol";

import {TexasPoker, PokerCard} from "./libraries/TexasPoker.sol";

// Modules
import {Shuffle} from "./modules/Shuffle.sol";

contract Game is IGame, Shuffle {
    /// =================================================================
    ///                         State Variables
    /// =================================================================

    mapping(uint256 => Player) public _players;
    mapping(address => bool) public _isPlayer;
    uint8 public _totalPlayers;

    mapping(uint256 => uint256) public _weights;
    Player public winner;

    // Bets
    mapping(address => uint256) public _bets;
    uint8 public _nextBet;
    uint256 public _highestBet;

    // Game State
    bool public _gameStarted;
    GameRound public _currentRound;
    mapping(address => bool) public _isFolded;
    uint256 public _totalFolds;

    // Cards
    mapping(uint256 => uint8[5]) public _playerCards;
    uint8[5] public _communityCards;
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
        if (_gameStarted) {
            revert GameAlreadyStarted();
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

    function initShuffle(uint256[] calldata _publicKeyCommitment, uint256[4][52] calldata _newDeck)
        public
        onlyPlayer(msg.sender)
    {
        _initShuffle(_publicKeyCommitment, _newDeck);
    }

    function shuffle(uint256[4][52] calldata _newDeck) public onlyPlayer(msg.sender) {
        _shuffle(_newDeck);
    }

    function addRevealToken(uint8 index, RevealToken calldata revealToken) public {
        Player memory player = getPlayer(msg.sender);
        if (player.addr == address(0)) {
            revert NotAPlayer();
        }

        _addRevealToken(index, revealToken);
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
        _isShuffled();
        _isPlayerNotFolded(msg.sender);

        if (_currentRound == GameRound.End) {
            revert GameEnded();
        }

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
        _isShuffled();
        if (_isFolded[msg.sender]) {
            revert AlreadyFolded();
        }
        _isFolded[msg.sender] = true;
        _totalFolds++;
    }

    function chooseCards(uint8[3] memory cards) public onlyPlayer(msg.sender) {
        if (_currentRound != GameRound.End) {
            revert GameNotEnded();
        }

        // check if three cards are in community cards.
        for (uint8 i = 0; i < 3; i++) {
            bool found = false;
            for (uint8 j = 0; j < 5; j++) {
                if (_communityCards[j] == cards[i]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                revert NotACommunityCard();
            }
        }

        // check if all are unique
        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = i + 1; j < 3; j++) {
                if (cards[i] == cards[j]) {
                    revert DuplicateCommunityCard();
                }
            }
        }

        uint256 playerIndex = getPlayerIndex(msg.sender);

        _playerCards[playerIndex][2] = cards[0];
        _playerCards[playerIndex][3] = cards[1];
        _playerCards[playerIndex][4] = cards[2];
    }

    function declareWinner() public {
        if (winner.addr != address(0)) {
            revert WinnerAlreadyDeclared();
        }

        Player[] memory players = getPlayersInGame();

        uint8[5][] memory revealedCards = new uint8[5][](players.length);
        PokerCard[5][] memory cards = new PokerCard[5][](players.length);
        uint256[] memory weights = new uint256[](players.length);

        for (uint256 i = 0; i < players.length; i++) {
            uint256 index = getPlayerIndex(players[i].addr);
            revealedCards[i] = revealMultipleCards(_playerCards[index]);
            cards[i] = TexasPoker.toPokerCards(revealedCards[i]);
            weights[i] = TexasPoker.getWeight(cards[i]);
            _weights[index] = weights[i];
        }

        // Get index of largest weight
        uint256 maxIndex = 0;
        for (uint256 i = 1; i < _totalPlayers; i++) {
            if (weights[i] > weights[maxIndex]) {
                maxIndex = i;
            }
        }

        uint256 winnerIndex = getPlayerIndex(players[maxIndex].addr);
        winner = _players[winnerIndex];
        // Move pot to winner
        for (uint256 i = 0; i < _totalPlayers; i++) {
            _bets[_players[i].addr] = 0;
        }
        _bets[winner.addr] = getPotAmount();
    }

    /// =================================================================
    ///                         View Functions
    /// =================================================================

    function getDeck() public view returns (uint256[4][] memory) {
        return deck;
    }

    function getPublicKeyCommitment() public view returns (uint256[] memory) {
        return publicKeyCommitment;
    }

    function getPlayer(address addr) public view returns (Player memory) {
        Player memory player;
        for (uint8 i = 0; i < _totalPlayers; i++) {
            if (_players[i].addr == addr) {
                player = _players[i];
                break;
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
        uint256 index = getPlayerIndex(player);
        return _playerCards[index];
    }

    function getPlayerWeight(address player) public view returns (uint256) {
        uint256 index = getPlayerIndex(player);
        return _weights[index];
    }

    function getAllWeights() public view returns (PlayerWitWeight[] memory) {
        PlayerWitWeight[] memory players = new PlayerWitWeight[](_totalPlayers);
        for (uint8 i = 0; i < _totalPlayers; i++) {
            players[i] = PlayerWitWeight(_players[i].addr, _weights[i]);
        }
        return players;
    }

    function getPlayerRevealedCards(address player) public view returns (uint8[] memory) {
        uint256 index = getPlayerIndex(player);
        uint8[] memory cards = new uint8[](5);
        for (uint8 i = 0; i < 5; i++) {
            if (_playerCards[index][i] != 0) {
                cards[i] = revealCard(_playerCards[index][i]);
            }
        }
        return cards;
    }

    function getCommunityCards() public view returns (uint8[5] memory) {
        return _communityCards;
    }

    function getPlayersInGame() public view returns (Player[] memory) {
        Player[] memory players = new Player[](_totalPlayers - _totalFolds);
        for (uint256 i = 0; i < _totalPlayers - _totalFolds; i++) {
            if (!_isFolded[_players[i].addr]) {
                players[i] = _players[i];
            }
        }

        return players;
    }

    function getRevealedCommunityCards() public view returns (uint8[] memory) {
        uint8[] memory cards = new uint8[](5);
        for (uint8 i = 0; i < 5; i++) {
            if (_communityCards[i] != 0) {
                cards[i] = revealCard(_communityCards[i]);
            }
        }

        return cards;
    }

    function getPendingCommunityRevealTokens(address user) public view returns (uint8[] memory) {
        uint8[] memory cards = new uint8[](5);
        for (uint8 i = 0; i < 5; i++) {
            if (_communityCards[i] != 0) {
                bool hasRevealToken = hasRevealToken(_communityCards[i], user);
                if (!hasRevealToken) {
                    cards[i] = _communityCards[i];
                }
            }
        }

        return cards;
    }

    function getPendingPlayerRevealTokens(address user) public view returns (uint8[] memory) {
        uint8[] memory cards = new uint8[](_totalPlayers * 2);
        for (uint256 i = 0; i < _totalPlayers; i++) {
            if (_players[i].addr != user) {
                uint8[5] memory pCards = _playerCards[i];
                for (uint256 j = 0; j < 2; j++) {
                    bool hasRevealToken = hasRevealToken(pCards[j], user);
                    if (!hasRevealToken) {
                        cards[j] = pCards[j];
                    }
                }
            } else {
                if (_currentRound == GameRound.End) {
                    uint8[5] memory pCards = _playerCards[i];
                    for (uint256 j = 0; j < 2; j++) {
                        bool hasRevealToken = hasRevealToken(pCards[j], user);
                        if (!hasRevealToken) {
                            cards[j] = pCards[j];
                        }
                    }
                }
            }
        }

        return cards;
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
            _addCommunityCards(0, 3);
        } else if (_currentRound == GameRound.Flop) {
            _addCommunityCards(3, 4);
            _currentRound = GameRound.Turn;
        } else if (_currentRound == GameRound.Turn) {
            _addCommunityCards(4, 5);
            _currentRound = GameRound.River;
        } else {
            _currentRound = GameRound.End;
        }
    }

    function getPlayerIndex(address player) internal view returns (uint256) {
        for (uint256 i = 0; i < _totalPlayers; i++) {
            if (_players[i].addr == player) {
                return i;
            }
        }
        revert NotAPlayer();
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

    function _isPlayerNotFolded(address player) internal view {
        if (_isFolded[player] == true) {
            revert PlayerFolded();
        }
    }

    function _isValidBet(uint256 amount) internal view {
        if (amount < _highestBet) {
            revert InvalidBetAmount();
        }
    }

    function _addCommunityCards(uint8 start, uint8 end) internal {
        uint8 nextCard = _nextCard;
        for (uint8 i = start; i < end; i++) {
            _communityCards[i] = nextCard;
            nextCard++;
        }
        _nextCard = nextCard;
    }

    function _isShuffled() internal view {
        if (_totalShuffles != _totalPlayers) {
            revert NotShuffled();
        }
    }
}
