// lazy-strategy.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { Strategy } from './strategy.mjs';

/**
 * Provides a lazy implementation of the `Strategy` class which always hits
 * once, then stands.
 */
export class LazyStrategy extends Strategy {
    play(state) {
        state.dealOne(state.computerHand);

        if (state.computerHand.isBust()) {
            state.onGameOver(state.playerHand);
        
            return;
        }

        state.standoff();
    }
}
