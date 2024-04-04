// soft-seventeen-strategy.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { Strategy } from './strategy.mjs';

/**
 * Provides the traditional soft-seventeen implementation of the `Strategy`
 * class, which always hits on hands worth fewer than seventeen points and
 * always stands on hands worth more than seventeen points. If the hand is worth
 * exactly seventeen points, then the dealer hits on hands that contain an
 * eleven-point ace ("soft" hands) and stands on those that do not.
 */
export class SoftSeventeenStrategy extends Strategy {
    play(state) {
        while (this.keepHitting(state.computerHand)) {
            state.dealOne(state.computerHand);

            if (state.computerHand.isBust()) {
                state.onGameOver(state.playerHand);
            
                return;
            }
        }
        
        state.standoff();
    }

    keepHitting(hand) {
        const type = hand.classify();

        if (type.total === 17) {
            return type.isSoft;
        }

        return type.total < 17;
    }
}
