// import * as SE from '@zypher-game/secret-engine';

// const player1 = SE.generate_key();
// const player2 = SE.generate_key();

// console.log(`
// Player 1's Public Key: ${player1.pk}
// Player 2's Public Key: ${player2.pk}`);

// const gameKey = SE.aggregate_keys([player1.pk, player2.pk]);

// console.log('Game Key: ', gameKey);

// const DECK_SIZE = 52;
// SE.init_prover_key(DECK_SIZE);
// console.log('Done Initializing Prover Key');

// SE.refresh_joint_key(gameKey, DECK_SIZE);
// console.log('Done Refreshing Joint Key');

// const maskedDeck = SE.init_masked_cards(gameKey, DECK_SIZE);
// console.log('Done Initializing Masked Deck');

// let firstDeck = [];
// firstDeck = maskedDeck.map((masked) => masked.card);

// const firstShuffled = SE.shuffle_cards(gameKey, firstDeck);
// console.log(
//   'Done Shuffling Cards 1st time: Proof: ',
//   firstShuffled.proof.substring(0, 16),
//   '...'
// );
// const firstVerify = SE.verify_shuffled_cards(
//   firstDeck,
//   firstShuffled.cards,
//   firstShuffled.proof
// );
// console.log('First Shuffle Verification: ', firstVerify);

// const secondShuffled = SE.shuffle_cards(gameKey, firstShuffled.cards);
// console.log(
//   'Done Shuffling Cards 2nd time: Proof: ',
//   secondShuffled.proof.substring(0, 16),
//   '...'
// );
// const secondVerify = SE.verify_shuffled_cards(
//   firstShuffled.cards,
//   secondShuffled.cards,
//   secondShuffled.proof
// );
// console.log('Second Shuffle Verification: ', secondVerify);

// const cardToReveal = secondShuffled.cards[3];
// SE.init_reveal_key();
// console.log('Done Initializing Reveal Key');

// const revealKeyPlayer1 = SE.reveal_card_with_snark(player1.sk, cardToReveal);
// const revealKeyPlayer2 = SE.reveal_card_with_snark(player2.sk, cardToReveal);

// const cardIdP1 = SE.unmask_card(player1.sk, cardToReveal, [
//   revealKeyPlayer2.card,
// ]);

// console.log(cardIdP1);

// const cardIDP2 = SE.unmask_card(player2.sk, cardToReveal, [
//   revealKeyPlayer1.card,
// ]);

// console.log(cardIDP2);
