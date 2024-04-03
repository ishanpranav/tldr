// game.js
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { fisherYatesShuffle } from './fisher-yates-shuffle.mjs';

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function onDOMContentLoaded() {
    document
        .querySelector('#playButton') // sic
        .addEventListener('click', onPlayButtonClick);
}

function onPlayButtonClick(e) {
    document
        .getElementById('startPanel')
        .classList.add('blackjack-visibility-hidden');
    e.preventDefault();

    const startValues = document.getElementById('startValuesTextBox').value;
    let trickCards;

    if (startValues) {
        trickCards = getTrickCards(startValues);
    } else {
        trickCards = [];
    }

    createGame(trickCards);
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
    console.log(computerHand);
    console.log(playerHand);
}
