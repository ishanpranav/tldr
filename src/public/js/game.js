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
        startGame();
    }
}

function onPlayButtonClick(e) {
    e.preventDefault();
    startGame();
}

function startGame() {
    const gamePanel = document.querySelector('.game');
    const header = document.createElement('header');
    const footer = document.createElement('footer');
    const paragraph = document.createElement('p');
    const span = document.createElement('h1');

    gamePanel.innerHTML = '';
    span.textContent = "Blackjack";
    playerHandCardsPanel = document.createElement('div');
    playerHandTotalPanel = document.createElement('div');
    computerHandCardsPanel = document.createElement('div');
    computerHandTotalPanel = document.createElement('div');
    victorPanel = document.createElement('div');

    gamePanel.classList.add('col-lg-8');
    gamePanel.classList.add('mx-auto');
    gamePanel.classList.add('p-4');
    gamePanel.classList.add('py-md-5');
    header.classList.add('d-flex');
    header.classList.add('align-items-center');
    header.classList.add('pb-3');
    header.classList.add('mb-4');
    header.classList.add('border-bottom');
    span.classList.add('fs-2');
    appendText(paragraph, "Copyright © 2024 Ishan Pranav. Licensed under the " +
        "MIT license. The logo for this project was designed by ");
    appendAnchor(
        paragraph,
        'https://www.flaticon.com/free-icons/cards',
        "Freepick on Flaticon");
    appendText(paragraph, ". Layouts and styles are provided by ");
    appendAnchor(paragraph, 'https://getbootstrap.com', "Bootstrap");
    appendText(paragraph, ". Playing card graphics were designed by Chris " +
        "Aguilar as part of the Vectorized Playing Cards project and " +
        "obtained from Richard Schneider's ");
    appendAnchor(
        paragraph,
        'https://github.com/richardschneider/cardsJS',
        "CardsJS");
    appendText(paragraph, ", both licensed under the GNU Lesser General " +
        "Public License v3.0.");
    paragraph.classList.add('text-center');
    paragraph.classList.add('text-body-secondary');
    header.appendChild(span);
    footer.appendChild(paragraph);
    footer.classList.add('border-top')
    footer.classList.add('my-4');
    footer.classList.add('py-3');
    footer.classList.add('small');
    document
        .querySelector('.start').classList
        .add('blackjack-visibility-hidden');
    gamePanel.appendChild(header);
    gamePanel.appendChild(computerHandCardsPanel);
    gamePanel.appendChild(playerHandCardsPanel);
    gamePanel.appendChild(computerHandTotalPanel);
    gamePanel.appendChild(playerHandTotalPanel);

    hitButton = appendButton(gamePanel, "Hit", onHitButtonClick);
    standButton = appendButton(gamePanel, "Stand", onStandButtonClick);
    nextButton = appendButton(gamePanel, "Next", startGame);
    nextButton.disabled = true;

    gamePanel.appendChild(victorPanel);
    gamePanel.appendChild(footer);

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

    playerHandTotalPanel.textContent = "Player: " + hand.getTotal();
}

function onComputerHandCardAdded(hand, card) {
    if (hand.cards.length === 1) {
        hiddenCard = appendCardImage(
            computerHandCardsPanel,
            'images/RED_BACK.svg');
        computerHandTotalPanel.textContent = "Dealer: ?";

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

function appendAnchor(parent, hyperlinkReference, textContent) {
    const anchor = document.createElement('a');

    anchor.href = hyperlinkReference;
    anchor.target = '_blank';
    anchor.textContent = textContent;

    parent.appendChild(anchor);

    return anchor;
}

function appendButton(parent, textContent, clickEventHandler) {
    const button = document.createElement('button');

    button.textContent = textContent;
    button.type = 'button';

    button.classList.add('btn');
    button.classList.add('btn-light');
    button.classList.add('mx-1');
    button.classList.add('my-2');
    button.addEventListener('click', clickEventHandler);
    parent.appendChild(button);

    return button;
}

function appendText(parent, textContent) {
    const text = document.createTextNode(textContent);

    parent.appendChild(text);

    return text;
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

function onGameOver(victor) {
    hitButton.disabled = true;
    standButton.disabled = true;
    nextButton.disabled = false;

    if (victor === state.playerHand) {
        victorPanel.textContent = "You win!";
    } else if (victor === state.computerHand) {
        victorPanel.textContent = "The house wins!";
    } else {
        victorPanel.textContent = "It's a draw!";
    }

    hiddenCard.src = getImageSource(state.computerHand.cards[0]);
    computerHandTotalPanel.textContent = "Dealer: " +
        state.computerHand.getTotal();
}
