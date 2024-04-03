// game.js
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { GameState } from './game-state.mjs';
import { Hand } from './hand.mjs';
import { RandomStrategy } from './random-strategy.js';

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

let state;
const debug = true;
const strategy = new RandomStrategy();

function onDOMContentLoaded() {
    document
        .querySelector('#playButton') // sic
        .addEventListener('click', onPlayButtonClick);
    getHitButton().addEventListener('click', onHitButtonClick);
    getStandButton().addEventListener('click', onStandButtonClick);
    getNextButton().addEventListener('click', onNextButtonClick);

    if (debug) {
        hideElement(getGamePanel());
        showElement(getStartPanel());
    } else {
        startGame();
    }
}

function getHitButton() {
    return document.getElementById('hitButton');
}

function getStandButton() {
    return document.getElementById('standButton');
}

function getNextButton() {
    return document.getElementById('nextButton');
}

function getStartPanel() {
    return document.getElementById('startPanel')
}

function getGamePanel() {
    return document.getElementById('gamePanel');
}

function showElement(element) {
    element.classList.remove('blackjack-visibility-hidden');
}

function hideElement(element) {
    element.classList.add('blackjack-visibility-hidden');
}

function onPlayButtonClick(e) {
    e.preventDefault();
    startGame();
}

function startGame() {
    if (debug) {
        showElement(getGamePanel());
        hideElement(getStartPanel());
    }

    state = new GameState(
        parseStartRanks(document.getElementById('startValuesTextBox').value),
        new Hand(onPlayerHandCardAdded),
        new Hand(onComputerHandCardAdded));
}

function parseStartRanks(startValues) {
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

function onPlayerHandCardAdded(hand, card) {
    onHandCardAdded(
        hand,
        card,
        document.getElementById('playerHandCardsPanel'),
        document.getElementById('playerHandTotalPanel'));
}

function onComputerHandCardAdded(hand, card) {
    onHandCardAdded(
        hand,
        card,
        document.getElementById('computerHandCardsPanel'),
        document.getElementById('computerHandTotalPanel'));
}

function onHandCardAdded(hand, card, cardsPanel, totalPanel) {
    const text = document.createTextNode(card.rank + card.suit + " ");

    cardsPanel.appendChild(text);
    totalPanel.innerText = hand.getTotal().toString();
}

function onHitButtonClick() {
    state.dealOne(state.playerHand);

    if (state.playerHand.isBust()) {
        getHitButton().disabled = true;
        getStandButton().disabled = true;
        getNextButton().disabled = false;
    }
}

function onStandButtonClick() {
    getHitButton().disabled = true;
    getStandButton().disabled = true;
    getNextButton().disabled = false;
}

function onNextButtonClick() {
    window.location.reload();
}
