export default class Circle {
    constructor(color, collisions, ctx, centerPos, radius) {
        this.center = centerPos;
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
