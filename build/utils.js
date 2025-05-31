export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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
}
export class StraightLine {
    constructor(startPoint, endPoint) {
        const SQRT2 = Math.sqrt(2);
        startPoint.x = eval(String(startPoint.x));
        startPoint.y = eval(String(startPoint.y));
        endPoint.x = eval(String(endPoint.x));
        endPoint.y = eval(String(endPoint.y));
        this.A = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);
        this.C = startPoint.y - startPoint.x * this.A;
        this.B = -1;
    }
}
export function getPointDistanceFromLine(point, line) {
    return Math.abs(point.x * line.A + point.y * line.B + line.C) / Math.sqrt(line.A ** 2 + line.B ** 2);
}
export function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
