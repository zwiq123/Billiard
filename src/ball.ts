import { Vector2 } from "./utils.js";
import { Circle } from "./Shapes.js";

const BALL_COLORS: Record<number, string> = {
    1: "rgb(255, 223, 44)",
    9: "rgb(255, 223, 44)", 
    2: "rgb(24, 51, 249)",
    10: "rgb(24, 51, 249)",
    3: "rgb(252, 25, 25)",
    11: "rgb(252, 25, 25)",
    4: "rgb(95, 37, 255)",
    12: "rgb(95, 37, 255)",
    5: "rgb(255, 149, 37)",
    13: "rgb(255, 149, 37)",
    6: "rgb(18, 188, 43)",
    14: "rgb(18, 188, 43)",
    7: "rgb(148, 24, 24)",
    15: "rgb(148, 24, 24)",
    8: "black",
    0: "white"
};

export enum BallSide {
    FILLED = "filled",
    HALF_FILLED = "half-filled",
    NONE = "none"
}

export class Ball extends Circle{
    public number: number;
    public side: string | null;
    constructor(ctx: CanvasRenderingContext2D, centerPos: Vector2, radius: number, {collisions = true, number = 0, velocity = new Vector2(0, 0)} = {}){
        super(Ball.getColorByNumber(number), collisions, ctx, centerPos, radius, {velocity: velocity});
        this.side = Ball.getSideByNumber(number);
        this.number = number;
    }

    static getColorByNumber(number: number): string{
        return BALL_COLORS[number] ?? "white";
    }

     static getSideByNumber(number: number): BallSide | null{
        if(number === 0 || number === 8) return BallSide.NONE;
        if(number < 8) return BallSide.FILLED;
        if(number < 16) return BallSide.HALF_FILLED;
        return BallSide.NONE;
    }
}

