import { Vector2, degreesToRadians } from "./utils.js";
import Polygon from "./shapes/Polygon.js";
import Circle from "./shapes/Circle.js";
export default class VisualManager {
    constructor(game) {
        this.game = game;
        this.ctx = game.tableCTX;
    }
    drawTable() {
        this.ctx.fillStyle = "#169149";
        this.ctx.fillRect(0, 0, this.game.WIDTH, this.game.HEIGHT);
        this.ctx.fillStyle = "#117038";
        this.drawDarkTableSides();
        this.drawWoodenTableSides();
        this.drawHoles();
    }
    drawDarkTableSides() {
        const tableSidesData = this.game.tableData["table-sides"];
        const sideColor = "#117038";
        const SQRT2 = Math.sqrt(2);
        tableSidesData.map((side) => {
            const vertices = [];
            side.map((vertex) => {
                vertices.push(new Vector2(eval(String(vertex.x)), eval(String(vertex.y))));
            });
            const sidePolygon = new Polygon(sideColor, true, this.ctx, ...vertices);
            sidePolygon.draw();
        });
        // this.ctx.beginPath();
        // Object.keys(tableSidesData).forEach((key) => {
        //     const sideData = tableSidesData[key];
        //     this.setPivot(sideData["top-left"].x, sideData["top-left"].y, true);
        //     this.setPivot(sideData["top-right"].x, sideData["top-right"].y, false);
        //     this.setPivot(sideData["bottom-right"].x, sideData["bottom-right"].y, false)
        //     this.setPivot(sideData["bottom-left"].x, sideData["bottom-left"].y, false)
        //     this.setPivot(sideData["top-left"].x, sideData["top-left"].y, false);
        //     this.ctx.fill()
        // })
    }
    setPivot(x, y, isStart) {
        const SQRT2 = Math.sqrt(2);
        if (isStart) {
            this.ctx.moveTo(eval(String(x)), eval(String(y)));
        }
        else {
            this.ctx.lineTo(eval(String(x)), eval(String(y)));
        }
    }
    drawRotatedRect(x, y, width, height, rotation) {
        this.ctx.save();
        this.ctx.fillStyle = "#169149";
        this.ctx.translate(x, y);
        this.ctx.rotate(degreesToRadians(rotation));
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.restore();
    }
    drawHoles() {
        const holeColor = "black";
        const SQRT2 = Math.sqrt(2);
        const holeData = this.game.tableData["holes"];
        holeData.forEach((hole) => {
            const holeCircle = new Circle(holeColor, false, this.ctx, new Vector2(eval(String(hole.x)), eval(String(hole.y))), this.game.HOLERADIUS);
            holeCircle.draw();
        });
    }
    drawHole(centerX, centerY) {
        const SQRT2 = Math.sqrt(2);
        this.ctx.fillStyle = "#141414";
        this.ctx.beginPath();
        this.ctx.arc(eval(String(centerX)), eval(String(centerY)), this.game.HOLERADIUS, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }
    drawWoodenTableSides() {
        this.ctx.fillStyle = "#8f5d1b";
        this.ctx.fillRect(0, 0, this.game.WIDTH, this.game.BORDERWIDTH);
        this.ctx.fillRect(0, 0, this.game.BORDERWIDTH, this.game.HEIGHT);
        this.ctx.fillRect(0, this.game.HEIGHT - this.game.BORDERWIDTH, this.game.WIDTH, this.game.HEIGHT);
        this.ctx.fillRect(this.game.WIDTH - this.game.BORDERWIDTH, 0, this.game.WIDTH, this.game.HEIGHT);
    }
    drawBall(ball) {
        this.ctx.fillStyle = ball.color;
        this.ctx.beginPath();
        this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        if (ball.color === "white") {
            if (this.game.isBallSelected) {
                this.ctx.strokeStyle = "#1749FF";
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS - 2, 0, 2 * Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
        this.ctx.fillStyle = "white";
        if (ball.number != 0) {
            const textString = `${ball.number}`;
            if (ball.side == "filled" || ball.number == 8) {
                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS / 2, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.save();
                this.ctx.fillStyle = "black";
                this.ctx.font = `bold ${this.game.BALLRADIUS * 0.8}px Arial`;
                this.ctx.translate(ball.position.x, ball.position.y);
                this.ctx.rotate(Math.PI / 2);
                const textSize = this.ctx.measureText(textString);
                this.ctx.fillText(`${ball.number}`, -(textSize.width / 2), 6);
                this.ctx.restore();
            }
            else if (ball.side == "half-filled") {
                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS / 2.5, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS, degreesToRadians(300), degreesToRadians(60));
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS, degreesToRadians(120), degreesToRadians(240));
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.save();
                this.ctx.fillStyle = "black";
                this.ctx.font = `bold ${this.game.BALLRADIUS * 0.6}px Arial`;
                const textSize = this.ctx.measureText(textString);
                this.ctx.translate(ball.position.x, ball.position.y);
                this.ctx.rotate(Math.PI / 2);
                this.ctx.fillText(`${ball.number}`, -(textSize.width / 2), 4);
                this.ctx.restore();
            }
        }
    }
}
