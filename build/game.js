var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Ball } from "./ball.js";
import { Vector2 } from "./utils.js";
import VisualManager from "./visualManager.js";
import MovementManager from './movementManager.js';
import { Polygon, Circle } from "./Shapes.js";
export default class Game {
    constructor(containerName) {
        this.WIDTH = 1440;
        this.HEIGHT = 720;
        this.BORDERWIDTH = 40;
        this.HOLERADIUS = 30;
        this.BALLRADIUS = 20;
        this.BORDERWIDTH = 40;
        this.HOLERADIUS = 30;
        this.BALLRADIUS = 20;
        this.balls = [];
        this.walls = [];
        this.holes = [];
        this.mainContainer = document.querySelector('#' + containerName);
        this.createCanvases();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tableData = yield this.fetchTableSizes();
            this.visualManager = new VisualManager(this);
            this.visualManager.drawTable();
            this.createBalls();
            this.createWalls();
            this.createHoles();
            this.drawBalls();
            this.movementManager = new MovementManager(this);
        });
    }
    fetchTableSizes() {
        return new Promise((resolve) => {
            fetch('./assets/table.json')
                .then(data => { resolve(data.json()); });
        });
    }
    createWalls() {
        const tableSidesData = this.tableData["table-sides"];
        const sideColor = "#117038";
        const SQRT2 = Math.sqrt(2);
        tableSidesData.map((side) => {
            const vertices = [];
            side.map((vertex) => {
                vertices.push(new Vector2(eval(String(vertex.x)), eval(String(vertex.y))));
            });
            const sidePolygon = new Polygon(sideColor, true, this.tableCTX, ...vertices);
            this.walls.push(sidePolygon);
        });
    }
    createHoles() {
        const tableHoleData = this.tableData["holes"];
        const holeColor = "#141414";
        // const holeColor = "black";
        const SQRT2 = Math.sqrt(2);
        tableHoleData.map((holeCenter) => {
            const center = new Vector2(eval(String(holeCenter.x)), eval(String(holeCenter.y)));
            const holeCircle = new Circle(holeColor, false, this.tableCTX, center, this.HOLERADIUS);
            this.holes.push(holeCircle);
        });
    }
    createBalls() {
        this.balls.push(new Ball(this.tableCTX, new Vector2(this.WIDTH / 4, this.HEIGHT / 2), this.BALLRADIUS));
        const ballNumbers = [
            [1],
            [9, 2],
            [10, 8, 3],
            [11, 7, 14, 4],
            [5, 13, 15, 6, 12]
        ];
        const ballPositions = [];
        ballPositions.push([new Vector2(this.WIDTH / 4 * 3, this.HEIGHT / 2)]);
        for (let i = 1; i < ballNumbers.length; i++) {
            ballPositions.push([]);
            for (let j = 0; j < ballNumbers[i].length; j++) {
                if (j != ballNumbers[i - 1].length) {
                    ballPositions[i].push(new Vector2(ballPositions[i - 1][j].x + this.BALLRADIUS * Math.sqrt(3), ballPositions[i - 1][j].y + this.BALLRADIUS));
                }
                else {
                    ballPositions[i].push(new Vector2(ballPositions[i - 1][j - 1].x + this.BALLRADIUS * Math.sqrt(3), ballPositions[i - 1][j - 1].y - this.BALLRADIUS));
                }
            }
        }
        for (let i = 0; i < ballPositions.length; i++) {
            for (let j = 0; j < ballPositions[i].length; j++) {
                this.balls.push(new Ball(this.tableCTX, ballPositions[i][j], this.BALLRADIUS, { number: ballNumbers[i][j] }));
            }
        }
    }
    drawBalls() {
        for (const ball of this.balls) {
            this.visualManager.drawBall(ball);
        }
    }
    createCanvases() {
        const tableCanvas = document.createElement('canvas');
        tableCanvas.width = this.WIDTH;
        tableCanvas.height = this.HEIGHT;
        tableCanvas.style.width = "100%";
        tableCanvas.style.height = "100%";
        this.tableCTX = tableCanvas.getContext('2d');
        this.mainContainer.appendChild(tableCanvas);
    }
    updateGame() {
        this.movementManager.moveBallsAccordingly();
        this.visualManager.drawTable();
        this.drawBalls();
    }
}
window.addEventListener("load", () => {
    const game = new Game("mainContainer");
    function gameLoop() {
        window.requestAnimationFrame(gameLoop);
        game.updateGame();
    }
    function startGame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield game.init();
            gameLoop();
        });
    }
    startGame();
});
