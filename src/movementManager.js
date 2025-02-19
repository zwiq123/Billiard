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
            
            if(Math.pow(clickPos.x-this.whiteBall.position.x, 2) + Math.pow(clickPos.y-this.whiteBall.position.y, 2) <= Math.pow(this.game.BALLRADIUS,2)){
                this.game.isBallSelected = true;
                this.whiteBall.movement = new Movement(6,3);
                this.game.visual.drawBall(this.whiteBall);
            }else{
                this.game.isBallSelected = false;
                this.whiteBall.movement = new Movement(0,0);
                this.game.visual.drawBall(this.whiteBall);
            }
        });
    }

    moveBallsAccordingly(){
        for(let i=0; i < this.game.balls.length ; i++){
            const ball = this.game.balls[i];
            if(!this.isBallMoving(ball)) continue;

            ball.position.x += ball.movement.velX;
            ball.position.y += ball.movement.velY;
        }
    }

    reflectBallOnCollision(ball){

    }

    isBallCollidingWithWall(ball){
        
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