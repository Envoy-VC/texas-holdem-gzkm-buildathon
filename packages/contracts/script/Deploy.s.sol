// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {GameFactory} from "src/GameFactory.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {AbiExport} from "script/helpers/AbiExport.sol";

contract DeployScript is Script {
    GameFactory public factory;
    // AbiExport public abiExport;

    function setUp() public {
        // abiExport = new AbiExport();
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying GameFactory with deployer address", deployerAddress);
        factory = new GameFactory();
        string memory addressPath = "../../apps/www/public/config.json";
        vm.writeJson(Strings.toHexString(uint160(address(factory))), addressPath, ".GAME_FACTORY_ADDRESS");
        console.log("Deployed GameFactory: ", address(factory));
        // exportAbi();

        vm.stopBroadcast();
    }

    // function exportAbi() internal {
    //     string memory outDir = "../../apps/www/public/abi/";
    //     string memory basePath = "src/";
    //     AbiExport.Contract memory contract1 = AbiExport.Contract({path: "Game.sol", name: "Game"});
    //     AbiExport.Contract memory contract2 = AbiExport.Contract({path: "GameFactory.sol", name: "GameFactory"});

    //     AbiExport.Contract[] memory contracts = new AbiExport.Contract[](2);
    //     contracts[0] = contract1;
    //     contracts[1] = contract2;

    //     abiExport.export(contracts, outDir, basePath);
    // }
}
