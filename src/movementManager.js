import {Ball} from './ball.js'
import {Position} from './utils.js'

export class MovementManager{
    constructor(game){
        this.game = game;
        for(const ball of this.game.getBalls()){
            if(ball.color == "white"){
                this.whiteBall = ball;
                break;
            }
        }
        this.addClickability();
    }

    addClickability(){
        const canvas = this.game.mainContainer.querySelector('canvas');
        canvas.addEventListener("click", (e)=>{
            let clickPos;
            if(this.isOrientationPortrait()){
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((e.pageX - canvasPos.left)*this.game.HEIGHT/canvasPos.width);
                const clickY = Math.round((canvasPos.bottom - e.pageY)*this.game.WIDTH/canvasPos.height);
                clickPos = new Position(clickX, clickY);
            }else{
                const canvasPos = canvas.getBoundingClientRect();
                const clickX = Math.round((e.pageY - canvasPos.top)*this.game.WIDTH/canvasPos.width);
                const clickY = Math.round((e.pageX - canvasPos.left)*this.game.HEIGHT/canvasPos.height);
                clickPos = new Position(clickX, clickY);
            }
            
            if(Math.pow(clickPos.x-this.whiteBall.position.x, 2) + Math.pow(clickPos.y-this.whiteBall.position.y, 2) <= Math.pow(this.game.BALLRADIUS,2)){
                this.game.isBallSelected = true;
                this.game.visual.drawBall(this.whiteBall);
            }else{
                this.game.isBallSelected = false;
                this.game.visual.drawBall(this.whiteBall);
            }
        });
    }

   isOrientationPortrait(){
        const orientation = window.innerWidth > window.innerHeight ? false : true;
        return orientation;
    }
}