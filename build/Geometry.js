export class Circle {
    constructor(color, collisions = true, ctx, centerPos, radius, { velocity = new Vector2(0, 0) } = {}) {
        this.center = centerPos;
        this.velocity = velocity;
        this.radius = radius;
        this.collisions = collisions;
        this.color = color;
        this.ctx = ctx;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }
}
export class Polygon {
    constructor(color, collisions, ctx, ...vertices) {
        this.vertices = [];
        this.color = color;
        this.collisions = collisions;
        this.ctx = ctx;
        for (const vertex of vertices) {
            this.vertices.push(vertex);
        }
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            const vertex = this.vertices[i];
            this.ctx.lineTo(vertex.x, vertex.y);
        }
        this.ctx.fill();
    }
}
export class Segment {
    constructor(start, end, ctx) {
        this.start = start;
        this.end = end;
        this.ctx = ctx;
    }
    length() {
        return Vector2.subtract(this.end, this.start).length();
    }
    draw(color, width, lineDash = []) {
        this.ctx.setLineDash(lineDash);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(this.start.x, this.start.y);
        this.ctx.lineTo(this.end.x, this.end.y);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.setLineDash([]);
    }
}
export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static fromPoints(pointA, pointB) {
        return new Vector2(pointB.x - pointA.x, pointB.y - pointA.y);
    }
    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
    static subtract(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }
    static multiplyByNum(a, scalar) {
        return new Vector2(a.x * scalar, a.y * scalar);
    }
    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    static reflect(v, n) {
        //V′ = V − 2 * (V ⋅ N) * N
        const dot = Vector2.dot(v, n);
        return Vector2.subtract(v, Vector2.multiplyByNum(n, 2 * dot));
    }
    static getWallNormal(a, b) {
        const wall = Vector2.subtract(b, a);
        return new Vector2(-wall.y, wall.x).normalized();
    }
    length() {
        return Math.hypot(this.x, this.y);
    }
    normalized() {
        const len = this.length();
        if (len === 0)
            return new Vector2(0, 0);
        return new Vector2(this.x / len, this.y / len);
    }
}
