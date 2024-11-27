import {Ball} from "./ball.js";
import { Position } from "./position.js";

class Game{
    constructor(containerName){
        this.WIDTH = 720;
        this.HEIGHT = this.WIDTH/2;
        this.BORDERWIDTH = 20;
        this.HOLERADIUS = 15;
        this.BALLRADIUS = 10;
        this.balls = [];

        this.mainContainer = document.querySelector('#'+containerName);
        this.createCanvases();
        this.styleContainers();
        this.drawTable();
        this.createBalls();
        this.drawBalls();
    }

    styleContainers(){
        this.mainContainer.id = "mainContainer";
    }

    createBalls(){
        this.balls.push(new Ball(this.getBallStartingPositions()))
        for(let num=1;num<16;num++){
            this.balls.push(new Ball(this.getBallStartingPositions(num), num));
        }
    }

    drawBalls(){
        for(const ball of this.balls){
            this.drawBall(ball)
        }
    }

    getBallStartingPositions(number = null){
        switch(number){
            case 1:
                return new Position(this.WIDTH/4*3, this.HEIGHT/2);
            case 2:
                return new Position();
            case 3:
                return new Position(this.WIDTH/4*3+17.4, this.HEIGHT/2-this.BALLRADIUS);
            case 4:
                return new Position();
            case 5:
                return new Position();
            case 6:
                return new Position();
            case 7:
                return new Position();
            case 8:
                return new Position();
            case 9:
                return new Position();
            case 10:
                return new Position(this.WIDTH/4*3+17.4, this.HEIGHT/2+this.BALLRADIUS);
            case 11:
                return new Position();
            case 12:
                return new Position();
            case 13:
                return new Position();
            case 14:
                return new Position();
            case 15:
                return new Position(); 
            default:
                return new Position(this.WIDTH/4, this.HEIGHT/2);
            }
    }

    createCanvases(){
        const tableCanvas = document.createElement('canvas');
        tableCanvas.width = this.WIDTH;
        tableCanvas.height = this.HEIGHT;
        tableCanvas.style.width = "100%";
        tableCanvas.style.height = "100%";
        this.tableCTX = tableCanvas.getContext('2d');
        this.mainContainer.appendChild(tableCanvas);
    }

    drawTable(){
        this.tableCTX.fillStyle = "#169149";
        this.tableCTX.fillRect(0,0,this.WIDTH, this.HEIGHT);

        this.tableCTX.fillStyle = "#8f5d1b";
        this.tableCTX.fillRect(0,0,this.WIDTH,this.BORDERWIDTH);
        this.tableCTX.fillRect(0,0,this.BORDERWIDTH,this.HEIGHT);
        this.tableCTX.fillRect(0,this.HEIGHT-this.BORDERWIDTH, this.WIDTH, this.HEIGHT);
        this.tableCTX.fillRect(this.WIDTH-this.BORDERWIDTH,0,this.WIDTH, this.HEIGHT);

        this.tableCTX.fillStyle = "#117038";
        this.tableCTX.fillRect(this.BORDERWIDTH,this.BORDERWIDTH,this.WIDTH-2*this.BORDERWIDTH,this.HOLERADIUS);
        this.tableCTX.fillRect(this.BORDERWIDTH,this.BORDERWIDTH,this.HOLERADIUS,this.HEIGHT-2*this.BORDERWIDTH);
        this.tableCTX.fillRect(this.BORDERWIDTH,this.HEIGHT-this.BORDERWIDTH-this.HOLERADIUS, this.WIDTH-2*this.BORDERWIDTH, this.HOLERADIUS);
        this.tableCTX.fillRect(this.WIDTH-this.BORDERWIDTH-this.HOLERADIUS,this.BORDERWIDTH,this.HOLERADIUS, this.HEIGHT-2*this.BORDERWIDTH);


        this.drawHole(this.BORDERWIDTH, this.BORDERWIDTH)
        this.drawHole(this.BORDERWIDTH, this.HEIGHT-this.BORDERWIDTH)
        this.drawHole(this.WIDTH/2, this.BORDERWIDTH)
        this.drawHole(this.WIDTH/2, this.HEIGHT-this.BORDERWIDTH)
        this.drawHole(this.WIDTH-this.BORDERWIDTH, this.BORDERWIDTH)
        this.drawHole(this.WIDTH-this.BORDERWIDTH, this.HEIGHT-this.BORDERWIDTH)
    }

    drawHole(centerX, centerY){
        this.tableCTX.fillStyle = "#141414";
        this.tableCTX.beginPath();
        this.tableCTX.arc(centerX, centerY, this.HOLERADIUS, 0, 2*Math.PI);
        this.tableCTX.fill();
        this.tableCTX.closePath();
    }

    drawBall(ball){
        this.tableCTX.fillStyle = ball.color;
        console.log(ball.position)
        this.tableCTX.beginPath();
        this.tableCTX.arc(ball.position.x, ball.position.y, this.BALLRADIUS, 0, 2*Math.PI);
        this.tableCTX.fill();
        this.tableCTX.closePath();
    }
}

window.addEventListener("load", ()=>{
    new Game("billard-table");
})