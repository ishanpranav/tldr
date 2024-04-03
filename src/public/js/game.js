// game.js
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { fisherYatesShuffle } from './fisher-yates-shuffle.mjs';

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function onDOMContentLoaded() {
    document
        .querySelector('#playButton') // sic
        .addEventListener('click', onPlayButtonClick);
    document
        .getElementById('hitButton')
        .addEventListener('click', onHitButtonClick);
    document
        .getElementById('standButton')
        .addEventListener('click', onStandButtonClick);
}

function onPlayButtonClick(e) {
    e.preventDefault();
    document
        .getElementById('startPanel')
        .classList.add('blackjack-visibility-hidden');

    const startValues = document.getElementById('startValuesTextBox').value;
    const state = createGame(getStartRanks(startValues));
}

function onHitButtonClick() {

}

function onStandButtonClick() {

}

function getStartRanks(startValues) {
    if (!startValues) {
        return [];
    }

    const segments = startValues.split(",");
    const results = [];

    for (const segment of segments) {
        results.push(segment.trim());
    }

    return results;
}

function getHandTotal(hand) {
    let result = 0;
    let containsAce = false;

    for (const card of hand) {
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

function createGame(startRanks) {
    const state = {
        deck: [],
        computerHand: {
            cards: [],
            panel: document.getElementById('computerHandPanel')
        },
        playerHand: {
            cards: [],
            panel: document.getElementById('playerHandPanel')
        }
    };
    const ranks = [
        'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'
    ];

    for (const suit of ['S', 'D', 'C', 'H']) {
        for (const rank of ranks) {
            state.deck.push({
                rank: rank,
                suit: suit
            });
        }
    }

    fisherYatesShuffle(state.deck);

    // NOTE: O(mn) algorithm is quite efficient since m, n are small

    for (let i = 0; i < startRanks.length; i++) {
        for (let j = i; j < state.deck.length; j++) {
            if (startRanks[i] === state.deck[j].rank) {
                [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];

                break;
            }
        }
    }

    state.deck.reverse();

    for (let i = 0; i < 2; i++) {
        dealCard(state.deck, state.computerHand);
        dealCard(state.deck, state.playerHand);
    }

    document
        .getElementById('gamePanel').classList
        .add('blackjack-visibility-visible');

    return state;
}

function dealCard(deck, hand) {
    const dealt = deck.pop();

    hand.cards.push(dealt);

    const text = document.createTextNode(dealt.rank + dealt.suit + " ");

    hand.panel.appendChild(text);
}
