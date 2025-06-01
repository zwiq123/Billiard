import { Ball } from './ball.js'
import Game from './game.js';
import { Polygon } from './Shapes.js';
import { Vector2 } from './utils.js'

export default class MovementManager{
    private game: Game;
    private whiteBall: Ball;
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
            if(this.isOrientationPortrait()){
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((canvasPos.bottom - e.pageY)*this.game.WIDTH/canvasPos.height);
                const clickY = Math.round((e.pageX - canvasPos.left)*this.game.HEIGHT/canvasPos.width);
                clickPos = new Vector2(clickX, clickY);
            }else{
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((e.pageX - canvasPos.left)*this.game.HEIGHT/canvasPos.height);
                const clickY = Math.round((e.pageY - canvasPos.top)*this.game.WIDTH/canvasPos.width);
                clickPos = new Vector2(clickX, clickY);
            }

            console.log(clickPos, this.whiteBall.center)

            const newVelocity = Vector2.multiplyByNum(Vector2.fromPoints(this.whiteBall.center, clickPos), 0.05);
            this.whiteBall.velocity = newVelocity;
        });

        canvas.addEventListener("wheel", (e) => {
            this.whiteBall.velocity = new Vector2(0, 0);
        })
    }

    isBallTouchingWall(poly: Polygon, ball: Ball): { hit: boolean, wallStart?: Vector2, wallEnd?: Vector2, nearestPoint?: Vector2 }{

        let minDist = Infinity;
        let nearestPoint = undefined;
        let wallStart = undefined;
        let wallEnd = undefined;
        for(let i = 0 ; i < poly.vertices.length ; i++){
            const a = poly.vertices[i];
            const b = poly.vertices[(i + 1) % poly.vertices.length];

            const ab = Vector2.subtract(b, a);
            const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(ball.center, a), ab) / ab.length() ** 2));
            const proj = Vector2.add(a, Vector2.multiplyByNum(ab, t));
            const dist = Vector2.subtract(ball.center, proj).length();

            if(dist < minDist) {
                minDist = dist;
                nearestPoint = proj;
                wallStart = a;
                wallEnd = b;
            }
        }
        if(minDist <= ball.radius){
            return {hit: true, wallStart, wallEnd, nearestPoint};
        }
        return {hit: false};
    }

    reflectBallOffWall(ball: Ball, normal: Vector2): void{
        ball.velocity = Vector2.reflect(ball.velocity, normal);
    }

    areBallsTouching(ballA: Ball, ballB: Ball){
        return Vector2.subtract(ballA.center, ballB.center).length() <= ballA.radius + ballB.radius;
    }

    reflectBalls(ballA: Ball, ballB: Ball){

        const normal = Vector2.subtract(ballA.center, ballB.center).normalized();
        const relativeVelocity = Vector2.subtract(ballA.velocity, ballB.velocity);
        const velocityAlongNormal = Vector2.dot(relativeVelocity, normal);

        if (velocityAlongNormal > 0) return;

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

    resolveBallCollisions(){
        for(let j = 0 ; j < this.game.balls.length ; j++){
            for(let k = j + 1 ; k < this.game.balls.length ; k++){
                const ballA = this.game.balls[j];
                const ballB = this.game.balls[k];

                if(this.areBallsTouching(ballA, ballB)){
                    this.reflectBalls(ballA, ballB);
                }
            }
        }
    }

    moveBallsAccordingly(){
        for(let i=0; i < this.game.balls.length ; i++){
            const ball = this.game.balls[i];
            if(!this.isBallMoving(ball)) continue;

            this.adjustBallVelocity(ball);
            ball.center.x += ball.velocity.x;
            ball.center.y += ball.velocity.y;

            for(const wall of this.game.walls){
                const collision = this.isBallTouchingWall(wall, ball);
                if(collision.hit){
                    const normal = Vector2.getWallNormal(collision.wallStart!, collision.wallEnd!);
                    const pushDir = Vector2.subtract(ball.center, collision.nearestPoint!).normalized();
                    ball.center = Vector2.add(collision.nearestPoint!, Vector2.multiplyByNum(pushDir, ball.radius + 0.01));
                    this.reflectBallOffWall(ball, normal);
                }
            }

            this.resolveBallCollisions();
        }
    }

    adjustBallVelocity(ball: Ball){
        const SD_FACTOR = 0.99; //Slow-Down factor
        const MIN_SPEED = 0.05;

        ball.velocity = Vector2.multiplyByNum(ball.velocity, SD_FACTOR);

        const absNewVelX = Math.abs(ball.velocity.x);
        const absNewVelY = Math.abs(ball.velocity.y);

        if(absNewVelX < MIN_SPEED && absNewVelY < MIN_SPEED){
            ball.velocity = new Vector2(0, 0);
        }
    }

    isOrientationPortrait(){
        const orientation = window.innerWidth > window.innerHeight ? false : true;
        return orientation;
    }

    isBallMoving(ball: Ball){
        return ball.velocity.x != 0 || ball.velocity.y != 0;
    }
}