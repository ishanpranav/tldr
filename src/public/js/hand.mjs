export class Hand {
    constructor(onCardAdded) {
        this.cards = [];
        this.onCardAdded = onCardAdded;
    }

    qualify() {
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

    getTotal() {
        return this.qualify().total;
    }

    addCard(card) {
        this.cards.push(card);
        this.onCardAdded(this, card);
    }
    
    isBust() {
        return this.getTotal() > 21;
    }
}
