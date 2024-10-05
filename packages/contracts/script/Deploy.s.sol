// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {GameFactory} from "src/GameFactory.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract DeployScript is Script {
    GameFactory public factory;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Counter with deployer address", deployerAddress);
        factory = new GameFactory();
        string memory addressPath = "../../apps/www/public/config.json";
        vm.writeJson(Strings.toHexString(uint160(address(factory))),addressPath, ".GAME_FACTORY_ADDRESS");

        vm.stopBroadcast();
    }
}
