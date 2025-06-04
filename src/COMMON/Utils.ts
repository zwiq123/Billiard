import { Globals as G } from "./Globals.js";
import { Circle, Vector2 } from "./Geometry.js";

export default class Utils {
    public static degreesToRadians(degrees: number){
        return degrees * Math.PI / 180;
    }

    public static isOrientationPortrait(){
        const orientation = window.innerWidth > window.innerHeight ? false : true;
        return orientation;
    }

    public static areBallsStill(balls: Circle[]) {
        for (const ball of balls) {
            if (ball.velocity.x !== 0 || ball.velocity.y !== 0) {
                return false;
            }
        }
        return true;
    }

    //string must be like rgb(r, g, b)
    public static getOppositeColor(color: string): string {
        return `rgb(${255 - parseInt(color.slice(4, color.indexOf(',')))}, ${255 - parseInt(color.slice(color.indexOf(',') + 1, color.lastIndexOf(',')))}, ${255 - parseInt(color.slice(color.lastIndexOf(',') + 1, color.length - 1))})`;
    }

    public static getCursorPosition(canvas: HTMLCanvasElement, e: MouseEvent): Vector2 {
        const canvasPos = canvas.getBoundingClientRect();
        
        if(Utils.isOrientationPortrait()){
            const clickX = Math.round((canvasPos.bottom - e.pageY) * G.CANVAS_WIDTH / canvasPos.height) - (G.TABLE_WIDTH / 2);
            const clickY = Math.round((e.pageX - canvasPos.left) * G.CANVAS_HEIGHT / canvasPos.width) - (G.TABLE_HEIGHT / 2);
            return new Vector2(clickX, clickY);
        }

        const clickX = Math.round((e.pageX - canvasPos.left) * G.CANVAS_HEIGHT / canvasPos.height) - (G.TABLE_WIDTH / 2);
        const clickY = Math.round((e.pageY - canvasPos.top) * G.CANVAS_WIDTH / canvasPos.width) - (G.TABLE_HEIGHT / 2);
        return new Vector2(clickX, clickY);
    }
}

