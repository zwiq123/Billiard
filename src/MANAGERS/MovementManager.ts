import { Globals as G } from '../COMMON/Globals.js';
import { Circle, Vector2 } from '../COMMON/Geometry.js';
import { Ball } from '../COMMON/Ball.js';
import Game from '../Game.js';
import Utils from '../COMMON/Utils.js';


export default class MovementManager{
    private game: Game;
    constructor(game: Game){
        this.game = game;
    }

    moveBallsAccordingly(){
        for(let i=0; i < this.game.balls.length ; i++){
            const ball = this.game.balls[i];
            if(!Utils.isBallMoving(ball)) continue;

            this.adjustBallVelocity(ball);
            this.game.collisionManager.resolveCollisions(ball);
            this.game.collisionManager.resolveBallCollisionsWithOtherBalls();

            for(const hole of this.game.holes){
                if(Utils.isBallOnEdgeOfHole(ball, hole)){
                    this.game.playerManager.transferBall(ball);
                }
            }
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
}