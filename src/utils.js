export class Position{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

export class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

export function degreesToRadians(degrees){
    return degrees * Math.PI / 180;
}