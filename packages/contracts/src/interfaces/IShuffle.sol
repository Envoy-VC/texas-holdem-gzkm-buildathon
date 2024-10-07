// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IShuffle {
    error AlreadyShuffled();
    error ShuffleVerificationError();
    error RevealTokenVerificationError();
    error RevealTokenAlreadyExists();

    error NotShuffled();

    error NotEqualIndexesAndRevealTokens();
}
