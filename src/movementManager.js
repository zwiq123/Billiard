import {Ball} from './ball.js'
import {Position, Movement} from './utils.js'

export class MovementManager{
    constructor(game){
        this.game = game;
        for(const ball of this.game.getBalls()){
            if(ball.color == "white"){
                this.whiteBall = ball;
                break;
            }
        }
        this.addClickability();
    }

    addClickability(){
        const canvas = this.game.mainContainer.querySelector('canvas');
        canvas.addEventListener("click", (e)=>{
            let clickPos;
            if(this.isOrientationPortrait()){
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((e.pageX - canvasPos.left)*this.game.HEIGHT/canvasPos.width);
                const clickY = Math.round((canvasPos.bottom - e.pageY)*this.game.WIDTH/canvasPos.height);
                clickPos = new Position(clickX, clickY);
            }else{
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((e.pageY - canvasPos.top)*this.game.WIDTH/canvasPos.width);
                const clickY = Math.round((e.pageX - canvasPos.left)*this.game.HEIGHT/canvasPos.height);
                clickPos = new Position(clickX, clickY);
            }

            
            if(Math.pow(clickPos.y-this.whiteBall.position.x, 2) + Math.pow(clickPos.x-this.whiteBall.position.y, 2) <= Math.pow(this.game.BALLRADIUS,2)){
                this.game.isBallSelected = true;
                this.whiteBall.movement = new Movement(6,3);
                this.game.visual.drawBall(this.whiteBall);
            }else{
                this.game.isBallSelected = false;
                this.whiteBall.movement = new Movement(0,0);
                this.game.visual.drawBall(this.whiteBall);
                this.whiteBall.timeSinceMovementStart = 0;
            }
        });
    }

    moveBallsAccordingly(){
        for(let i=0; i < this.game.balls.length ; i++){
            const ball = this.game.balls[i];
            if(!this.isBallMoving(ball)) continue;

            console.log(ball.movement)

            this.adjustBallVelocity(ball);
            this.isBallCollidingWithWall(ball);
            ball.position.x += ball.movement.velX;
            ball.position.y += ball.movement.velY;
            ball.timeSinceMovementStart++;
        }
    }

    reflectBallOnCollision(ball){

    }

    adjustBallVelocity(ball){
        const SD_FACTOR = 0.9999;
        const MIN_SPEED = 0.05;

        const newVelX = ball.movement.velX * Math.pow(SD_FACTOR, ball.timeSinceMovementStart);
        const newVelY = ball.movement.velY * Math.pow(SD_FACTOR, ball.timeSinceMovementStart);

        const absNewVelX = Math.abs(newVelX);
        const absNewVelY = Math.abs(newVelY);
        console.log(ball.timeSinceMovementStart)

        if(absNewVelX < MIN_SPEED && absNewVelY < MIN_SPEED){
            ball.movement.velX = 0;
            ball.movement.velY = 0;
            ball.timeSinceMovementStart = 0;
        }else{
            ball.movement.velX = newVelX;
            ball.movement.velY = newVelY;
        }
    }

    isBallCollidingWithWall(ball){
        const bounds = this.game.tableData["bounds"];
        const SD_FACTOR = 0.95;

        if(bounds.x[0] >= ball.position.x - this.game.BALLRADIUS + ball.movement.velX ||
            bounds.x[1] <= ball.position.x + this.game.BALLRADIUS + ball.movement.velX){
                ball.movement.velX *= -SD_FACTOR;
            }
        if(bounds.y[0] >= ball.position.y - this.game.BALLRADIUS + ball.movement.velY ||
            bounds.y[1] <= ball.position.y + this.game.BALLRADIUS + ball.movement.velY){
                ball.movement.velY *= -SD_FACTOR;
            }
    }

    isBallCollidingWithAnotherBall(ball){

    }

    isBallInHole(ball){

    }

    isOrientationPortrait(){
        const orientation = window.innerWidth > window.innerHeight ? false : true;
        return orientation;
    }

    isBallMoving(ball){
        return ball.movement.velX != 0 || ball.movement.velY != 0;
    }
}