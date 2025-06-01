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

    static reflect(v: Vector2, n: Vector2): Vector2{
        //V′ = V − 2 * (V ⋅ N) * N
        const dot = Vector2.dot(v, n);
        return Vector2.subtract(v, Vector2.multiplyByNum(n, 2 * dot));
    }

    static getWallNormal(a: Vector2, b: Vector2): Vector2 {
        const wall = Vector2.subtract(b, a);
        return new Vector2(-wall.y, wall.x).normalized();
    }

    length(): number{
        return Math.hypot(this.x, this.y);
    }

    normalized(): Vector2 {
        const len = this.length();
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(this.x / len, this.y / len);
    }
}

export function degreesToRadians(degrees: number){
    return degrees * Math.PI / 180;
}