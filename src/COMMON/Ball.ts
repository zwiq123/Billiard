import { Globals as G } from "./Globals.js";
import { Circle, Vector2 } from "./Geometry.js";
import Utils from "./Utils.js";


export class Ball extends Circle{
    public number: number;
    public side: BallSide;
    public angle: number;
    constructor(ctx: CanvasRenderingContext2D, centerPos: Vector2, {collisions = true, number = 0, velocity = new Vector2(0, 0), angle = Utils.degreesToRadians(90)} = {}){
        super(Ball.getColorByNumber(number), collisions, ctx, centerPos, G.BALL_RADIUS, {velocity: velocity});
        this.side = Ball.getSideByNumber(number);
        this.number = number;
        this.angle = angle;
    }

    private static getColorByNumber(number: number): string{
        return BALL_COLORS[number] ?? "white";
    }

    private static getSideByNumber(number: number): BallSide{
        if(number === 0) return BallSide.CUE;
        if(number === 8) return BallSide.BLACK;
        if(number < 8) return BallSide.FILLED;
        if(number < 16) return BallSide.HALF_FILLED;
        return BallSide.NONE;
    }

    public draw(): void {
        super.draw();
    
        if(this.side === BallSide.FILLED || this.side === BallSide.BLACK){

            this.drawCenterCircle(this.radius / 2);
            this.drawCenteredText(this.radius * 0.8);

        }else if(this.side === BallSide.HALF_FILLED){

            this.drawCenterCircle(this.radius / 2.5);
            this.drawHalfFilledBallSide(300, 60);
            this.drawHalfFilledBallSide(120, 240);
            this.drawCenteredText(this.radius * 0.6);
            
        } 
    }

    private drawHalfFilledBallSide(startAngle: number, endAngle: number){
        const angleOffset = Utils.degreesToRadians(90) - this.angle;
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();

        if(this.ctx === G.CTX!) {
            this.ctx.arc(this.center.x + G.OFFSET_X, this.center.y + G.OFFSET_Y, this.radius, Utils.degreesToRadians(startAngle)-angleOffset, Utils.degreesToRadians(endAngle)-angleOffset);
        } else {
            this.ctx.arc(this.center.x, this.center.y, this.radius, Utils.degreesToRadians(startAngle)-angleOffset, Utils.degreesToRadians(endAngle)-angleOffset);
        }

        this.ctx.fill();
        this.ctx.closePath();
    }

    private drawCenterCircle(radius: number) {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();

        if(this.ctx === G.CTX!) {
            this.ctx.arc(this.center.x + G.OFFSET_X, this.center.y + G.OFFSET_Y, radius, 0, 2 * Math.PI);
        } else {
            this.ctx.arc(this.center.x, this.center.y, radius, 0, 2 * Math.PI);
        }
        
        this.ctx.fill();
        this.ctx.closePath();
    }

    private drawCenteredText(size: number) {
        const textString = `${this.number}`;
        const fontSize = size;

        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        if(this.ctx === G.CTX!) {
            this.ctx.translate(this.center.x + G.OFFSET_X, this.center.y + G.OFFSET_Y);
        } else {
            this.ctx.translate(this.center.x, this.center.y);
        }
        
        this.ctx.rotate(this.angle);

        const metrics = this.ctx.measureText(textString);
        let yOffset = 0;
        if (metrics.actualBoundingBoxAscent && metrics.actualBoundingBoxDescent) {
            yOffset = metrics.actualBoundingBoxAscent - (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / 2;
        } else {
            yOffset = this.radius * 0.07;
        }

        this.ctx.fillText(textString, 0, yOffset);
        this.ctx.restore();
    }
}

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
    FILLED = "Filled balls",
    HALF_FILLED = "Half-filled balls",
    BLACK = "black",
    CUE = "cue",
    NONE = "none"
}
