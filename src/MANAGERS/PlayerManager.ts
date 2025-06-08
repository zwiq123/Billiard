import { Globals as G } from "../COMMON/Globals.js";
import { ElementsHTML as HTML } from "../COMMON/ElementsHTML.js";
import { Ball, BallSide } from "../COMMON/Ball.js";
import { Circle, Vector2 } from "../COMMON/Geometry.js";
import Player from "../COMMON/Player.js";
import Utils from "../COMMON/Utils.js";
import Game from "../Game.js";
import TurnData from "../COMMON/TurnData.js";

export default class PlayerManager {
    private game: Game;
    private players: Player[] = [new Player(HTML.leftPlayerCanvas), new Player(HTML.rightPlayerCanvas)];
    public filledPlayer: Player;
    public halfFilledPlayer: Player;    

    public previousTurn: TurnData | null;
    public currentTurn: TurnData = new TurnData(BallSide.NONE);

    private currentPlayerIndex: number = 0;
    private currentPlayersSide: BallSide;

    public hasCursorMoved: boolean = false;
    public isWhiteBallOut: boolean = false;
    private whiteBallProjection: Ball = Utils.getNewWhiteBall();

    constructor(game: Game) {
        this.game = game;
        this.whiteBallProjection.color = "rgb(255, 255, 255, 0.75)";
        this.detectWhiteBallPlacement();
    }

    public drawWhiteBallProjection(){
        this.whiteBallProjection.draw();
    }

    private detectWhiteBallPlacement() {
        HTML.tableCanvas.addEventListener("mousemove", (e) => {
            if(!this.isWhiteBallOut) return;

            this.hasCursorMoved = true;

            const cursorPos = Utils.getCursorPosition(HTML.tableCanvas, e);
            this.whiteBallProjection.center = cursorPos;
            if(this.isWhiteBallPlacementInvalid(cursorPos)){
                this.whiteBallProjection.color = "rgb(255, 0, 0, 0.75)";
            }else{
                this.whiteBallProjection.color = "rgb(255, 255, 255, 0.75)";
            }
        });

        HTML.tableCanvas.addEventListener("click", (e) => {
            if(!this.isWhiteBallOut) return;

            const cursorPos = Utils.getCursorPosition(HTML.tableCanvas, e);
            if(!this.isWhiteBallPlacementInvalid(cursorPos)){
                this.isWhiteBallOut = false;
                const whiteBall = Utils.getNewWhiteBall();
                whiteBall.center = cursorPos;
                this.game.balls.unshift(whiteBall);
                this.game.cueManager.updateWhiteBall();
                HTML.tableCanvas.style.cursor = "default";
                this.hasCursorMoved = false;
            }
        })
    }

    private isWhiteBallPlacementInvalid(cursorPos: Vector2): boolean {
        if(cursorPos.x < G.TABLE_BORDER_WIDTH + 30 + G.BALL_RADIUS || cursorPos.y < G.TABLE_BORDER_WIDTH + 30 + G.BALL_RADIUS) return true;
        if(cursorPos.x > G.TABLE_WIDTH - G.TABLE_BORDER_WIDTH - 30 - G.BALL_RADIUS || cursorPos.y > G.TABLE_HEIGHT - 30 - G.TABLE_BORDER_WIDTH - G.BALL_RADIUS) return true;

        for(const ball of this.game.balls) {
            if(Utils.areBallsTouching(ball, this.whiteBallProjection)) return true;
        }

        return false;
    }

    public transferBall(ballToTransfer: Ball) {
        ballToTransfer.velocity = new Vector2(0, 0);
        ballToTransfer.collisions = false;
        ballToTransfer.radius *= G.BALL_DISAPPEAR_FACTOR;
        ballToTransfer.velocity = Vector2.multiplyByNum(ballToTransfer.velocity, 3 / G.BALL_DISAPPEAR_FACTOR);

        let transferredBall = false;

        this.game.balls.forEach((ball, index) => {
            if (ball === ballToTransfer && ball.radius < G.BALL_RADIUS / 5) {
                this.game.balls.splice(index, 1);
                transferredBall = true;
            }
        });

        if(!transferredBall) return;

        if(ballToTransfer.color === "white") {
            this.isWhiteBallOut = true;
            this.switchPlayer();
            return;
        }

        if(ballToTransfer.color === "black") {
            if(!this.filledPlayer || !this.halfFilledPlayer) {
                console.log(`Match over. Player ${1 - this.currentPlayerIndex} wins!`);
                return;
            }

            if(this.currentPlayersSide === BallSide.FILLED) {
                if(this.filledPlayer.capturedBalls.length < 7){
                    console.log(`Match over. Player ${1 - this.currentPlayerIndex} wins!`)
                }
            } else {
                if(this.halfFilledPlayer.capturedBalls.length < 7){
                    console.log(`Match over. Player ${1 - this.currentPlayerIndex} wins!`)
                }
            }
            this.transferBallToPlayerBank(ballToTransfer, this.currentPlayersSide);
            return;
        }

        if(!this.filledPlayer || !this.halfFilledPlayer) {
            this.assignPlayerSides(ballToTransfer);
        }

        this.transferBallToPlayerBank(ballToTransfer, ballToTransfer.side);
    }

    private transferBallToPlayerBank(ball: Ball, side: BallSide){
        if(side === BallSide.FILLED) {
            this.filledPlayer.addBallToBank(ball);
        } else {
            this.halfFilledPlayer.addBallToBank(ball);
        }

        if(side !== this.currentPlayersSide){
            this.switchPlayer();
        }
    }

    private assignPlayerSides(ball: Ball) {
        if(ball.side === BallSide.FILLED) {
            this.filledPlayer = this.players[this.currentPlayerIndex];
            this.halfFilledPlayer = this.players[1 - this.currentPlayerIndex];
            this.currentPlayersSide = BallSide.FILLED;
        } else if(ball.side === BallSide.HALF_FILLED) {
            this.halfFilledPlayer = this.players[this.currentPlayerIndex];
            this.filledPlayer = this.players[1 - this.currentPlayerIndex];
            this.currentPlayersSide = BallSide.HALF_FILLED;
        }
    }

    public switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        this.currentPlayersSide = this.currentPlayersSide === BallSide.FILLED ? BallSide.HALF_FILLED : BallSide.FILLED;
        if(this.currentPlayerIndex === 1) {
            HTML.leftPlayerIcon.style.borderColor = "white";
            HTML.rightPlayerIcon.style.borderColor = "black";
        }else {
            HTML.leftPlayerIcon.style.borderColor = "black";
            HTML.rightPlayerIcon.style.borderColor = "white";
        }
    }
}