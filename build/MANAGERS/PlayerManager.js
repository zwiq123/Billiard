import { Globals as G } from "../COMMON/Globals.js";
import { ElementsHTML as HTML } from "../COMMON/ElementsHTML.js";
import { BallSide } from "../COMMON/Ball.js";
import { Vector2 } from "../COMMON/Geometry.js";
import Player from "../COMMON/Player.js";
import Utils from "../COMMON/Utils.js";
import TurnData from "../COMMON/TurnData.js";
import Tooltips from "../COMMON/Tooltips.js";
export default class PlayerManager {
    constructor(game) {
        this.players = [new Player(HTML.leftPlayerCanvas), new Player(HTML.rightPlayerCanvas)];
        this.currentPlayerIndex = 0;
        this.currentPlayerSide = BallSide.NONE;
        this.hasCursorMoved = false;
        this.isWhiteBallOut = false;
        this.whiteBallProjection = Utils.getNewWhiteBall();
        this.wereBallsMoving = false;
        this.ballsTransferredDuringTurn = [];
        this.totalTurns = 1;
        this.game = game;
        this.whiteBallProjection.color = "rgb(255, 255, 255, 0.75)";
        this.detectWhiteBallPlacement();
    }
    drawWhiteBallProjection() {
        this.whiteBallProjection.draw();
    }
    detectWhiteBallPlacement() {
        HTML.tableCanvas.addEventListener("mousemove", (e) => {
            if (!this.isWhiteBallOut)
                return;
            this.hasCursorMoved = true;
            const cursorPos = Utils.getCursorPosition(HTML.tableCanvas, e);
            this.whiteBallProjection.center = cursorPos;
            if (this.isWhiteBallPlacementInvalid(cursorPos)) {
                this.whiteBallProjection.color = "rgb(255, 0, 0, 0.75)";
            }
            else {
                this.whiteBallProjection.color = "rgb(255, 255, 255, 0.75)";
            }
        });
        HTML.tableCanvas.addEventListener("click", (e) => {
            if (!this.isWhiteBallOut)
                return;
            const cursorPos = Utils.getCursorPosition(HTML.tableCanvas, e);
            if (!this.isWhiteBallPlacementInvalid(cursorPos)) {
                this.isWhiteBallOut = false;
                const whiteBall = Utils.getNewWhiteBall();
                whiteBall.center = cursorPos;
                this.game.balls.unshift(whiteBall);
                this.game.cueManager.updateWhiteBall();
                HTML.tableCanvas.style.cursor = "default";
                this.hasCursorMoved = false;
            }
        });
    }
    isWhiteBallPlacementInvalid(cursorPos) {
        if (cursorPos.x < G.TABLE_BORDER_WIDTH + 30 + G.BALL_RADIUS || cursorPos.y < G.TABLE_BORDER_WIDTH + 30 + G.BALL_RADIUS)
            return true;
        if (cursorPos.x > G.TABLE_WIDTH - G.TABLE_BORDER_WIDTH - 30 - G.BALL_RADIUS || cursorPos.y > G.TABLE_HEIGHT - 30 - G.TABLE_BORDER_WIDTH - G.BALL_RADIUS)
            return true;
        for (const ball of this.game.balls) {
            if (Utils.areBallsTouching(ball, this.whiteBallProjection))
                return true;
        }
        return false;
    }
    transferBall(ballToTransfer) {
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
        if (!transferredBall)
            return;
        if (ballToTransfer.side === BallSide.CUE) {
            this.isWhiteBallOut = true;
            this.ballsTransferredDuringTurn.push(ballToTransfer);
            return;
        }
        if (ballToTransfer.side === BallSide.BLACK) {
            this.transferBallToPlayerBank(ballToTransfer);
            return;
        }
        if (!this.filledPlayer || !this.halfFilledPlayer) {
            this.assignPlayerSides(ballToTransfer);
        }
        this.transferBallToPlayerBank(ballToTransfer, ballToTransfer.side);
    }
    transferBallToPlayerBank(ball, side = BallSide.NONE) {
        this.ballsTransferredDuringTurn.push(ball);
        if (ball.side === BallSide.BLACK) {
            this.players[this.currentPlayerIndex].addBallToBank(ball);
            return;
        }
        if (side === BallSide.FILLED) {
            this.filledPlayer.addBallToBank(ball);
        }
        else {
            this.halfFilledPlayer.addBallToBank(ball);
        }
    }
    assignPlayerSides(ball) {
        if (ball.side === BallSide.FILLED) {
            this.filledPlayer = this.players[this.currentPlayerIndex];
            this.halfFilledPlayer = this.players[1 - this.currentPlayerIndex];
            this.currentPlayerSide = BallSide.FILLED;
        }
        else if (ball.side === BallSide.HALF_FILLED) {
            this.halfFilledPlayer = this.players[this.currentPlayerIndex];
            this.filledPlayer = this.players[1 - this.currentPlayerIndex];
            this.currentPlayerSide = BallSide.HALF_FILLED;
        }
    }
    switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        if (this.currentPlayerSide !== BallSide.NONE) {
            this.currentPlayerSide = this.currentPlayerSide === BallSide.FILLED ? BallSide.HALF_FILLED : BallSide.FILLED;
        }
        if (this.currentPlayerIndex === 0) {
            HTML.leftPlayerTag.style.borderColor = "white";
            HTML.leftPlayerIcon.style.filter = "invert()";
            HTML.rightPlayerTag.style.borderColor = "black";
            HTML.rightPlayerIcon.style.filter = "none";
        }
        else {
            HTML.leftPlayerTag.style.borderColor = "black";
            HTML.leftPlayerIcon.style.filter = "none";
            HTML.rightPlayerTag.style.borderColor = "white";
            HTML.rightPlayerIcon.style.filter = "invert()";
        }
    }
    nextTurnIfTime(areBallsMovingNow) {
        const ballsJustStoppedNow = this.wereBallsMoving && !areBallsMovingNow;
        this.wereBallsMoving = areBallsMovingNow;
        if (!ballsJustStoppedNow)
            return;
        const currentTurn = new TurnData(this.currentPlayerSide, this.ballsTransferredDuringTurn);
        this.totalTurns++;
        HTML.turnExtraData.innerText = `Turn ${this.totalTurns}`;
        this.ballsTransferredDuringTurn = [];
        if (!currentTurn.capturedAnyBalls()) {
            Tooltips.set(Tooltips.NO_BALL_POCKETED);
            this.switchPlayer();
            return;
        }
        if (currentTurn.capturedBlackBall()) {
            if (this.players[this.currentPlayerIndex].capturedBalls.length === 8) {
                this.game.endGame(this.currentPlayerIndex, TurnData.PROPER_GAME_END, this.totalTurns, { winnerSide: this.currentPlayerSide });
            }
            else {
                const winnerSide = this.currentPlayerSide === BallSide.NONE ? BallSide.NONE : this.currentPlayerSide === BallSide.FILLED ? BallSide.HALF_FILLED : BallSide.FILLED;
                this.game.endGame(1 - this.currentPlayerIndex, TurnData.PREMATURE_GAME_END, this.totalTurns, { winnerSide: winnerSide });
            }
            return;
        }
        if (currentTurn.capturedCueBall()) {
            Tooltips.set(Tooltips.CUE_BALL_POCKETED);
            this.switchPlayer();
            return;
        }
        if (currentTurn.capturedOpponentsBall()) {
            Tooltips.set(Tooltips.OPPONENTS_BALL_POCKETED);
            this.switchPlayer();
        }
    }
}
