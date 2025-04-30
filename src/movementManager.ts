import Ball from './ball.js'
import Game from './game.js';
import Polygon from './shapes/Polygon.js';
import {Vector2, StraightLine, getPointDistanceFromLine} from './utils.js'

interface Info{
    distance: number,
    a: Vector2,
    b: Vector2
}

function dot(a: Vector2, b: Vector2){
    return a.x*b.x + a.y*b.y;
}

class ComplexNum{
    static fromPoint(p: Vector2): ComplexNum{
        return new this(p.x, p.y);
    }

    static fromImaginary(im: number): ComplexNum{
        return new this(0, im);
    }

    static fromReal(re: number): ComplexNum{
        return new this(re, 0);
    }

    constructor(public re: number, public im: number){}

    static add(a: ComplexNum, b: ComplexNum){
        return new ComplexNum(a.re+b.re, a.im+b.im);
    }

    static subtract(a: ComplexNum, b: ComplexNum){
        return new ComplexNum(a.re-b.re, a.im-b.im);
    }

    static divide(a: ComplexNum, b: ComplexNum){
        const realPart = ((a.re*b.re) + (a.im*b.im)) / ((b.re)*(b.re) + (b.im)*(b.im));
        const imaginaryPart = ((a.im*b.re) - (a.re*b.im)) / ((b.re)*(b.re) + (b.im)*(b.im));
        return new ComplexNum(realPart, imaginaryPart);
    }

    static mulitply(a: ComplexNum, b: ComplexNum){
        const realPart = (a.re*b.re) - (a.im*b.im);
        const imaginaryPart = (a.re*b.im) + a.im*b.re;
        return new ComplexNum(realPart, imaginaryPart);
    }

    static abs(x: ComplexNum){
        return Math.sqrt(x.re*x.re + x.im*x.im);
    }
}

export default class MovementManager{
    private game: Game;
    private whiteBall: Ball;
    constructor(game: Game){
        this.game = game;
        for(const ball of this.game.getBalls()){
            if(ball.color == "white"){
                this.whiteBall = ball;
                break;
            }
        }
        this.addClickability();
    }
        // "table-sides": {
    //     "top-left":{
    //         "top-left": {"x": "40 + SQRT2*30", "y": 40},
    //         "top-right": {"x": 690, "y": 40},
    //         "bottom-right": {"x": "690 - SQRT2*15", "y": 70},
    //         "bottom-left": {"x": "70 + SQRT2*30", "y": 70}
    //     },
    //     "bottom-left":{
    //         "top-left": {"x": "70 + SQRT2*30", "y": 650},
    //         "top-right": {"x": "690 - SQRT2*15", "y": 650},
    //         "bottom-right": {"x": 690, "y": 680},
    //         "bottom-left": {"x": "40 + SQRT2*30", "y": 680}
    //     },
    //     "top-right":{
    //         "top-left": {"x": 750, "y": 40},
    //         "top-right": {"x": "1400 - SQRT2*30", "y": 40},
    //         "bottom-right": {"x": "1370 - SQRT2*30", "y": 70},
    //         "bottom-left": {"x": "750 + SQRT2*15", "y": 70}
    //     },
    //     "bottom-right":{
    //         "top-left": {"x": 750, "y": 680},
    //         "top-right": {"x": "750 + SQRT2*15", "y": 650},
    //         "bottom-right": {"x": "1370 - SQRT2*30", "y": 650},
    //         "bottom-left": {"x": "1400 - SQRT2*30", "y": 680}
    //     },
    //     "left":{
    //         "top-left": {"x": 40, "y": "40 + SQRT2*30"},
    //         "top-right": {"x": 70, "y": "70 + SQRT2*30"},
    //         "bottom-right": {"x": 70, "y": "650 - SQRT2*30"},
    //         "bottom-left": {"x": 40, "y": "680 - SQRT2*30"}
    //     },
    //     "right":{
    //         "top-left": {"x": 1370, "y": "70 + SQRT2*30"},
    //         "top-right": {"x": 1400, "y": "40 + SQRT2*30"},
    //         "bottom-right": {"x": 1400, "y": "680 - SQRT2*30"},
    //         "bottom-left": {"x": 1370, "y": "650 - SQRT2*30"}
    //     }
    // },

