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

export class Segment{
    public start: Vector2;
    public end: Vector2;

    constructor(start: Vector2, end: Vector2){
        this.start = start;
        this.end = end;
    }

    length(): number {
        return Vector2.subtract(this.end, this.start).length();
    }

    static distanceBetweenSegments(seg1: Segment, seg2: Segment) {
        function clamp(t: number) { return Math.max(0, Math.min(1, t)); }
        const d1 = Vector2.subtract(seg1.end, seg1.start);
        const d2 = Vector2.subtract(seg2.end, seg2.start);
        const r = Vector2.subtract(seg1.start, seg2.start);
        const a = Vector2.dot(d1, d1);
        const e = Vector2.dot(d2, d2);
        const f = Vector2.dot(d2, r);

        let s, t;
        const EPS = 1e-8;
        if (a <= EPS && e <= EPS) {
            // Both segments are points
            return r.length();
        }
        if (a <= EPS) {
            // First segment is a point
            s = 0;
            t = clamp(f / e);
        } else {
            const c = Vector2.dot(d1, r);
            if (e <= EPS) {
                // Second segment is a point
                t = 0;
                s = clamp(-c / a);
            } else {
                const b = Vector2.dot(d1, d2);
                const denom = a * e - b * b;
                if (denom !== 0) {
                    s = clamp((b * f - c * e) / denom);
                } else {
                    s = 0;
                }
                const tNom = b * s + f;
                t = clamp(tNom / e);
            }
        }

        const pt1 = Vector2.add(seg1.start, Vector2.multiplyByNum(d1, s));
        const pt2 = Vector2.add(seg2.start, Vector2.multiplyByNum(d2, t));
        return Vector2.subtract(pt1, pt2).length();
    }
}