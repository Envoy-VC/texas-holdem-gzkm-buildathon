// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";

contract AbiExport is Test {
    function setUp() public virtual {}

    struct Contract {
        string path;
        string name;
    }

    function export(Contract[] memory contracts, string memory outDir, string memory basePath) public {
        for (uint256 i = 0; i < contracts.length; i++) {
            Contract memory c = contracts[i];
            string[] memory inputs = new string[](4);
            inputs[0] = "forge";
            inputs[1] = "inspect";
            inputs[2] = string(abi.encodePacked(basePath, c.path, ":", c.name));
            inputs[3] = "abi";

            string memory outPath = string(abi.encodePacked(outDir, c.name, ".json"));

            string memory res = string(vm.ffi(inputs));
            vm.writeFile(outPath, res);
        }
    }
}
