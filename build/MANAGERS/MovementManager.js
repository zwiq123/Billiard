import { Globals as G } from '../COMMON/Globals.js';
import { Vector2 } from '../COMMON/Geometry.js';
export default class MovementManager {
    constructor(game) {
        this.game = game;
    }
    moveBallsAccordingly() {
        for (let i = 0; i < this.game.balls.length; i++) {
            const ball = this.game.balls[i];
            if (!this.isBallMoving(ball))
                continue;
            this.adjustBallVelocity(ball);
            this.game.collisionManager.resolveBallCollisionsWithWalls(ball);
            this.game.collisionManager.resolveBallCollisionsWithOtherBalls();
        }
    }
    adjustBallVelocity(ball) {
        ball.velocity = Vector2.multiplyByNum(ball.velocity, G.SLOW_DOWN_FACTOR);
        const absNewVelX = Math.abs(ball.velocity.x);
        const absNewVelY = Math.abs(ball.velocity.y);
        if (absNewVelX < G.MIN_BALL_SPEED && absNewVelY < G.MIN_BALL_SPEED) {
            ball.velocity = new Vector2(0, 0);
        }
        const angularVelocity = ball.velocity.length() / ball.radius;
        ball.angle += angularVelocity * this.game.frameTime * G.BALL_ROTATION_FACTOR;
    }
    isBallMoving(ball) {
        return ball.velocity.x != 0 || ball.velocity.y != 0;
    }
}
