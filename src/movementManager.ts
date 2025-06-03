import { Globals as G } from './Globals.js';
import { Circle, Vector2 } from './Geometry.js';
import Game from './Game.js';
import Utils from './Utils.js'
import { Ball } from './Ball.js';


export default class MovementManager{
    private game: Game;
    private whiteBall: Circle;
    constructor(game: Game){
        this.game = game;
        for(const ball of this.game.balls){
            if(ball.color == "white"){
                this.whiteBall = ball;
                break;
            }
        }
        this.addClickability();
    }

    addClickability(){
        const canvas: HTMLCanvasElement = this.game.mainContainer.querySelector('canvas')!;
        canvas.addEventListener("click", (e)=>{
            let clickPos;
            if(Utils.isOrientationPortrait()){
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((canvasPos.bottom - e.pageY) * G.TABLE_WIDTH / canvasPos.height);
                const clickY = Math.round((e.pageX - canvasPos.left) * G.TABLE_HEIGHT / canvasPos.width);
                clickPos = new Vector2(clickX, clickY);
            }else{
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((e.pageX - canvasPos.left) * G.TABLE_HEIGHT / canvasPos.height);
                const clickY = Math.round((e.pageY - canvasPos.top) * G.TABLE_WIDTH / canvasPos.width);
                clickPos = new Vector2(clickX, clickY);
            }


            const newVelocity = Vector2.multiplyByNum(Vector2.fromPoints(this.whiteBall.center, clickPos), 0.075);
            this.whiteBall.velocity = newVelocity;
        });

        canvas.addEventListener("wheel", (e) => {
            this.whiteBall.velocity = new Vector2(0, 0);
        })
    }


    moveBallsAccordingly(){
        for(let i=0; i < this.game.balls.length ; i++){
            const ball = this.game.balls[i];
            if(!this.isBallMoving(ball)) continue;

            this.adjustBallVelocity(ball);
            this.game.collisionManager.resolveBallCollisionsWithWalls(ball);
            this.game.collisionManager.resolveBallCollisionsWithOtherBalls();
        }
    }

    adjustBallVelocity(ball: Ball){
        ball.velocity = Vector2.multiplyByNum(ball.velocity, G.SLOW_DOWN_FACTOR);

        const absNewVelX = Math.abs(ball.velocity.x);
        const absNewVelY = Math.abs(ball.velocity.y);

        if(absNewVelX < G.MIN_BALL_SPEED && absNewVelY < G.MIN_BALL_SPEED){
            ball.velocity = new Vector2(0, 0);
        }

        const angularVelocity = ball.velocity.length() / ball.radius;
        ball.angle += angularVelocity * this.game.frameTime * G.BALL_ROTATION_FACTOR;
    }

    isBallMoving(ball: Circle){
        return ball.velocity.x != 0 || ball.velocity.y != 0;
    }
}