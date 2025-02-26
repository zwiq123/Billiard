import {Ball} from "./ball.js";
import { Position, Vector } from "./utils.js";
import { VisualManager } from "./visualManager.js";
import {MovementManager} from './movementManager.js'

class Game{
    constructor(containerName){
        this.WIDTH = 1440;
        this.HEIGHT = this.WIDTH/2;
        this.BORDERWIDTH = 40;
        this.HOLERADIUS = 30;
        this.BALLRADIUS = 20;
        this.balls = [];
        this.isBallSelected = false;

        this.mainContainer = document.querySelector('#'+containerName);
        this.createCanvases();
    }

    async init(){
        const bool = await this.visual.init();
        console.log(bool);
        this.visual.drawTable();
        this.createBalls();
        this.drawBalls();
        this.movement = new MovementManager(this);
    }

    getBalls(){
        return this.balls;
    }

    createBalls(){
        this.balls.push(new Ball(new Position(this.WIDTH/4, this.HEIGHT/2), 0));
        const ballNumbers = [
            [1],
            [9,2],
            [10,8,3],
            [11,7,14,4],
            [5,13,15,6,12]
        ];

        const ballPositions = [];
        ballPositions.push([new Position(this.WIDTH/4*3, this.HEIGHT/2)]);
        for(let i=1;i<ballNumbers.length;i++){
            ballPositions.push([]);
            for(let j=0;j<ballNumbers[i].length;j++){
                if(j != ballNumbers[i-1].length){
                    ballPositions[i].push(new Position(
                        ballPositions[i-1][j].x + this.BALLRADIUS*Math.sqrt(3),
                        ballPositions[i-1][j].y + this.BALLRADIUS
                    ));
                }else{
                    ballPositions[i].push(new Position(
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
            this.visual.drawBall(ball)
        }
    }

    createCanvases(){
        const tableCanvas = document.createElement('canvas');
        tableCanvas.width = this.WIDTH;
        tableCanvas.height = this.HEIGHT;
        tableCanvas.style.width = "100%";
        tableCanvas.style.height = "100%";
        this.tableCTX = tableCanvas.getContext('2d');
        this.mainContainer.appendChild(tableCanvas);
        this.visual = new VisualManager(this);
    }

    updateGame(){
        this.movement.moveBallsAccordingly();
        this.visual.drawTable();
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