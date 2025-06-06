import { Globals as G } from "../COMMON/Globals.js";
import { Polygon, Vector2 } from "../COMMON/Geometry.js";
import Game from '../Game.js'


export default class VisualManager{
    private game: Game;
    constructor(game: Game){
        this.game = game;
    }

    drawTable(){
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

    drawTableSides(){
        for(const wall of this.game.walls){
            wall.draw();
        }
    }

    drawHoles(){
        for(const hole of this.game.holes){
            hole.draw();
        }
    }

    drawBalls(){
        for(const ball of this.game.balls){
            ball.draw();
        }
    }

    drawTableBorders(){
        for(const tableBorder of this.game.tableBorders){
            tableBorder.draw();
        }
    }
}