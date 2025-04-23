import {Vector2} from './../utils.js'

export default class Circle{
    public center: Vector2;
    public radius: number;
    public color: string;
    public collisions: boolean;
    private ctx: CanvasRenderingContext2D;

    constructor(color: string, collisions: boolean, ctx: CanvasRenderingContext2D, centerPos: Vector2, radius: number){
        this.center = centerPos;
        this.radius = radius;
        this.collisions = collisions;
        this.color = color;
        this.ctx = ctx;
    }

    public draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }
}