import Ball from "./ball.js";
import {Vector2} from "./utils.js";
import VisualManager from "./visualManager.js";
import MovementManager from './movementManager.js'
import Polygon from "./shapes/Polygon.js"; 

export default class Game{
    public WIDTH: number = 1440;
    public HEIGHT: number = 720;
    public BORDERWIDTH: number = 40;
    public HOLERADIUS: number = 30;
    public BALLRADIUS: number = 20;
    public balls: Ball[];
    public isBallSelected: boolean;
    public mainContainer: HTMLDivElement;
    public tableData: any;
    public visualManager: VisualManager;
    public movementManager: MovementManager;
    public tableCTX: CanvasRenderingContext2D;

    constructor(containerName: string){
        this.BORDERWIDTH = 40;
        this.HOLERADIUS = 30;
        this.BALLRADIUS = 20;
        this.balls = [];
        this.isBallSelected = false;

        this.mainContainer = document.querySelector('#'+containerName)!;
        this.createCanvases();
    }

    async init(){
        this.tableData = await this.fetchTableSizes();
        this.visualManager = new VisualManager(this);
        this.visualManager.drawTable();
        this.createBalls();
        this.drawBalls();
        this.movementManager = new MovementManager(this);
    }

    fetchTableSizes(){
        return new Promise((resolve) => {
            fetch('./assets/table.json')
            .then(data => {resolve(data.json());})
        })
    }

    getBalls(){
        return this.balls;
    }

    createBalls(){
        this.balls.push(new Ball(new Vector2(this.WIDTH/4, this.HEIGHT/2), 0));
        const ballNumbers = [
            [1],
            [9,2],
            [10,8,3],
            [11,7,14,4],
            [5,13,15,6,12]
        ];

        const ballPositions = [];
        ballPositions.push([new Vector2(this.WIDTH/4*3, this.HEIGHT/2)]);
        for(let i=1;i<ballNumbers.length;i++){
            ballPositions.push([]);
            for(let j=0;j<ballNumbers[i].length;j++){
                if(j != ballNumbers[i-1].length){
                    ballPositions[i].push(new Vector2(
                        ballPositions[i-1][j].x + this.BALLRADIUS*Math.sqrt(3),
                        ballPositions[i-1][j].y + this.BALLRADIUS
                    ));
                }else{
                    ballPositions[i].push(new Vector2(
                        ballPositions[i-1][j-1].x + this.BALLRADIUS*Math.sqrt(3),
                        ballPositions[i-1][j-1].y - this.BALLRADIUS
                    ));
                }
            }
        }

        for(let i=0;i<ballPositions.length;i++){
            for(let j=0;j<ballPositions[i].length;j++){
                this.balls.push(new Ball(ballPositions[i][j], ballNumbers[i][j]));
            }
        }
    }

    drawBalls(){
        for(const ball of this.balls){
            this.visualManager.drawBall(ball)
        }
    }

    createCanvases(){
        const tableCanvas = document.createElement('canvas');
        tableCanvas.width = this.WIDTH;
        tableCanvas.height = this.HEIGHT;
        tableCanvas.style.width = "100%";
        tableCanvas.style.height = "100%";
        this.tableCTX = tableCanvas.getContext('2d')!;
        this.mainContainer!.appendChild(tableCanvas);
    }

    updateGame(){
        this.movementManager.moveBallsAccordingly();
        this.visualManager.drawTable();
        this.drawBalls();
    }
}

window.addEventListener("load", ()=>{
    const game = new Game("mainContainer");
    function gameLoop(){
        window.requestAnimationFrame(gameLoop);
        game.updateGame();
    }

    async function startGame(){
        await game.init();
        gameLoop();
    }

    startGame();
})