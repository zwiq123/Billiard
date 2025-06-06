import { Globals as G } from "./Globals.js";
import { Vector2 } from "./Geometry.js";
import { Ball } from "./Ball.js";
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
            if (Utils.isBallMoving(ball)) {
                return false;
            }
        }
        return true;
    }
    static areBallsTouching(ballA, ballB) {
        return Vector2.subtract(ballA.center, ballB.center).length() <= ballA.radius + ballB.radius;
    }
    static isBallMoving(ball) {
        return ball.velocity.x !== 0 || ball.velocity.y !== 0 || ball.radius < G.BALL_RADIUS;
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
    static isBallOnEdgeOfHole(ball, hole) {
        const distance = Vector2.subtract(ball.center, hole.center).length();
        return distance <= hole.radius;
    }
    static getNewWhiteBall() {
        return new Ball(G.CTX, new Vector2(G.TABLE_WIDTH / 4, G.TABLE_HEIGHT / 2));
    }
    static getRandomBallStartingPlacement() {
        // 8 ball has to be in the center
        // there has to be at least one of both ball types in the corners
        const placement = [];
        const numbers = new Set();
        for (let i = 1; i < 16; i++) {
            if (i === 8)
                continue;
            numbers.add(i);
        }
        for (let i = 0; i < 5; i++) {
            placement.push([]);
        }
        let randomNum = Utils.getRandomNumberFromSet(numbers);
        placement[0].push(randomNum);
        numbers.delete(randomNum);
        randomNum = Utils.getRandomNumberFromSet(numbers);
        while (placement[0][0] < 8 ? randomNum < 8 : randomNum > 8) {
            randomNum = Utils.getRandomNumberFromSet(numbers);
        }
        placement[4].push(randomNum);
        numbers.delete(randomNum);
        for (let i = 1; i < 5; i++) {
            for (let j = 0; j < i + 1; j++) {
                if (i == 2 && j == 1) {
                    placement[i].push(8);
                    continue;
                }
                if (i == 4 && j == 0)
                    continue;
                randomNum = Utils.getRandomNumberFromSet(numbers);
                placement[i].push(randomNum);
                numbers.delete(randomNum);
            }
        }
        return placement;
    }
    static getRandomNumberFromSet(set) {
        const items = Array.from(set);
        const num = items[Math.floor(Math.random() * items.length)];
        return num;
    }
}