    addClickability(){
        const canvas: HTMLCanvasElement = this.game.mainContainer.querySelector('canvas')!;
        canvas.addEventListener("click", (e)=>{
            let clickPos;
            if(this.isOrientationPortrait()){
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((e.pageX - canvasPos.left)*this.game.HEIGHT/canvasPos.width);
                const clickY = Math.round((canvasPos.bottom - e.pageY)*this.game.WIDTH/canvasPos.height);
                clickPos = new Vector2(clickX, clickY);
            }else{
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((e.pageY - canvasPos.top)*this.game.WIDTH/canvasPos.width);
                const clickY = Math.round((e.pageX - canvasPos.left)*this.game.HEIGHT/canvasPos.height);
                clickPos = new Vector2(clickX, clickY);
            }

            console.log(clickPos)
            
            if(Math.pow(clickPos.y - this.whiteBall.position.x, 2) + Math.pow(clickPos.x-this.whiteBall.position.y, 2) <= Math.pow(this.game.BALLRADIUS,2)){
                this.game.isBallSelected = true;
                this.whiteBall.movement = new Vector2(0,30);
                this.game.visualManager.drawBall(this.whiteBall);
            }else{
                this.game.isBallSelected = false;
                this.whiteBall.movement = new Vector2(0,0);
                this.game.visualManager.drawBall(this.whiteBall);
                // this.whiteBall.timeSinceMovementStart = 0;
            }
        });
    }

    isBallTouchingWall(poly: Polygon, ball: Ball){

        for(let i=0 ; i<poly.vertices.length ; i++){

            const a = ComplexNum.fromPoint(poly.vertices[i]);
            const b = ComplexNum.fromPoint(poly.vertices[(i + 1) % poly.vertices.length]);
            const p = ComplexNum.fromPoint(ball.position);
            const z = ComplexNum.divide(ComplexNum.subtract(p, a), ComplexNum.subtract(b, a));

            if(z.re >= 0 && z.re <= 1){

                const distance = ComplexNum.abs(ComplexNum.mulitply(ComplexNum.fromImaginary(z.im), ComplexNum.subtract(b, a)));
                if (distance <= this.game.BALLRADIUS){
                    return true;
                }

            }else{
                const pa  = Math.sqrt(Math.pow(a.re - p.re, 2) + Math.pow(a.im - p.im, 2));
                const pb  = Math.sqrt(Math.pow(b.re - p.re, 2) + Math.pow(b.im - p.im, 2));
                const distance = Math.min(pa, pb);
                if (distance <= this.game.BALLRADIUS){
                    return true;
                }
            }
        }
        return false;
    }

    moveBallsAccordingly(){
        for(let i=0; i < this.game.balls.length ; i++){
            const ball = this.game.balls[i];
            if(!this.isBallMoving(ball)) continue;

            // console.log(ball.movement)

            this.adjustBallVelocity(ball);
            // this.isBallCollidingWithWall(ball);
            ball.position.x += ball.movement.x;
            ball.position.y += ball.movement.y;

            for(const wall of this.game.walls){
                if(this.isBallTouchingWall(wall, ball)){
                    console.log("touch", wall, ball);
                    ball.movement.y *= -1;
                }
            }
            // ball.timeSinceMovementStart++;
        }
    }

    reflectBallOnCollision(ball: Ball){

    }

    adjustBallVelocity(ball: Ball){
        const SD_FACTOR = 0.99;
        const MIN_SPEED = 0.05;

        // const newVelX = ball.movement.velX * Math.pow(SD_FACTOR, ball.timeSinceMovementStart);
        // const newVelY = ball.movement.velY * Math.pow(SD_FACTOR, ball.timeSinceMovementStart);

        ball.movement.x *= SD_FACTOR;
        ball.movement.y *= SD_FACTOR;

        const absNewVelX = Math.abs(ball.movement.x);
        const absNewVelY = Math.abs(ball.movement.y);
        // console.log(ball.timeSinceMovementStart)

        if(absNewVelX < MIN_SPEED && absNewVelY < MIN_SPEED){
            ball.movement.x = 0;
            ball.movement.y = 0;
            // ball.timeSinceMovementStart = 0;
        }
        //else{
        //     ball.movement.velX = newVelX;
        //     ball.movement.velY = newVelY;
        // }
    }

    // isBallCollidingWithWall(ball: Ball){
    //     const bounds = this.game.tableData["bounds"];
    //     const tableSides = this.game.tableData["table-sides"]
    //     const SD_FACTOR = 0.95;

