// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Point} from "../secret-engine/Verifiers.sol";

struct Player {
    address addr;
    Point publicKey;
}

interface IGame {
    error NotEnoughPlayers();
    error GameAlreadyStarted();
    error GameNotStarted();
    error NotAPlayer();
    error AlreadyAPlayer();

    error InvalidBetAmount();
    error InvalidBetSequence();
}
