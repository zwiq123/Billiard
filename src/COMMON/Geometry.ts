import { Globals as G } from "./Globals.js";

export class Circle{
    public center: Vector2;
    public velocity: Vector2;
    public radius: number;
    public color: string;
    public collisions: boolean;
    public isHollow: boolean;
    public borderWidth: number;
    public ctx: CanvasRenderingContext2D;

    constructor(color: string, collisions = true, ctx: CanvasRenderingContext2D, centerPos: Vector2, radius: number, {velocity = new Vector2(0, 0), isHollow = false, borderWidth = 2} = {}){
        this.center = centerPos;
        this.velocity = velocity;
        this.radius = radius;
        this.collisions = collisions;
        this.color = color;
        this.ctx = ctx;
        this.isHollow = isHollow;
        this.borderWidth = borderWidth;
    }

    public draw(){
        this.ctx.beginPath();
        if(this.ctx === G.CTX!){
            this.ctx.arc(this.center.x + G.OFFSET_X, this.center.y + G.OFFSET_Y, this.radius, 0, 2*Math.PI);
        }else {
            this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
        }
        
        if(this.isHollow){
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.borderWidth;
            this.ctx.stroke();
        }else{
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
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
        
        if(this.ctx === G.CTX!){
            this.ctx.moveTo(this.vertices[0].x + G.OFFSET_X, this.vertices[0].y + G.OFFSET_Y);
        }else{
            this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        }

        for(let i=1; i<this.vertices.length ; i++){
            const vertex = this.vertices[i];
            if(this.ctx === G.CTX!){
                this.ctx.lineTo(vertex.x + G.OFFSET_X, vertex.y + G.OFFSET_Y);
            }else{
                this.ctx.lineTo(vertex.x, vertex.y);
            }
        }
        this.ctx.fill();
    }
}

export class Segment{
    public start: Vector2;
    public end: Vector2;
    private ctx: CanvasRenderingContext2D;

    constructor(start: Vector2, end: Vector2, ctx: CanvasRenderingContext2D){
        this.start = start;
        this.end = end;
        this.ctx = ctx;
    }

    public length(): number {
        return Vector2.subtract(this.end, this.start).length();
    }

    public draw(color: string, width: number, {lineCap = "butt" as CanvasLineCap, lineDash = []}: {lineCap?: CanvasLineCap, lineDash?: number[]} = {}){
        this.ctx.setLineDash(lineDash);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = lineCap;

        this.ctx.beginPath();
        
        if(this.ctx === G.CTX!){
            this.ctx.moveTo(this.start.x + G.OFFSET_X, this.start.y + G.OFFSET_Y);
            this.ctx.lineTo(this.end.x + G.OFFSET_X, this.end.y + G.OFFSET_Y);
        }else{
            this.ctx.moveTo(this.start.x, this.start.y);
            this.ctx.lineTo(this.end.x, this.end.y);
        }
        
        this.ctx.stroke();
        this.ctx.closePath();
        
        this.ctx.setLineDash([]);
        this.ctx.lineCap = "butt";
    }
}

export class Vector2{
    public x: number;
    public y: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    static fromPoints(pointA: Vector2, pointB: Vector2){
        return new Vector2(pointB.x - pointA.x, pointB.y - pointA.y);
    }

    static add(a: Vector2, b: Vector2): Vector2{
        return new Vector2(a.x+b.x, a.y+b.y);
    }

    static subtract(a: Vector2, b: Vector2): Vector2{
        return new Vector2(a.x-b.x, a.y-b.y);
    }

    static multiplyByNum(a: Vector2, scalar: number): Vector2{
        return new Vector2(a.x*scalar, a.y*scalar);
    }

    static dot(a: Vector2, b: Vector2): number{
        return a.x*b.x + a.y*b.y;
    }

    static cross(a: Vector2, b: Vector2): number{
        return a.x*b.y - a.y*b.x;
    }

    static reflect(v: Vector2, n: Vector2): Vector2{
        //V′ = V − 2 * (V ⋅ N) * N
        const dot = Vector2.dot(v, n);
        return Vector2.subtract(v, Vector2.multiplyByNum(n, 2 * dot));
    }

    static getWallNormal(a: Vector2, b: Vector2): Vector2 {
        const wall = Vector2.subtract(b, a);
        return new Vector2(-wall.y, wall.x).normalized();
    }

    public length(): number{
        return Math.hypot(this.x, this.y);
    }

    public normalized(): Vector2 {
        const len = this.length();
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(this.x / len, this.y / len);
    }
}