    //     if(bounds.x[0] >= ball.position.x - this.game.BALLRADIUS + ball.movement.x){
    //         if(this.isBallAlmostInHole(ball, "left")){
    //             console.log("in hole")
    //         }else{
    //             ball.movement.x *= -SD_FACTOR
    //         }
    //     }

    //     if(bounds.x[1] <= ball.position.x + this.game.BALLRADIUS + ball.movement.x){
    //         if(this.isBallAlmostInHole(ball, "right")){
    //             console.log("in hole")
    //         }else{
    //             ball.movement.x *= -SD_FACTOR
    //         }
    //     }

    //     if(bounds.y[0] >= ball.position.y - this.game.BALLRADIUS + ball.movement.y){
    //         if(this.isBallAlmostInHole(ball, "top")){
    //             console.log("in hole")
    //         }else{
    //             ball.movement.y *= -SD_FACTOR
    //         }
    //     }

    //     if(bounds.y[1] <= ball.position.y + this.game.BALLRADIUS + ball.movement.y){
    //         if(this.isBallAlmostInHole(ball, "bottom")){
    //             console.log("in hole")
    //         }else{
    //             ball.movement.y *= -SD_FACTOR
    //         }
    //     }


    // }

    // isBallInBoundHole(ball: Ball, bound: string){
    //     const tableSides = this.game.tableData["table-sides"];
    //     let holesToCheck: string[] = [];
    //     switch(bound){
    //         case "left":{
    //             holesToCheck = ["bottom-left", "left", "top-left"]
    //             break;
    //         }
    //         case "right":{
    //             holesToCheck = ["bottom-right", "right", "top-right"]
    //             break;
    //         }
    //         case "top":{
    //             holesToCheck = ["top-left", "right", "top-right", "left"]
    //             break;
    //         }
    //         case "bottom":{
    //             holesToCheck = ["bottom-right", "right", "bottom-left", "left"]
    //             break;
    //         }
    //     }

    //     for(let i=0; i< holesToCheck.length; i++){
    //         const key = holesToCheck[i];
    //         const sideData = tableSides[key];
            
    //     }
    // }

    // isBallAlmostInHole(ball: Ball, bound: string){
    //     const tableSides = this.game.tableData["table-sides"];

    //     let holesToCheck: string[] = [];
    //     switch(bound){
    //         case "left":{
    //             holesToCheck = ["bottom-left", "left", "top-left"]
    //             break;
    //         }
    //         case "right":{
    //             holesToCheck = ["bottom-right", "right", "top-right"]
    //             break;
    //         }
    //         case "top":{
    //             holesToCheck = ["top-left", "right", "top-right", "left"]
    //             break;
    //         }
    //         case "bottom":{
    //             holesToCheck = ["bottom-right", "right", "bottom-left", "left"]
    //             break;
    //         }
    //     }

    //     for(let i=0; i< holesToCheck.length; i++){
    //         const key = holesToCheck[i];
    //         const sideData = tableSides[key];
    //         if(key === "left" || key === "right"){
    //             if(this.isBallCollidingWithLine(ball, sideData["top-right"], sideData["top-left"]) ||
    //                 this.isBallCollidingWithLine(ball, sideData["bottom-right"], sideData["bottom-left"]))
    //             return true;
    //         }else if(this.isBallCollidingWithLine(ball, sideData["bottom-left"], sideData["top-left"]) ||
    //             this.isBallCollidingWithLine(ball, sideData["bottom-right"], sideData["top-right"])){
    //                 return true;
    //         }
    //     }
    //     return false;
    // }

    // isBallCollidingWithLine(ball: Ball, startPoint: Vector2, endPoint: Vector2){
    //     const line = new StraightLine(startPoint, endPoint);
    //     const distance = getPointDistanceFromLine(ball.position, line);
    //     return distance < this.game.BALLRADIUS;
    // }

    isBallCollidingWithAnotherBall(ball: Ball){

    }

    isBallCollidingWithHoleBounds(ball: Ball){

    }

    isBallInHole(ball: Ball){

    }

    isOrientationPortrait(){
        const orientation = window.innerWidth > window.innerHeight ? false : true;
        return orientation;
    }

    isBallMoving(ball: Ball){
        return ball.movement.x != 0 || ball.movement.y != 0;
    }
}