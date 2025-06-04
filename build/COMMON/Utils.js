import { Globals as G } from "./Globals.js";
import { Vector2 } from "./Geometry.js";
export default class Utils {
    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    static isOrientationPortrait() {
        const orientation = window.innerWidth > window.innerHeight ? false : true;
        return orientation;
    }
    static areBallsStill(balls) {
        for (const ball of balls) {
            if (ball.velocity.x !== 0 || ball.velocity.y !== 0) {
                return false;
            }
        }
        return true;
    }
    //string must be like rgb(r, g, b)
    static getOppositeColor(color) {
        return `rgb(${255 - parseInt(color.slice(4, color.indexOf(',')))}, ${255 - parseInt(color.slice(color.indexOf(',') + 1, color.lastIndexOf(',')))}, ${255 - parseInt(color.slice(color.lastIndexOf(',') + 1, color.length - 1))})`;
    }
    static getCursorPosition(canvas, e) {
        const canvasPos = canvas.getBoundingClientRect();
        if (Utils.isOrientationPortrait()) {
            const clickX = Math.round((canvasPos.bottom - e.pageY) * G.CANVAS_WIDTH / canvasPos.height) - (G.TABLE_WIDTH / 2);
            const clickY = Math.round((e.pageX - canvasPos.left) * G.CANVAS_HEIGHT / canvasPos.width) - (G.TABLE_HEIGHT / 2);
            return new Vector2(clickX, clickY);
        }
        const clickX = Math.round((e.pageX - canvasPos.left) * G.CANVAS_HEIGHT / canvasPos.height) - (G.TABLE_WIDTH / 2);
        const clickY = Math.round((e.pageY - canvasPos.top) * G.CANVAS_WIDTH / canvasPos.width) - (G.TABLE_HEIGHT / 2);
        return new Vector2(clickX, clickY);
    }
}
