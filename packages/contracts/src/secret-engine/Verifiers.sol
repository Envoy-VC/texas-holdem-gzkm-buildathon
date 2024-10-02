// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct MaskedCard {
    uint256 e2X;
    uint256 e2Y;
    uint256 e1X;
    uint256 e1Y;
}

struct Point {
    uint256 x;
    uint256 y;
}

interface ZgShuffleVerifier {
    function verifyShuffle(bytes calldata proof, uint256[] calldata inputs, uint256[] calldata publicKeyCommitment)
        external
        view
        returns (bool);
}

interface ZgRevealVerifier {
    function aggregateKeys(Point[] memory publicKeys) external view returns (Point memory gameKey);

    /**
     * @dev This is for verifying zShuffle::reveal_card generated proof
     */
    function verifyReveal(Point memory pk, MaskedCard memory masked, Point memory reveal, bytes calldata proofBytes)
        external
        view
        returns (bool);

    /**
     * @dev This is for verifying zShuffle::reveal_card_with_snark generated proof
     *
     * @param pi [mask.e1.x, mask.e1.y, reveal.x, reveal.y, pk.x, pk.y]
     * @param proof Generated from WASM zShuffle.reveal_card_with_snark response .snark_proof
     */
    function verifyRevealWithSnark(uint256[6] calldata pi, uint256[8] calldata proof) external view returns (bool);

    function unmaskCard(MaskedCard memory card, Point[] memory revealToken) external view returns (uint8 cardIndex);
}
