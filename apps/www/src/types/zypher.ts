/* eslint-disable @typescript-eslint/no-explicit-any -- safe */

export type Hex = `0x${string}`;

export interface Key {
  sk: Hex;
  pk: Hex;
  pkxy: [Hex, Hex];
}

declare module '@zypher-game/secret-engine' {
  export function public_uncompress(pk_s: string): any;
  export function public_compress(publics: any): string;

  export function generate_key(): Key;

  export function aggregate_keys(publics: Hex[]): Hex;

  export function init_masked_cards(
    joint: string,
    num: number
  ): { card: [Hex, Hex, Hex, Hex]; proof: Hex }[];

  export function mask_card(joint: string, index: number): any;

  export function verify_masked_card(
    joint: string,
    index: number,
    masked: any,
    proof: string
  ): boolean;

  export function init_prover_key(num: number): void;

  export function init_reveal_key(): void;

  export function refresh_joint_key(joint: string, num: number): Hex[];

  export function shuffle_cards(
    joint: string,
    deck: [Hex, Hex, Hex, Hex][]
  ): { cards: [Hex, Hex, Hex, Hex][]; proof: Hex };

  export function verify_shuffled_cards(
    deck1: any,
    deck2: any,
    proof: string
  ): boolean;

  export function reveal_card(
    sk: string,
    card: any
  ): { card: [Hex, Hex]; proof: Hex };

  export function reveal_card_with_snark(
    sk: string,
    card: any
  ): { card: [Hex, Hex]; snark_proof: Hex[] };

  export function verify_revealed_card(
    pk: string,
    card: any,
    reveal: any
  ): boolean;

  export function unmask_card(sk: string, card: any, reveals: any): number;

  export function decode_point(card: any, reveals: any): number;

  export function card_to_index(value: any): number;

  export function index_to_card(index: number): any;
}
