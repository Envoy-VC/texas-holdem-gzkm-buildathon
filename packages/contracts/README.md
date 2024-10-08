<p align="center"><img src="../../assets/logo-text.png" alt=""  width="400px"/></p>

Contracts for Texas Hold'em

## Deployed Address

- Game Factory Address: [0x66dab6ec6bb97d5adf6fabfe16193f2a28d1ed09](https://opbnb-testnet.bscscan.com/address/0x66dab6ec6bb97d5adf6fabfe16193f2a28d1ed09)
- Texas Poker Library: [0xd24176eCCC9AB8e9f3c40715882Fc8eF784d5C02](https://opbnb-testnet.bscscan.com/address/0xd24176eCCC9AB8e9f3c40715882Fc8eF784d5C02)
- QuickSort Library: [0xc65D06e75b1637D4151D3FCa15AC0079a4101834](https://opbnb-testnet.bscscan.com/address/0xc65D06e75b1637D4151D3FCa15AC0079a4101834)

## Contracts

- `Game Factory`: Factory for creating games. [Link](./src/GameFactory.sol)
- `Game`: Game contract. [Link](./src/Game.sol)
- `TexasPoker`: Library for calculating the most powerful hand. [Link](./src/libraries/TexasPoker.sol)
- `QuickSort`: Library for sorting. [Link](./src/libraries/QuickSort.sol)
- `ZgRevealVerifier` & `ZgShuffleVerifier`: Interface for verifying ZK proofs. [Link](./src/secret-engine/Verifiers.sol)
