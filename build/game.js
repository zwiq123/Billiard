var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Globals as G } from "./Globals.js";
import { Polygon, Circle, Vector2 } from "./Geometry.js";
import { Ball } from "./Ball.js";
import VisualManager from "./VisualManager.js";
import MovementManager from './MovementManager.js';
import CollisionManager from "./CollisionManager.js";
export default class Game {
    constructor(containerName) {
        this.previousFrameTime = 0;
        this.currentFrameTime = 0;
        this.frameTime = 0;
        this.balls = [];
        this.walls = [];
        this.holes = [];
        this.tableBorders = [];
        this.mainContainer = document.querySelector('#' + containerName);
        this.createCanvases();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tableData = yield this.fetchTableSizes();
            this.visualManager = new VisualManager(this);
            this.createBalls();
            this.createTableBorders();
            this.createWalls();
            this.createHoles();
            this.movementManager = new MovementManager(this);
            this.collisionManager = new CollisionManager(this);
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
            const sidePolygon = new Polygon(sideColor, true, G.CTX, ...vertices);
            this.walls.push(sidePolygon);
        });
    }
    createHoles() {
        const tableHoleData = this.tableData["holes"];
        const holeColor = "#141414";
        const SQRT2 = Math.sqrt(2);
        tableHoleData.map((holeCenter) => {
            const center = new Vector2(eval(String(holeCenter.x)), eval(String(holeCenter.y)));
            const holeCircle = new Circle(holeColor, false, G.CTX, center, G.HOLE_RADIUS);
            this.holes.push(holeCircle);
        });
    }
    createBalls() {
        this.balls.push(new Ball(G.CTX, new Vector2(G.TABLE_WIDTH / 4, G.TABLE_HEIGHT / 2), G.BALL_RADIUS));
        const ballNumbers = [
            [1],
            [9, 2],
            [10, 8, 3],
            [11, 7, 14, 4],
            [5, 13, 15, 6, 12]
        ];
        const ballPositions = [];
        ballPositions.push([new Vector2(G.TABLE_WIDTH / 4 * 3, G.TABLE_HEIGHT / 2)]);
        for (let i = 1; i < ballNumbers.length; i++) {
            ballPositions.push([]);
            for (let j = 0; j < ballNumbers[i].length; j++) {
                if (j != ballNumbers[i - 1].length) {
                    ballPositions[i].push(new Vector2(ballPositions[i - 1][j].x + G.BALL_RADIUS * Math.sqrt(3), ballPositions[i - 1][j].y + G.BALL_RADIUS));
                }
                else {
                    ballPositions[i].push(new Vector2(ballPositions[i - 1][j - 1].x + G.BALL_RADIUS * Math.sqrt(3), ballPositions[i - 1][j - 1].y - G.BALL_RADIUS));
                }
            }
        }
        for (let i = 0; i < ballPositions.length; i++) {
            for (let j = 0; j < ballPositions[i].length; j++) {
                this.balls.push(new Ball(G.CTX, ballPositions[i][j], G.BALL_RADIUS, { number: ballNumbers[i][j] }));
            }
        }
    }
    createTableBorders() {
        const tableBorderColor = "#8f5d1b";
        this.tableBorders.push(new Polygon(tableBorderColor, false, G.CTX, new Vector2(0, 0), new Vector2(G.TABLE_WIDTH, 0), new Vector2(G.TABLE_WIDTH, G.TABLE_BORDER_WIDTH), new Vector2(0, G.TABLE_BORDER_WIDTH)));
        this.tableBorders.push(new Polygon(tableBorderColor, false, G.CTX, new Vector2(0, 0), new Vector2(G.TABLE_BORDER_WIDTH, 0), new Vector2(G.TABLE_BORDER_WIDTH, G.TABLE_HEIGHT), new Vector2(0, G.TABLE_HEIGHT)));
        this.tableBorders.push(new Polygon(tableBorderColor, false, G.CTX, new Vector2(0, G.TABLE_HEIGHT - G.TABLE_BORDER_WIDTH), new Vector2(G.TABLE_WIDTH, G.TABLE_HEIGHT - G.TABLE_BORDER_WIDTH), new Vector2(G.TABLE_WIDTH, G.TABLE_HEIGHT), new Vector2(0, G.TABLE_HEIGHT)));
        this.tableBorders.push(new Polygon(tableBorderColor, false, G.CTX, new Vector2(G.TABLE_WIDTH - G.TABLE_BORDER_WIDTH, 0), new Vector2(G.TABLE_WIDTH, 0), new Vector2(G.TABLE_WIDTH, G.TABLE_HEIGHT), new Vector2(G.TABLE_WIDTH - G.TABLE_BORDER_WIDTH, G.TABLE_HEIGHT)));
    }
    createCanvases() {
        const tableCanvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        tableCanvas.width = G.TABLE_WIDTH * dpr;
        tableCanvas.height = G.TABLE_HEIGHT * dpr;
        tableCanvas.style.width = "100%";
        tableCanvas.style.height = "100%";
        G.CTX = tableCanvas.getContext('2d');
        G.CTX.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.mainContainer.appendChild(tableCanvas);
    }
    updateGame() {
        this.movementManager.moveBallsAccordingly();
        this.visualManager.drawTable();
        this.visualManager.drawBalls();
        this.previousFrameTime = this.currentFrameTime || performance.now();
        this.currentFrameTime = performance.now();
        this.frameTime = (this.currentFrameTime - this.previousFrameTime) / 1000;
    }
}
window.addEventListener("load", () => {
    const game = new Game("mainContainer");
    function gameLoop() {
        requestAnimationFrame(gameLoop);
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
