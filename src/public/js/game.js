// game.js
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { GameState } from './game-state.mjs';
import { Hand } from './hand.mjs';
import { LazyStrategy } from './lazy-strategy.mjs';

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

let state;
let hitButton;
let standButton;
let nextButton;
let playerHandCardsPanel;
let playerHandTotalPanel;
let computerHandCardsPanel;
let computerHandTotalPanel;
let victorPanel;
const debug = false;
const strategy = new LazyStrategy();

function onDOMContentLoaded() {
    document
        .querySelector('.playBtn')
        .addEventListener('click', onPlayButtonClick);

    if (!debug) {
        hideElement(getStartPanel());
        startGame();
    }
}

function getStartPanel() {
    return document.querySelector('.start');
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
        hideElement(getStartPanel());
    }

    hitButton = document.createElement('button');
    standButton = document.createElement('button');
    nextButton = document.createElement('button');
    playerHandCardsPanel = document.createElement('div');
    playerHandTotalPanel = document.createElement('div');
    computerHandCardsPanel = document.createElement('div');
    computerHandTotalPanel = document.createElement('div');
    victorPanel = document.createElement('div');
    hitButton.innerText = "Hit";
    standButton.innerText = "Stand";
    nextButton.innerText = "Next";
    playerHandCardsPanel.innerText = "Player hand: ";
    computerHandCardsPanel.innerText = "Computer hand: ";

    hitButton.addEventListener('click', onHitButtonClick);
    standButton.addEventListener('click', onStandButtonClick);
    nextButton.addEventListener('click', onNextButtonClick);

    const gamePanel = document.querySelector('.game');

    gamePanel.appendChild(playerHandCardsPanel);
    gamePanel.appendChild(playerHandTotalPanel);
    gamePanel.appendChild(computerHandCardsPanel);
    gamePanel.appendChild(computerHandTotalPanel);
    gamePanel.appendChild(hitButton);
    gamePanel.appendChild(standButton);
    gamePanel.appendChild(nextButton);
    gamePanel.appendChild(victorPanel);

    state = new GameState(
        parseStartRanks(document.getElementById('startValues').value),
        new Hand(onPlayerHandCardAdded),
        new Hand(onComputerHandCardAdded),
        onGameOver);
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
    onHandCardAdded(hand, card, playerHandCardsPanel, playerHandTotalPanel);
}

function onComputerHandCardAdded(hand, card) {
    onHandCardAdded(hand, card, computerHandCardsPanel, computerHandTotalPanel);
}

function onHandCardAdded(hand, card, cardsPanel, totalPanel) {
    const text = document.createTextNode(card.rank + card.suit + " ");

    cardsPanel.appendChild(text);
    totalPanel.innerText = hand.getTotal().toString();
}

function onHitButtonClick() {
    state.dealOne(state.playerHand);

    if (state.playerHand.isBust()) {
        onGameOver(state.computerHand);
    }
}

function onStandButtonClick() {
    hitButton.disabled = true;
    standButton.disabled = true;
    nextButton.disabled = false;

    strategy.play(state);
}

function onNextButtonClick() {
    window.location.reload();
}

function onGameOver(victor) {
    hitButton.disabled = true;
    standButton.disabled = true;
    nextButton.disabled = false;

    if (victor === state.playerHand) {
        victorPanel.innerText = "You won!";
    } else if (victor === state.computerHand) {
        victorPanel.innerText = "Computer wins!";
    } else {
        victorPanel.innerText = "It's a draw!";
    }
}
