export class Vector2{
    public x: number;
    public y: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}

export class StraightLine{
    public A: number;
    public B: number;
    public C: number;
    constructor(startPoint: Vector2, endPoint: Vector2){
        const SQRT2 = Math.sqrt(2);
        startPoint.x = eval(String(startPoint.x))
        startPoint.y = eval(String(startPoint.y))
        endPoint.x = eval(String(endPoint.x))
        endPoint.y = eval(String(endPoint.y))

        this.A = (startPoint.y - endPoint.y)/(startPoint.x - endPoint.x)
        this.C = startPoint.y - startPoint.x*this.A
        this.B = -1;
    }
}

export function getPointDistanceFromLine(point: Vector2, line: StraightLine){
    return Math.abs(point.x*line.A + point.y*line.B + line.C)/Math.sqrt(line.A**2 + line.B**2);
}

export function degreesToRadians(degrees: number){
    return degrees * Math.PI / 180;
}