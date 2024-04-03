import { Strategy } from './strategy.mjs';

export class RandomStrategy extends Strategy {
    play(state) {
        if (Math.random() < 0.5) {
            hit();
        } else {
            stand();
        }
    }
}
