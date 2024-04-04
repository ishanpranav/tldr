// hand.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

/** Represents a Blackjack hand. */
export class Hand {
    /**
     * Initializes a new instance of the `Hand` class.
     * 
     * @param {Function} onCardAdded a callback function invoked after the hand
     *                               is updated.
     */
    constructor(onCardAdded) {
        this.cards = [];
        this.onCardAdded = onCardAdded;
    }

    /**
     * Determines the properties of hand.
     * 
     * @returns {*} an object containing the properties of the hand. `isSoft`
     *              indicates whether the hand contains an eleven-point ace,
     *              while `total` specifies the point value of the hand.
     */
    classify() {
        let total = 0;
        let isSoft = false;
        let containsAce = false;

        for (const card of this.cards) {
            switch (card.rank) {
                case 'A':
                    containsAce = true;
                    total++;
                    break;

                case 'K':
                case 'Q':
                case 'J':
                case '10':
                    total += 10;
                    break;

                default:
                    total += parseInt(card.rank);
                    break;
            }
        }

        if (containsAce && total + 10 <= 21) {
            total += 10;
            isSoft = true;
        }

        return {
            total: total,
            isSoft: isSoft
        };
    }

    /**
     * Determines the point value of the hand.
     * 
     * @returns {Number} the strength of the hand.
     */
    getTotal() {
        return this.classify().total;
    }

    /**
     * Adds a card to the hand.
     * 
     * @param {Card} card the card to add.
     */
    addCard(card) {
        this.cards.push(card);
        this.onCardAdded(this, card);
    }
    
    /**
     * Determines if the hand is bust.
     * 
     * @returns `true` if the hand's point value exceeds 21; otherwise, `false`.
     */
    isBust() {
        return this.getTotal() > 21;
    }
}
