import { Globals as G } from "./Globals.js";
export default class VisualManager {
    constructor(game) {
        this.game = game;
    }
    drawTable() {
        G.CTX.fillStyle = "#169149";
        G.CTX.fillRect(0, 0, G.TABLE_WIDTH, G.TABLE_HEIGHT);
        this.drawTableBorders();
        this.drawTableSides();
        this.drawHoles();
    }
    drawTableSides() {
        for (const wall of this.game.walls) {
            wall.draw();
        }
    }
    drawHoles() {
        for (const hole of this.game.holes) {
            hole.draw();
        }
    }
    drawBalls() {
        for (const ball of this.game.balls) {
            ball.draw();
        }
    }
    drawTableBorders() {
        for (const tableBorder of this.game.tableBorders) {
            tableBorder.draw();
        }
    }
}
