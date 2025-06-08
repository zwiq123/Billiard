import { Globals as G } from './Globals.js';
import { Circle, Vector2 } from './Geometry.js';
export default class Player {
    constructor(ballBank) {
        this.capturedBalls = [];
        this.ballsLeftToCapture = [];
        this.bank = ballBank;
        this.CTX = this.bank.getContext('2d');
        this.generateBallsLeftToCapture();
        this.drawPlayerBank();
    }
    generateBallsLeftToCapture() {
        for (let i = 0; i < 8; i++) {
            const ball = new Circle("black", false, this.CTX, new Vector2((i + 1) * G.BALL_RADIUS, G.BALL_RADIUS), G.BALL_RADIUS);
            this.ballsLeftToCapture.push(ball);
        }
    }
    addBallToBank(ball) {
        ball.center = new Vector2((this.capturedBalls.length + 1) * G.BALL_RADIUS, G.BALL_RADIUS);
        ball.ctx = this.CTX;
        ball.angle = 0;
        ball.radius = G.BALL_RADIUS;
        this.ballsLeftToCapture.shift();
        this.capturedBalls.push(ball);
        this.drawPlayerBank();
    }
    drawPlayerBank() {
        console.log(this.bank.width, this.bank.height);
        for (const ball of this.ballsLeftToCapture) {
            console.log(ball.center);
            ball.draw();
        }
        for (const ball of this.capturedBalls) {
            ball.draw();
        }
    }
}
