export class VisualManager{
    
    constructor(game){
        this.game = game;
        this.ctx = game.tableCTX;
    }

    drawTable(){
        this.ctx.fillStyle = "#169149";
        this.ctx.fillRect(0,0,this.game.WIDTH, this.game.HEIGHT);

        this.ctx.fillStyle = "#8f5d1b";
        this.ctx.fillRect(0,0,this.game.WIDTH,this.game.BORDERWIDTH);
        this.ctx.fillRect(0,0,this.game.BORDERWIDTH,this.game.HEIGHT);
        this.ctx.fillRect(0,this.game.HEIGHT-this.game.BORDERWIDTH, this.game.WIDTH, this.game.HEIGHT);
        this.ctx.fillRect(this.game.WIDTH-this.game.BORDERWIDTH,0,this.game.WIDTH, this.game.HEIGHT);

        this.ctx.fillStyle = "#117038";
        this.ctx.fillRect(this.game.BORDERWIDTH,this.game.BORDERWIDTH,this.game.WIDTH-2*this.game.BORDERWIDTH,this.game.HOLERADIUS);
        this.ctx.fillRect(this.game.BORDERWIDTH,this.game.BORDERWIDTH,this.game.HOLERADIUS,this.game.HEIGHT-2*this.game.BORDERWIDTH);
        this.ctx.fillRect(this.game.BORDERWIDTH,this.game.HEIGHT-this.game.BORDERWIDTH-this.game.HOLERADIUS, this.game.WIDTH-2*this.game.BORDERWIDTH, this.game.HOLERADIUS);
        this.ctx.fillRect(this.game.WIDTH-this.game.BORDERWIDTH-this.game.HOLERADIUS,this.game.BORDERWIDTH,this.game.HOLERADIUS, this.game.HEIGHT-2*this.game.BORDERWIDTH);


        this.drawHole(this.game.BORDERWIDTH, this.game.BORDERWIDTH)
        this.drawHole(this.game.BORDERWIDTH, this.game.HEIGHT-this.game.BORDERWIDTH)
        this.drawHole(this.game.WIDTH/2, this.game.BORDERWIDTH)
        this.drawHole(this.game.WIDTH/2, this.game.HEIGHT-this.game.BORDERWIDTH)
        this.drawHole(this.game.WIDTH-this.game.BORDERWIDTH, this.game.BORDERWIDTH)
        this.drawHole(this.game.WIDTH-this.game.BORDERWIDTH, this.game.HEIGHT-this.game.BORDERWIDTH)
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
        
        this.ctx.fillStyle = "white"

        if(ball.number){
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

function degreesToRadians(degrees){
    return degrees * Math.PI / 180;
}