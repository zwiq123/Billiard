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

export class Movement{
    constructor(velX, velY){
        this.velX = velX;
        this.velY = velY;
    }
}

export function degreesToRadians(degrees){
    return degrees * Math.PI / 180;
}