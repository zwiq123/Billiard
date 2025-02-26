import { degreesToRadians } from "./utils.js";

export class VisualManager{
    
    constructor(game){
        this.game = game;
        this.ctx = game.tableCTX;
        this.tableData = null;
    }

    async init(){
        this.tableData = await this.fetchTableSizes();
        return true;
    }

    fetchTableSizes(){
        return new Promise((resolve) => {
            fetch('./assets/table.json')
            .then(data => {resolve(data.json());})
        })
    }

    drawTable(){
        this.ctx.fillStyle = "#169149";
        this.ctx.fillRect(0,0,this.game.WIDTH, this.game.HEIGHT);

        this.ctx.fillStyle = "#117038";

        const SQRT2 = Math.sqrt(2);

        //(horizontal view)
        // this.ctx.beginPath()
        // //top left
        // this.ctx.moveTo(70,40);//lt
        // this.ctx.lineTo(690, 40);//rt
        // this.ctx.lineTo(690 - SQRT2*15, 70)//rb
        // this.ctx.lineTo(70 + SQRT2*30, 70)//lb
        // this.ctx.lineTo(70, 40);//lt
        // this.ctx.fill()

        // //top right
        // this.ctx.moveTo(750, 40);
        // this.ctx.lineTo(750+SQRT2*15, 70);
        // this.ctx.lineTo(1370 - SQRT2*30, 70)
        // this.ctx.lineTo(1370, 40)
        // this.ctx.lineTo(750, 40);
        // this.ctx.fill()

        // //bottom left
        // this.ctx.moveTo(70, 680);
        // this.ctx.lineTo(70 + SQRT2*30, 650);
        // this.ctx.lineTo(690 - SQRT2*15, 650)
        // this.ctx.lineTo(690, 680)
        // this.ctx.lineTo(70, 680);
        // this.ctx.fill()

        // //bottom right
        // this.ctx.moveTo(750, 680);
        // this.ctx.lineTo(750 + SQRT2*15, 650);
        // this.ctx.lineTo(1370 - SQRT2*30, 650)
        // this.ctx.lineTo(1370, 680)
        // this.ctx.lineTo(750, 680);
        // this.ctx.fill()

        // //left
        // this.ctx.moveTo(40,70);
        // this.ctx.lineTo(70, 70 + SQRT2*30);
        // this.ctx.lineTo(70, 650 - SQRT2*30)
        // this.ctx.lineTo(40, 650)
        // this.ctx.lineTo(40, 70);
        // this.ctx.fill()
        this.drawDarkTableSides();

        this.ctx.fillStyle = "#8f5d1b";
        this.ctx.fillRect(0,0,this.game.WIDTH,this.game.BORDERWIDTH);
        this.ctx.fillRect(0,0,this.game.BORDERWIDTH,this.game.HEIGHT);
        this.ctx.fillRect(0,this.game.HEIGHT-this.game.BORDERWIDTH, this.game.WIDTH, this.game.HEIGHT);
        this.ctx.fillRect(this.game.WIDTH-this.game.BORDERWIDTH,0,this.game.WIDTH, this.game.HEIGHT);

        this.drawHole(this.game.BORDERWIDTH, this.game.BORDERWIDTH)

        this.drawHole(this.game.BORDERWIDTH, this.game.HEIGHT-this.game.BORDERWIDTH)
        this.drawHole(this.game.WIDTH/2, this.game.BORDERWIDTH)
        this.drawHole(this.game.WIDTH/2, this.game.HEIGHT-this.game.BORDERWIDTH)
        this.drawHole(this.game.WIDTH-this.game.BORDERWIDTH, this.game.BORDERWIDTH)
        this.drawHole(this.game.WIDTH-this.game.BORDERWIDTH, this.game.HEIGHT-this.game.BORDERWIDTH)
    }

    drawDarkTableSides(){
        const tableSidesData = this.tableData["table-sides"];
        this.ctx.fillStyle = "#117038";
        this.ctx.beginPath();

        Object.keys(tableSidesData).forEach((key) => {
            const sideData = tableSidesData[key];
            this.setPivot(sideData["top-left"].x, sideData["top-left"].y, true);
            this.setPivot(sideData["top-right"].x, sideData["top-right"].y, false);
            this.setPivot(sideData["bottom-right"].x, sideData["bottom-right"].y, false)
            this.setPivot(sideData["bottom-left"].x, sideData["bottom-left"].y, false)
            this.setPivot(sideData["top-left"].x, sideData["top-left"].y, false);
            this.ctx.fill()
        })
    }

    setPivot(x,y, isStart){
        const SQRT2 = Math.sqrt(2);
        if(isStart){
            this.ctx.moveTo(eval(x), eval(y))
        }else{
            this.ctx.lineTo(eval(x), eval(y))
        }
    }

    drawRotatedRect(x, y, width, height, rotation){
        this.ctx.save();
        this.ctx.fillStyle = "#169149";
        this.ctx.translate(x, y);
        this.ctx.rotate(degreesToRadians(rotation));
        this.ctx.fillRect(0,0,width,height);
        this.ctx.restore();
    }

    drawHole(centerX, centerY){
        this.ctx.fillStyle = "#141414";
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.game.HOLERADIUS, 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawBall(ball){
        this.ctx.fillStyle = ball.color;

        this.ctx.beginPath();
        this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS, 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        
        if(ball.color === "white"){
            if(this.game.isBallSelected){
                this.ctx.strokeStyle = "#1749FF";
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS-2, 0, 2*Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
        
        this.ctx.fillStyle = "white";

        if(ball.number != 0){
            const textString = `${ball.number}`;
            if(ball.side == "filled" || ball.number == 8){
                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS/2, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.save();
                this.ctx.fillStyle = "black";
                this.ctx.font = `bold ${this.game.BALLRADIUS*0.8}px Arial`;
                this.ctx.translate(ball.position.x, ball.position.y);
                this.ctx.rotate(Math.PI/2);
                const textSize = this.ctx.measureText(textString);
                this.ctx.fillText(`${ball.number}`, -(textSize.width/2), 6);
                this.ctx.restore();
            }else if(ball.side == "half-filled"){
                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS/2.5, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS, degreesToRadians(300), degreesToRadians(60));
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.beginPath();
                this.ctx.arc(ball.position.x, ball.position.y, this.game.BALLRADIUS, degreesToRadians(120), degreesToRadians(240));
                this.ctx.fill();
                this.ctx.closePath();

                this.ctx.save();
                this.ctx.fillStyle = "black";
                this.ctx.font = `bold ${this.game.BALLRADIUS*0.6}px Arial`;
                const textSize = this.ctx.measureText(textString);
                this.ctx.translate(ball.position.x, ball.position.y);
                this.ctx.rotate(Math.PI/2);
                this.ctx.fillText(`${ball.number}`, -(textSize.width/2), 4);
                this.ctx.restore();
            } 
        }  
    }
}