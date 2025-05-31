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

    //both vectors must be normalized first!!!
    static reflect(v: Vector2, n: Vector2): Vector2{
        const dot = Vector2.dot(v, n);
        return Vector2.subtract(v, Vector2.multiplyByNum(n, 2 * dot));
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

interface Info{
    distance: number,
    a: Vector2,
    b: Vector2
}

export class ComplexNum{
    static fromPoint(p: Vector2): ComplexNum{
        return new this(p.x, p.y);
    }

    static fromImaginary(im: number): ComplexNum{
        return new this(0, im);
    }

    static fromReal(re: number): ComplexNum{
        return new this(re, 0);
    }

    constructor(public re: number, public im: number){}

    static add(a: ComplexNum, b: ComplexNum){
        return new ComplexNum(a.re+b.re, a.im+b.im);
    }

    static subtract(a: ComplexNum, b: ComplexNum){
        return new ComplexNum(a.re-b.re, a.im-b.im);
    }

    static divide(a: ComplexNum, b: ComplexNum){
        const realPart = ((a.re*b.re) + (a.im*b.im)) / ((b.re)*(b.re) + (b.im)*(b.im));
        const imaginaryPart = ((a.im*b.re) - (a.re*b.im)) / ((b.re)*(b.re) + (b.im)*(b.im));
        return new ComplexNum(realPart, imaginaryPart);
    }

    static mulitply(a: ComplexNum, b: ComplexNum){
        const realPart = (a.re*b.re) - (a.im*b.im);
        const imaginaryPart = (a.re*b.im) + a.im*b.re;
        return new ComplexNum(realPart, imaginaryPart);
    }

    static abs(x: ComplexNum){
        return Math.sqrt(x.re*x.re + x.im*x.im);
    }
}

// export class StraightLine{
//     public A: number;
//     public B: number;
//     public C: number;
//     constructor(startPoint: Vector2, endPoint: Vector2){
//         const SQRT2 = Math.sqrt(2);
//         startPoint.x = eval(String(startPoint.x))
//         startPoint.y = eval(String(startPoint.y))
//         endPoint.x = eval(String(endPoint.x))
//         endPoint.y = eval(String(endPoint.y))

//         this.A = (startPoint.y - endPoint.y)/(startPoint.x - endPoint.x)
//         this.C = startPoint.y - startPoint.x*this.A
//         this.B = -1;
//     }
// }

// export function getPointDistanceFromLine(point: Vector2, line: StraightLine){
//     return Math.abs(point.x*line.A + point.y*line.B + line.C)/Math.sqrt(line.A**2 + line.B**2);
// }

export function degreesToRadians(degrees: number){
    return degrees * Math.PI / 180;
}