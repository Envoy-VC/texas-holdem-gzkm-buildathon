// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Player} from "./interfaces/IGame.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

// Game Contract for Bytecode
import {Game} from "./Game.sol";

contract GameFactory {
    mapping(uint256 => address) public _games;
    uint256 public _nextGameId;

    constructor() {}

    function createGame(bytes32 salt, address _revealVerifier, address _shuffleVerifier, Player memory _initialPlayer)
        external
        returns (address)
    {
        bytes memory bytecode = getGameByteCode(_revealVerifier, _shuffleVerifier, _initialPlayer);
        address addr = Create2.deploy(0, salt, bytecode);
        _games[_nextGameId] = addr;
        _nextGameId++;
        return addr;
    }

    function getGameByteCode(address _revealVerifier, address _shuffleVerifier, Player memory _initialPlayer)
        public
        pure
        returns (bytes memory)
    {
        return abi.encodePacked(type(Game).creationCode, abi.encode(_revealVerifier, _shuffleVerifier, _initialPlayer));
    }
}
