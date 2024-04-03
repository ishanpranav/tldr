// game.js
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function onDOMContentLoaded() {
    document
        .querySelector('#playButton') // sic
        .addEventListener('click', onPlayButtonClick);
}

function onPlayButtonClick(e) {
    document
        .querySelector('#startPanel') // sic
        .classList.add('blackjack-visibility-hidden');
    e.preventDefault();
}
