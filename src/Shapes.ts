import { Vector2 } from './utils.js'

export class Circle{
    public center: Vector2;
    public velocity: Vector2;
    public radius: number;
    public color: string;
    public collisions: boolean;
    private ctx: CanvasRenderingContext2D;

    constructor(color: string, collisions = true, ctx: CanvasRenderingContext2D, centerPos: Vector2, radius: number, {velocity = new Vector2(0, 0)} = {}){
        this.center = centerPos;
        this.velocity = velocity;
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

export class Polygon{
    public color: string;
    public collisions: boolean;
    public vertices: Vector2[];
    private ctx: CanvasRenderingContext2D;

    constructor(color: string, collisions: boolean, ctx: CanvasRenderingContext2D, ...vertices: Vector2[]){
        this.vertices = [];
        this.color = color;
        this.collisions = collisions;
        this.ctx = ctx;
        for(const vertex of vertices){
            this.vertices.push(vertex);
        }
    }

    public draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for(let i=1; i<this.vertices.length ; i++){
            const vertex = this.vertices[i];
            this.ctx.lineTo(vertex.x, vertex.y);
        }
        this.ctx.fill();
    }
}