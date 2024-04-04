import { Strategy } from './strategy.mjs';

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
