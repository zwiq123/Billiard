import { Ball, BallSide } from "./Ball";


export default class TurnData{
    public transferredBalls: Ball[] = [];
    public side: BallSide;    

    constructor(side: BallSide){
        this.side = side;
    }


}