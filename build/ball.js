import { Vector2 } from "./utils.js";
export default class Ball {
    constructor(position, number) {
        this.position = new Vector2(position.x, position.y);
        this.number = number;
        this.color = this.getColorByNumber();
        this.side = this.getSideByNumber();
        this.movement = new Vector2(0, 0);
        // this.timeSinceMovementStart = 0;
    }
    getColorByNumber() {
        switch (this.number) {
            case 1:
            case 9:
                return "rgb(255, 223, 44)";
            case 2:
            case 10:
                return "rgb(24, 51, 249)";
            case 3:
            case 11:
                return "rgb(252, 25, 25)";
            case 4:
            case 12:
                return "rgb(95, 37, 255)";
            case 5:
            case 13:
                return "rgb(255, 149, 37)";
            case 6:
            case 14:
                return "rgb(18, 188, 43)";
            case 7:
            case 15:
                return "rgb(148, 24, 24)";
            case 8:
                return "black";
            case 0:
                return "white";
            default:
                return "white";
        }
    }
    getSideByNumber() {
        if (this.number === 0 || this.number === 8) {
            return null;
        }
        if (this.number < 8) {
            return "filled";
        }
        if (this.number < 16) {
            return "half-filled";
        }
        return null;
    }
}
