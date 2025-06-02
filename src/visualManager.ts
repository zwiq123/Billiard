import {Vector2, degreesToRadians} from "./utils.js";
import Game from './game.js'
import { Ball, BallSide } from "./ball.js";
import { Polygon, Circle } from "./Shapes.js";

export default class VisualManager{
    private game: Game;
    private ctx: CanvasRenderingContext2D;
    constructor(game: Game){
        this.game = game;
        this.ctx = game.tableCTX!;
    }

    drawTable(){
        this.ctx.fillStyle = "#169149";
        this.ctx.fillRect(0,0,this.game.WIDTH, this.game.HEIGHT);

        this.ctx.fillStyle = "#117038";

        this.drawDarkTableSides();
        this.drawWoodenTableSides();
        this.drawHoles();
    }

    drawDarkTableSides(){
        for(const wall of this.game.walls){
            wall.draw();
        }
    }

    drawHoles(){
        for(const hole of this.game.holes){
            hole.draw();
        }
    }

    setPivot(x: number, y: number, isStart: boolean){
        const SQRT2 = Math.sqrt(2);
        if(isStart){
            this.ctx.moveTo(eval(String(x)), eval(String(y)))
        }else{
            this.ctx.lineTo(eval(String(x)), eval(String(y)))
        }
    }

    drawRotatedRect(x: number, y: number, width: number, height: number, rotation: number){
        this.ctx.save();
        this.ctx.fillStyle = "#169149";
        this.ctx.translate(x, y);
        this.ctx.rotate(degreesToRadians(rotation));
        this.ctx.fillRect(0,0,width,height);
        this.ctx.restore();
    }

    drawWoodenTableSides(){
        this.ctx.fillStyle = "#8f5d1b";
        this.ctx.fillRect(0,0,this.game.WIDTH,this.game.BORDERWIDTH);
        this.ctx.fillRect(0,0,this.game.BORDERWIDTH,this.game.HEIGHT);
        this.ctx.fillRect(0,this.game.HEIGHT-this.game.BORDERWIDTH, this.game.WIDTH, this.game.HEIGHT);
        this.ctx.fillRect(this.game.WIDTH-this.game.BORDERWIDTH,0,this.game.WIDTH, this.game.HEIGHT);
    }

    drawBall(ball: Ball){
        ball.draw();
        
        this.ctx.fillStyle = "white";

        if(ball.number != 0){
            const textString = `${ball.number}`;
            if(ball.side == BallSide.FILLED || ball.number == 8){
                this.ctx.beginPath();
                this.ctx.arc(ball.center.x, ball.center.y, ball.radius/2, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.save();
                this.ctx.fillStyle = "black";
                this.ctx.font = `bold ${ball.radius*0.8}px Arial`;
                this.ctx.translate(ball.center.x, ball.center.y);
                this.ctx.rotate(Math.PI/2);
                const textSize = this.ctx.measureText(textString);
                this.ctx.fillText(`${ball.number}`, -(textSize.width/2), 6);
                this.ctx.restore();
            }else if(ball.side == BallSide.HALF_FILLED){
                this.ctx.beginPath();
                this.ctx.arc(ball.center.x, ball.center.y, ball.radius/2.5, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.beginPath();
                this.ctx.arc(ball.center.x, ball.center.y, ball.radius, degreesToRadians(300), degreesToRadians(60));
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.beginPath();
                this.ctx.arc(ball.center.x, ball.center.y, ball.radius, degreesToRadians(120), degreesToRadians(240));
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.save();
                this.ctx.fillStyle = "black";
                this.ctx.font = `bold ${ball.radius*0.6}px Arial`;
                const textSize = this.ctx.measureText(textString);
                this.ctx.translate(ball.center.x, ball.center.y);
                this.ctx.rotate(Math.PI/2);
                this.ctx.fillText(`${ball.number}`, -(textSize.width/2), 4);
                this.ctx.restore();
            } 
        }  
    }
}