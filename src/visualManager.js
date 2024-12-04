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
    }
}