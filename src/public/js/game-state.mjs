// card.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { Card } from './card.mjs';
import { fisherYatesShuffle } from './fisher-yates-shuffle.mjs';

/** Provides a controller and associated state for a Blackjack game. */
export class GameState {
    /**
     * Initializes a new instance of the `GameState` class.
     * 
     * @param {Array}    startRanks   an array of starting ranks to rig the
     *                                deck for debugging purposes.
     * @param {Hand}     playerHand   the player's hand.
     * @param {Hand}     computerHand the dealer's hand.
     * @param {Function} onGameOver   a callback function invoked after the game
     *                                terminates.
     */
    constructor(startRanks, playerHand, computerHand, onGameOver) {
        this.deck = [];
        this.playerHand = playerHand;
        this.computerHand = computerHand;
        this.onGameOver = onGameOver;

        const ranks = [
            'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'
        ];

        for (const suit of ['S', 'D', 'C', 'H']) {
            for (const rank of ranks) {
                this.deck.push(new Card(rank, suit));
            }
        }

        fisherYatesShuffle(this.deck);

        // NOTE: O(mn) algorithm is quite efficient since m, n are small

        for (let i = 0; i < startRanks.length; i++) {
            for (let j = i; j < this.deck.length; j++) {
                if (startRanks[i] === this.deck[j].rank) {
                    [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];

                    break;
                }
            }
        }

        this.deck.reverse();

        for (let i = 0; i < 2; i++) {
            this.dealOne(this.computerHand);
            this.dealOne(this.playerHand);
        }
    }

    /**
     * Deals a single card to "hit" a player. The card is removed from the deck
     * and added to the specified hand.
     * 
     * @param {Hand} hand the hand to which the card is dealt.
     * @returns {Card} The card that was dealt.
     */
    dealOne(hand) {
        const result = this.deck.pop();

        hand.addCard(result);

        return result;
    }

    /**
     * Settles the game by comparing the strengths of the dealer's hand with
     * that of the player.
    */
    standoff() {
        const computerTotal = this.computerHand.getTotal();
        const playerTotal = this.playerHand.getTotal();

        if (computerTotal > playerTotal) {
            this.onGameOver(this.computerHand);
        } else if (computerTotal < playerTotal) {
            this.onGameOver(this.playerHand);
        } else {
            this.onGameOver(null);
        }
    }
}
