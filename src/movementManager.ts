import { Ball } from './ball.js'
import Game from './game.js';
import { Polygon } from './Shapes.js';
import { Vector2, ComplexNum } from './utils.js'

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

    isBallTouchingWall(poly: Polygon, ball: Ball): { hit: boolean, wallStart?: Vector2, wallEnd?: Vector2 } {

        for(let i=0 ; i<poly.vertices.length ; i++){

            const a = ComplexNum.fromPoint(poly.vertices[i]);
            const b = ComplexNum.fromPoint(poly.vertices[(i + 1) % poly.vertices.length]);
            const p = ComplexNum.fromPoint(ball.center);
            const z = ComplexNum.divide(ComplexNum.subtract(p, a), ComplexNum.subtract(b, a));

            if(z.re >= 0 && z.re <= 1){

                const distance = ComplexNum.abs(ComplexNum.mulitply(ComplexNum.fromImaginary(z.im), ComplexNum.subtract(b, a)));
                if (distance <= ball.radius){
                    return {
                        hit: true,
                        wallStart: poly.vertices[i],
                        wallEnd: poly.vertices[(i + 1) % poly.vertices.length]
                    }
                }

            }else{
                const pa = Math.hypot(a.re - p.re, a.im - p.im);
                const pb = Math.hypot(b.re - p.re, b.im - p.im);
                const distance = Math.min(pa, pb);
                if (distance <= ball.radius){
                    return {
                        hit: true,
                        wallStart: pa < pb ? poly.vertices[i] : poly.vertices[(i + 1) % poly.vertices.length],
                        wallEnd: pa < pb ? poly.vertices[i] : poly.vertices[(i + 1) % poly.vertices.length]
                    }
                }
            }
        }
        return { hit: false };
    }

    reflectBallOffWall(ball: Ball, wallStart: Vector2, wallEnd: Vector2): void{
        //V′ = V − 2 * (V ⋅ N) * N

        const wall = Vector2.subtract(wallEnd, wallStart);
        const normal = new Vector2(-wall.y, wall.x).normalized();
        ball.velocity = Vector2.reflect(ball.velocity, normal);
    }

    areBallsTouching(ballA: Ball, ballB: Ball){
        return Vector2.subtract(ballA.center, ballB.center).length() <= ballA.radius*2;
    }

    reflectBalls(ballA: Ball, ballB: Ball){
        const normal = Vector2.subtract(ballA.center, ballB.center).normalized();
        const relativeVelocity = Vector2.subtract(ballA.velocity, ballB.velocity);
        const velocityAlongNormal = Vector2.dot(relativeVelocity, normal);

        if(velocityAlongNormal > 0) return;

        const impulse = -2 * velocityAlongNormal / 2;

        ballA.velocity = Vector2.add(ballA.velocity, Vector2.multiplyByNum(normal, impulse));
        ballB.velocity = Vector2.add(ballB.velocity, Vector2.multiplyByNum(normal, impulse));

        //in some cases the balls overlap and when they reflect they kind of glitch in each other
        // const overlap = ballA.radius + ballB.radius - Vector2.subtract(ballB.center, ballA.center).length();
        // const correction = Vector2.multiplyByNum(normal, overlap / 2);
        // ballA.center = Vector2.subtract(ballA.center, correction);
        // ballB.center = Vector2.add(ballB.center, correction);
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
                    console.log("touch", wall, ball);
                    this.reflectBallOffWall(ball, collision.wallStart!, collision.wallEnd!);
                }
            }

            for(let j = i + 1 ; j < this.game.balls.length ; j++){
                const ballToCollide = this.game.balls[j]
                if(this.areBallsTouching(ball, ballToCollide)){
                    this.reflectBalls(ball, ballToCollide);
                }
            }
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