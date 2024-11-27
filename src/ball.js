import { Position } from "./position.js";

export class Ball{
    constructor(position, number = null){
        this.position = new Position(position.x,position.y);
        this.number = number;
        this.color = this.getColorByNumber();
        this.side = this.getSideByNumber();
    }

    getColorByNumber(){
        switch(this.number){
            case 1:
            case 9:
                return "yellow";
            case 2:
            case 10:
                return "blue";
            case 3:
            case 11:
                return "red";
            case 4:
            case 12:
                return "purple";
            case 5:
            case 13:
                return "orange";
            case 6:
            case 14:
                return "green";
            case 7:
            case 15:
                return "darkred";
            case 8:
                return "black";
            default:
                return "white";
        }
    }

    getSideByNumber(){
        if(this.number === null || this.number === 8){
            return null;
        }
        if(this.number < 8){
            return "filled";
        }
        if(this.number < 16){
            return "half-filled";
        }
        return null;
    }
}