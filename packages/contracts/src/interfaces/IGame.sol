// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Point} from "../secret-engine/Verifiers.sol";

struct Player {
    address addr;
    Point publicKey;
}

enum GameRound {
    Ante,
    PreFlop,
    Flop,
    Turn,
    River,
    End
}

struct PlayerWitWeight {
    address addr;
    uint256 weight;
}

interface IGame {
    error NotEnoughPlayers();
    error GameAlreadyStarted();
    error GameNotStarted();
    error NotAPlayer();
    error AlreadyAPlayer();

    error InvalidBetAmount();
    error InvalidBetSequence();

    error LastRound();

    error PlayerFolded();
    error AlreadyFolded();

    error GameEnded();
    error GameNotEnded();

    error NotACommunityCard();
    error DuplicateCommunityCard();

    error WinnerAlreadyDeclared();
}
