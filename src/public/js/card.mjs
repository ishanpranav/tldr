// card.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

/** Represents a playing card. */
export class Card {
    /**
     * Initializes a new instance of the `Card` class.
     * 
     * @param {String} rank `'1'`, `'2'`, `'3'`, `'4'`, `'5'`, `'6'`, `'7'`,
     *                      `'8'`, `'9'`, `'10'`, `'J'` (jack), `'Q'` (queen),
     *                      `'K'` (king), or `'A'` (ace).
     * @param {String} suit `'S'` (spades), `'D'` (diamonds), `'C'` (clubs),
     *                      or `'H'` (hearts).
     */
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}
