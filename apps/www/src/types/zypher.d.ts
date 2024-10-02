export * from '@zypher-game/secret-engine';

declare module '@zypher-game/secret-engine' {
  type Hex = `0x${string}`;
  interface Key {
    sk: string;
    pk: string;
    pkxy: [string, string];
  }
  function generate_key(): Key;
  function refresh_joint_key(joint: string, num: number): Hex[];
  function init_masked_cards(
    joint: string,
    num: number
  ): { card: [Hex, Hex, Hex, Hex]; proof: Hex }[];

  function shuffle_cards(
    joint: string,
    deck: [Hex, Hex, Hex, Hex][]
  ): { cards: [Hex, Hex, Hex, Hex][]; proof: Hex };

  function reveal_card_with_snark(
    sk: string,
    card: any
  ): { card: [Hex, Hex]; snark_proof: Hex[] };
}
