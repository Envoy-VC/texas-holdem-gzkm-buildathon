// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Point} from "../secret-engine/Verifiers.sol";

interface IGame {
    error NotEnoughPlayers();
    error GameAlreadyStarted();
    error GameNotStarted();

    error ShuffleVerificationError();
    error RevealTokenVerificationError();
    error RevealTokenAlreadyExists();

    struct Player {
        address addr;
        Point publicKey;
    }

    struct RevealToken {
        address player;
        Point token;
    }
}
