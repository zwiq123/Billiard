import { Ball, BallSide } from "./Ball.js";


export default class TurnData{
    public transferredBalls: Ball[] = [];
    public side: BallSide;    

    constructor(side: BallSide, transferredBalls: Ball[]){
        this.side = side;
        this.transferredBalls = transferredBalls;
    }

    public capturedAnyBalls(): boolean {
        return this.transferredBalls.length > 0;
    }

    public capturedOpponentsBall(): boolean {
        for(const ball of this.transferredBalls){
            if(ball.side === BallSide.BLACK || ball.side === BallSide.CUE) continue;
            if(this.side === BallSide.NONE) {
                this.side = ball.side;
                continue;
            }
            if(ball.side !== this.side) return true;
        }
        return false;
    }

    public capturedBlackBall(): boolean {
        for(const ball of this.transferredBalls){
            if(ball.side === BallSide.BLACK) return true;
        }
        return false;
    }

    public capturedCueBall(): boolean {
        for(const ball of this.transferredBalls){
            if(ball.side === BallSide.CUE) return true;
        }
        return false;
    }


}