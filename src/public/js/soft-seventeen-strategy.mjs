// soft-seventeen-strategy.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { Strategy } from './strategy.mjs';

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
        const type = hand.qualify();

        if (type.total === 17) {
            return type.isSoft;
        }

        return type.total < 17;
    }
}
