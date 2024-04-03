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
    let trickCards;

    if (startValues) {
        trickCards = getTrickCards(startValues);
    } else {
        trickCards = [];
    }

    createGame(trickCards);
}

function onHitButtonClick() {

}

function onStandButtonClick() {

}

function getTrickCards(startValues) {
    const segments = startValues.split(",");
    const results = [];

    for (const segment of segments) {
        results.push({
            rank: segment.trim(),
            suit: 'S'
        });
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

function createGame(trickCards) {
    const deck = [];
    const computerHand = [];
    const playerHand = [];
    const ranks = [
        'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'
    ];

    for (const suit of ['S', 'D', 'C', 'H']) {
        for (const rank of ranks) {
            deck.push({
                rank: rank,
                suit: suit
            });
        }
    }

    fisherYatesShuffle(deck);
    trickCards.reverse();
    deck.push(...trickCards);
    computerHand.push(deck.pop());
    playerHand.push(deck.pop());
    computerHand.push(deck.pop());
    playerHand.push(deck.pop());
    document
        .getElementById('gamePanel').classList
        .add('blackjack-visibility-visible');
}
