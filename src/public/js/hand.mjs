export class Hand {
    constructor(onCardAdded) {
        this.cards = [];
        this.onCardAdded = onCardAdded;
    }

    getTotal() {
        let result = 0;
        let containsAce = false;

        for (const card of this.cards) {
            switch (card.rank) {
                case 'A':
                    containsAce = true;
                    result++;
                    break;

                case 'K':
                case 'Q':
                case 'J':
                case '10':
                    result += 10;
                    break;

                default:
                    result += parseInt(card.rank);
                    break;
            }
        }

        if (containsAce && result + 10 <= 21) {
            result += 10;
        }

        return result;
    }

    addCard(card) {
        this.cards.push(card);
        this.onCardAdded(this, card);
    }
    
    isBust() {
        return this.getTotal() > 21;
    }
}
