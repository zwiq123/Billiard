import { Vector2 } from './utils.js';
import { distanceSegmentToSegment, findCollisionPoint } from './collisionManager.js';
export default class MovementManager {
    constructor(game) {
        this.game = game;
        for (const ball of this.game.balls) {
            if (ball.color == "white") {
                this.whiteBall = ball;
                break;
            }
        }
        this.addClickability();
    }
    addClickability() {
        const canvas = this.game.mainContainer.querySelector('canvas');
        canvas.addEventListener("click", (e) => {
            let clickPos;
            if (this.isOrientationPortrait()) {
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((canvasPos.bottom - e.pageY) * this.game.WIDTH / canvasPos.height);
                const clickY = Math.round((e.pageX - canvasPos.left) * this.game.HEIGHT / canvasPos.width);
                clickPos = new Vector2(clickX, clickY);
            }
            else {
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((e.pageX - canvasPos.left) * this.game.HEIGHT / canvasPos.height);
                const clickY = Math.round((e.pageY - canvasPos.top) * this.game.WIDTH / canvasPos.width);
                clickPos = new Vector2(clickX, clickY);
            }
            const newVelocity = Vector2.multiplyByNum(Vector2.fromPoints(this.whiteBall.center, clickPos), 0.075);
            this.whiteBall.velocity = newVelocity;
        });
        canvas.addEventListener("wheel", (e) => {
            this.whiteBall.velocity = new Vector2(0, 0);
        });
    }
    reflectBallOffWall(ball, normal) {
        ball.velocity = Vector2.reflect(ball.velocity, normal);
    }
    areBallsTouching(ballA, ballB) {
        return Vector2.subtract(ballA.center, ballB.center).length() <= ballA.radius + ballB.radius;
    }
    reflectBalls(ballA, ballB) {
        const normal = Vector2.subtract(ballA.center, ballB.center).normalized();
        const relativeVelocity = Vector2.subtract(ballA.velocity, ballB.velocity);
        const velocityAlongNormal = Vector2.dot(relativeVelocity, normal);
        if (velocityAlongNormal > 0)
            return;
        const restitution = 1;
        const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / 2;
        const impulse = Vector2.multiplyByNum(normal, impulseMagnitude);
        ballA.velocity = Vector2.add(ballA.velocity, impulse);
        ballB.velocity = Vector2.subtract(ballB.velocity, impulse);
        const distance = Vector2.subtract(ballA.center, ballB.center).length();
        const overlap = ballA.radius + ballB.radius - distance;
        if (overlap > 0) {
            const correction = Vector2.multiplyByNum(normal, overlap / 2 + 0.01); // Adding a small value to prevent sticking
            ballA.center = Vector2.add(ballA.center, correction);
            ballB.center = Vector2.subtract(ballB.center, correction);
        }
    }
    resolveBallCollisions() {
        for (let j = 0; j < this.game.balls.length; j++) {
            for (let k = j + 1; k < this.game.balls.length; k++) {
                const ballA = this.game.balls[j];
                const ballB = this.game.balls[k];
                if (this.areBallsTouching(ballA, ballB)) {
                    this.reflectBalls(ballA, ballB);
                }
            }
        }
    }
    resolveBallCollisionsWithWalls(ball) {
        const steps = 4;
        const subVelocity = Vector2.multiplyByNum(ball.velocity, 1 / steps);
        for (let step = 0; step < steps; step++) {
            let hit = false;
            for (const wall of this.game.walls) {
                for (let i = 0; i < wall.vertices.length; i++) {
                    const wallStart = wall.vertices[i];
                    const wallEnd = wall.vertices[(i + 1) % wall.vertices.length];
                    const ballPathStart = ball.center;
                    const ballPathEnd = Vector2.add(ball.center, subVelocity);
                    if (distanceSegmentToSegment(ballPathStart, ballPathEnd, wallStart, wallEnd) <= ball.radius) {
                        const ballCenterAtCollision = findCollisionPoint(ballPathStart, ballPathEnd, wallStart, wallEnd, ball.radius);
                        if (ballCenterAtCollision === null)
                            continue;
                        ball.center = ballCenterAtCollision;
                        const wallNormal = Vector2.getWallNormal(wallStart, wallEnd);
                        this.reflectBallOffWall(ball, wallNormal);
                        hit = true;
                        break;
                    }
                }
                if (hit)
                    break;
            }
            if (!hit) {
                ball.center = Vector2.add(ball.center, subVelocity);
            }
            else {
                break;
            }
        }
    }
    moveBallsAccordingly() {
        for (let i = 0; i < this.game.balls.length; i++) {
            const ball = this.game.balls[i];
            if (!this.isBallMoving(ball))
                continue;
            this.adjustBallVelocity(ball);
            this.resolveBallCollisionsWithWalls(ball);
            this.resolveBallCollisions();
        }
    }
    adjustBallVelocity(ball) {
        const SD_FACTOR = 0.99; //Slow-Down factor
        const MIN_SPEED = 0.05;
        ball.velocity = Vector2.multiplyByNum(ball.velocity, SD_FACTOR);
        const absNewVelX = Math.abs(ball.velocity.x);
        const absNewVelY = Math.abs(ball.velocity.y);
        if (absNewVelX < MIN_SPEED && absNewVelY < MIN_SPEED) {
            ball.velocity = new Vector2(0, 0);
        }
    }
    isOrientationPortrait() {
        const orientation = window.innerWidth > window.innerHeight ? false : true;
        return orientation;
    }
    isBallMoving(ball) {
        return ball.velocity.x != 0 || ball.velocity.y != 0;
    }
}
