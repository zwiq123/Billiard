import { Globals as G } from "../COMMON/Globals.js";
import { ElementsHTML as HTML } from "../COMMON/ElementsHTML.js";
import { Polygon, Vector2 } from "../COMMON/Geometry.js";
import Game from '../Game.js'
import { Ball, BallSide } from "../COMMON/Ball.js";


export default class VisualManager{
    private game: Game;
    private areSettingsOpen: boolean = false;
    constructor(game: Game){
        this.game = game;
        this.assignMenuBtnFunctions();
    }

    public drawTable(){
        G.CTX!.clearRect(0, 0, G.CANVAS_WIDTH, G.CANVAS_HEIGHT);
        const tableBase = new Polygon(G.TABLE_MAIN_COLOR, false, G.CTX!,
                                      new Vector2(0, 0), 
                                      new Vector2(G.TABLE_WIDTH, 0), 
                                      new Vector2(G.TABLE_WIDTH, G.TABLE_HEIGHT), 
                                      new Vector2(0, G.TABLE_HEIGHT));
        tableBase.draw();
        this.drawTableBorders();
        this.drawTableSides();
        this.drawHoles();
    }

    private drawTableSides(){
        for(const wall of this.game.walls){
            wall.draw();
        }
    }

    private drawHoles(){
        for(const hole of this.game.holes){
            hole.draw();
        }
    }

    private drawTableBorders(){
        for(const tableBorder of this.game.tableBorders){
            tableBorder.draw();
        }
    }

    public drawBalls(){
        for(const ball of this.game.balls){
            ball.draw();
        }
    }

    public static drawTitleBalls(side: BallSide) {
        let randomNum1, randomNum2;
        if(side === BallSide.FILLED) {
            randomNum1 = Math.floor(Math.random()*7)+1;
            randomNum2 = Math.floor(Math.random()*7)+1;
            while(randomNum2 === randomNum1){
                randomNum2 = Math.floor(Math.random()*7)+1;
            }
        } else if (side === BallSide.HALF_FILLED) {
            randomNum1 = Math.floor(Math.random()*7)+9;
            randomNum2 = Math.floor(Math.random()*7)+9;
            while(randomNum2 === randomNum1){
                randomNum2 = Math.floor(Math.random()*7)+9;
            }
        } else {
            randomNum1 = 0;
            randomNum2 = 8;
        }

        const ball1 = new Ball(HTML.gameOverTitleBallLeft.getContext('2d')!, new Vector2(G.BALL_RADIUS, G.BALL_RADIUS), {number: randomNum1, angle: 0});
        const ball2 = new Ball(HTML.gameOverTitleBallRight.getContext('2d')!, new Vector2(G.BALL_RADIUS, G.BALL_RADIUS), {number: randomNum2, angle: 0});
        ball1.draw();
        ball2.draw();
    }

    private assignMenuBtnFunctions(){
        HTML.menuBtn.onclick = () => this.clickMenuBtn();
        HTML.closeSettingsBtn.onclick = () => this.closeSettings();
        HTML.restartBtnSettings.onclick = () => this.game.restartGame();
        HTML.showProjectionBtnSettings.onclick = () => this.clickProjectionBtn();
        HTML.gameOverRestartBtn.onclick = () => this.game.restartGame();
    }

    private closeSettings(){
        HTML.settings.style.display = "none";
        this.areSettingsOpen = false;
    }

    private clickMenuBtn(){
        if(this.areSettingsOpen) {
            this.closeSettings();
        }else {
            HTML.settings.style.display = "flex";
            this.areSettingsOpen = true;
        }
    }

    private clickProjectionBtn(){
        this.game.cueManager.toggleProjection();
    }
}