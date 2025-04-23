export default class Polygon {
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
