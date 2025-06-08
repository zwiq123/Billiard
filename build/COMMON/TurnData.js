import { BallSide } from "./Ball.js";
export default class TurnData {
    constructor(side, transferredBalls) {
        this.transferredBalls = [];
        this.side = side;
        this.transferredBalls = transferredBalls;
    }
    capturedAnyBalls() {
        return this.transferredBalls.length > 0;
    }
    capturedOpponentsBall() {
        for (const ball of this.transferredBalls) {
            if (ball.side === BallSide.BLACK || ball.side === BallSide.CUE)
                continue;
            if (this.side === BallSide.NONE) {
                this.side = ball.side;
                continue;
            }
            if (ball.side !== this.side)
                return true;
        }
        return false;
    }
    capturedBlackBall() {
        for (const ball of this.transferredBalls) {
            if (ball.side === BallSide.BLACK)
                return true;
        }
        return false;
    }
    capturedCueBall() {
        for (const ball of this.transferredBalls) {
            if (ball.side === BallSide.CUE)
                return true;
        }
        return false;
    }
}
