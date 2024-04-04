// game.js
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { GameState } from './game-state.mjs';
import { Hand } from './hand.mjs';

// import { LazyStrategy } from './lazy-strategy.mjs';
// import { RandomStrategy } from './random-strategy.mjs';

import { SoftSeventeenStrategy } from './soft-seventeen-strategy.mjs';

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

let state;
let hitButton;
let standButton;
let nextButton;
let playerHandCardsPanel;
let playerHandTotalPanel;
let computerHandCardsPanel;
let computerHandTotalPanel;
let hiddenCard;
let victorPanel;
const debug = false;
const strategy = new SoftSeventeenStrategy();

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

    const gamePanel = document.querySelector('.game');

    gamePanel.innerHTML = "";
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
    gamePanel.appendChild(computerHandCardsPanel);
    gamePanel.appendChild(computerHandTotalPanel);
    gamePanel.appendChild(playerHandCardsPanel);
    gamePanel.appendChild(playerHandTotalPanel);
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
    appendCardImage(playerHandCardsPanel, getImageSource(card));

    playerHandTotalPanel.innerText = hand.getTotal().toString();
}

function onComputerHandCardAdded(hand, card) {
    if (hand.cards.length === 1) {
        hiddenCard = appendCardImage(
            computerHandCardsPanel, 
            'images/RED_BACK.svg');
        computerHandTotalPanel.innerText = "?";

        return;
    }

    appendCardImage(computerHandCardsPanel, getImageSource(card));
}

function getImageSource(card) {
    return 'images/' + card.rank + card.suit + '.svg';
}

function appendCardImage(parent, imageSource) {
    const image = document.createElement('img');

    image.src = imageSource;

    image.classList.add('blackjack-card');
    parent.appendChild(image);

    return image;
}

function onHitButtonClick() {
    state.dealOne(state.playerHand);

    if (state.playerHand.isBust()) {
        state.onGameOver(state.computerHand);
    }
}

function onStandButtonClick() {
    hitButton.disabled = true;
    standButton.disabled = true;
    nextButton.disabled = false;

    strategy.play(state);
}

function onNextButtonClick() {
    startGame();
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

    hiddenCard.src = getImageSource(state.computerHand.cards[0]);
    computerHandTotalPanel.innerText = state.computerHand.getTotal();
}
