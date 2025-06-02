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
export function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
