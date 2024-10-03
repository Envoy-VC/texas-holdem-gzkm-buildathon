// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";

import {Game} from "src/Game.sol";
import {IGame, Player, GameRound} from "src/interfaces/IGame.sol";

import {Point} from "src/secret-engine/Verifiers.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GameTest is Test {
    using Strings for uint8;

    Game public game;

    Vm.Wallet public alice;
    Vm.Wallet public bob;

    function setUp() public virtual {
        alice = vm.createWallet("alice");
        bob = vm.createWallet("bob");

        address revealVerifier = address(0);
        address shuffleVerifier = address(0);

        Player memory alicePlayer = Player({addr: alice.addr, publicKey: Point({x: 0, y: 0})});

        game = new Game(revealVerifier, shuffleVerifier, alicePlayer);
    }

    function currentRound() internal view returns (string memory) {
        GameRound round = game._currentRound();
        if (round == GameRound.Ante) {
            return "Ante";
        } else if (round == GameRound.PreFlop) {
            return "Pre-Flop";
        } else if (round == GameRound.Flop) {
            return "Flop";
        } else if (round == GameRound.Turn) {
            return "Turn";
        } else if (round == GameRound.River) {
            return "River";
        } else {
            return "";
        }
    }

    function currentMove() internal view returns (string memory) {
        Player memory next = game.nextPlayer();
        if (next.addr == bob.addr) {
            return "Bob";
        } else if (next.addr == alice.addr) {
            return "Alice";
        } else {
            return "None";
        }
    }

    function getCards(address user) internal view {
        uint8[5] memory cards = game.getPlayerCards(user);
        string memory log = string(
            abi.encodePacked(
                user == alice.addr ? "Alice" : "Bob",
                " Cards: ",
                cards[0].toString(),
                " ",
                cards[1].toString(),
                " ",
                cards[2].toString(),
                " ",
                cards[3].toString(),
                " ",
                cards[4].toString()
            )
        );
        console.log(log);
    }

    function getCommunityCards() internal view {
        uint8[5] memory cards = game.getCommunityCards();
        string memory log = string(
            abi.encodePacked(
                "Community Cards: ",
                cards[0].toString(),
                " ",
                cards[1].toString(),
                " ",
                cards[2].toString(),
                " ",
                cards[3].toString(),
                " ",
                cards[4].toString()
            )
        );
        console.log(log);
    }

    function printStats() internal view {
        uint256 totalPlayers = game._totalPlayers();
        console.log("========================================================");
        console.log("|                    Statistics                         |");
        console.log("========================================================");
        console.log("Total Players: ", totalPlayers);
        console.log("Current Round: ", currentRound());
        console.log("Current Move: ", currentMove());
        console.log("Pot Amount: ", game.getPotAmount());
        getCards(alice.addr);
        getCards(bob.addr);
        getCommunityCards();

        console.log("");
        console.log("");
        console.log("");
    }

    function test_UserFlow() public {
        printStats();

        // Add Bob as player
        vm.startBroadcast(bob.addr);
        Player memory bobPlayer = Player({addr: bob.addr, publicKey: Point({x: 0, y: 0})});
        game.joinGame(bobPlayer);
        console.log("Bob joined the game");
        vm.stopBroadcast();

        // Alice Places Bet
        vm.startBroadcast(alice.addr);
        game.placeBet(10);
        console.log("Alice placed bet of 10");
        vm.stopBroadcast();

        // Bob Places Bet
        vm.startBroadcast(bob.addr);
        vm.expectRevert(IGame.InvalidBetAmount.selector);
        game.placeBet(9);
        console.log("Bob cannot place bet less than highest bid");
        vm.stopBroadcast();

        // Bob Places Bet
        vm.startBroadcast(bob.addr);
        game.placeBet(10);
        console.log("Bob placed bet of 10");
        vm.stopBroadcast();

        printStats();

        // Bob Places Bet in wrong sequence
        vm.startBroadcast(bob.addr);
        vm.expectRevert(IGame.InvalidBetSequence.selector);
        game.placeBet(15);
        console.log("Bob cannot place bet as not his turn");
        vm.stopBroadcast();

        // Alice Places Bet
        vm.startBroadcast(alice.addr);
        game.placeBet(15);
        console.log("Alice placed bet of 15");
        vm.stopBroadcast();

        // Bob Places Bet
        vm.startBroadcast(bob.addr);
        game.placeBet(25);
        console.log("Bob placed bet of 25");
        vm.stopBroadcast();

        printStats();

        // Alice Places Bet
        vm.startBroadcast(alice.addr);
        game.placeBet(30);
        console.log("Alice placed bet of 30");
        vm.stopBroadcast();

        // Bob Places Bet
        vm.startBroadcast(bob.addr);
        game.placeBet(35);
        console.log("Bob placed bet of 35");
        vm.stopBroadcast();

        printStats();

        // Alice Places Bet
        vm.startBroadcast(alice.addr);
        game.placeBet(40);
        console.log("Alice placed bet of 40");
        vm.stopBroadcast();

        // Bob Places Bet
        vm.startBroadcast(bob.addr);
        game.placeBet(45);
        console.log("Bob placed bet of 45");
        vm.stopBroadcast();

        printStats();

        // Alice Places Bet
        vm.startBroadcast(alice.addr);
        game.placeBet(50);
        console.log("Alice placed bet of 50");
        vm.stopBroadcast();

        // Bob Places Bet
        vm.startBroadcast(bob.addr);
        game.placeBet(55);
        console.log("Bob placed bet of 55");
        vm.stopBroadcast();

        printStats();

        // Alice Places Bet
        vm.startBroadcast(alice.addr);
        vm.expectRevert(IGame.GameEnded.selector);
        game.placeBet(60);
        console.log("Alice cannot place bet as game has ended.");
        vm.stopBroadcast();

        vm.startBroadcast(alice.addr);
        game.chooseCards([6, 7, 9]);
        console.log("Alice chose cards 6 7 9.");
        vm.stopBroadcast();

        vm.startBroadcast(bob.addr);
        game.chooseCards([5, 7, 8]);
        console.log("Bob chose cards 5 7 8.");
        vm.stopBroadcast();

        printStats();
    }
}
