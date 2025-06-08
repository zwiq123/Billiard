import { Globals as G } from "../COMMON/Globals.js";
import { ElementsHTML as HTML } from "../COMMON/ElementsHTML.js";
import { Ball, BallSide } from "../COMMON/Ball.js";
import { Circle, Vector2 } from "../COMMON/Geometry.js";
import Player from "../COMMON/Player.js";
import Utils from "../COMMON/Utils.js";
import Game from "../Game.js";
import TurnData from "../COMMON/TurnData.js";
import Tooltips from "../COMMON/Tooltips.js";

export default class PlayerManager {
    private game: Game;
    private players: Player[] = [new Player(HTML.leftPlayerCanvas), new Player(HTML.rightPlayerCanvas)];
    public filledPlayer: Player;
    public halfFilledPlayer: Player;    

    private currentPlayerIndex: number = 0;
    private currentPlayerSide: BallSide = BallSide.NONE;

    public hasCursorMoved: boolean = false;
    public isWhiteBallOut: boolean = false;
    private whiteBallProjection: Ball = Utils.getNewWhiteBall();

    public wereBallsMoving = false;
    private ballsTransferredDuringTurn: Ball[] = [];

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

        if(ballToTransfer.side === BallSide.CUE) {
            this.isWhiteBallOut = true;
            this.ballsTransferredDuringTurn.push(ballToTransfer);
            return;
        }

        if(ballToTransfer.side === BallSide.BLACK) {
            
            this.transferBallToPlayerBank(ballToTransfer);
            return;
        }

        if(!this.filledPlayer || !this.halfFilledPlayer) {
            this.assignPlayerSides(ballToTransfer);
        }

        this.transferBallToPlayerBank(ballToTransfer, ballToTransfer.side);
    }

    private transferBallToPlayerBank(ball: Ball, side: BallSide = BallSide.NONE){
        this.ballsTransferredDuringTurn.push(ball);

        if(ball.side === BallSide.BLACK){
            this.players[this.currentPlayerIndex].addBallToBank(ball);
            return;
        }

        if(side === BallSide.FILLED) {
            this.filledPlayer.addBallToBank(ball);
        } else {
            this.halfFilledPlayer.addBallToBank(ball);
        }
    }

    private assignPlayerSides(ball: Ball) {
        if(ball.side === BallSide.FILLED) {
            this.filledPlayer = this.players[this.currentPlayerIndex];
            this.halfFilledPlayer = this.players[1 - this.currentPlayerIndex];
            this.currentPlayerSide = BallSide.FILLED;
        } else if(ball.side === BallSide.HALF_FILLED) {
            this.halfFilledPlayer = this.players[this.currentPlayerIndex];
            this.filledPlayer = this.players[1 - this.currentPlayerIndex];
            this.currentPlayerSide = BallSide.HALF_FILLED;
        }
    }

    public switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;

        if(this.currentPlayerSide !== BallSide.NONE) {
            this.currentPlayerSide = this.currentPlayerSide === BallSide.FILLED ? BallSide.HALF_FILLED : BallSide.FILLED;
        }

        if(this.currentPlayerIndex === 0) {
            HTML.leftPlayerTag.style.borderColor = "white";
            HTML.leftPlayerIcon.style.filter = "invert()";
            HTML.rightPlayerTag.style.borderColor = "black";
            HTML.rightPlayerIcon.style.filter = "none";
        }else {
            HTML.leftPlayerTag.style.borderColor = "black";
            HTML.leftPlayerIcon.style.filter = "none";
            HTML.rightPlayerTag.style.borderColor = "white";
            HTML.rightPlayerIcon.style.filter = "invert()";
        }
    }

    public nextTurnIfTime(areBallsMovingNow: boolean){
        const ballsJustStoppedNow = this.wereBallsMoving && !areBallsMovingNow;

        this.wereBallsMoving = areBallsMovingNow;
        
        if(!ballsJustStoppedNow) return;

        const currentTurn = new TurnData(this.currentPlayerSide, this.ballsTransferredDuringTurn);
        this.ballsTransferredDuringTurn = [];
        if(!currentTurn.capturedAnyBalls()){
            Tooltips.set(Tooltips.NO_BALL_POCKETED);
            this.switchPlayer();
            return;
        }

        if(currentTurn.capturedBlackBall()){
            if(this.players[this.currentPlayerIndex].capturedBalls.length === 8){
                HTML.gameOverScreen.style.top = "25%";
                HTML.gameOverScreen.style.opacity = "1";
                console.log(`Player ${this.currentPlayerIndex} wins by capturing the 8-ball!`)
            } else {
                HTML.gameOverScreen.style.top = "25%";
                HTML.gameOverScreen.style.opacity = "1";
                console.log(`Player ${1 - this.currentPlayerIndex} wins by the other player's premature 8-ball capture!`)
            }
            return;
        }

        if(currentTurn.capturedCueBall()) {
            Tooltips.set(Tooltips.CUE_BALL_POCKETED);
            this.switchPlayer();
            return;
        }

        if(currentTurn.capturedOpponentsBall()){
            Tooltips.set(Tooltips.OPPONENTS_BALL_POCKETED);
            this.switchPlayer();
        }
    }
}