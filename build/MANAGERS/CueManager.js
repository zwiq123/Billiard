import { Globals as G } from "../COMMON/Globals.js";
import { ElementsHTML as HTML } from "../COMMON/ElementsHTML.js";
import { Circle, Segment, Vector2 } from "../COMMON/Geometry.js";
import Utils from "../COMMON/Utils.js";
import CollisionManager from "./CollisionManager.js";
export default class CueManager {
    constructor(game) {
        this.cursorPos = new Vector2(G.TABLE_WIDTH / 2, G.TABLE_HEIGHT / 2);
        this.touchPos = null;
        this.releasePos = null;
        this.isPulling = false;
        this.power = 0;
        this.truePower = 0;
        this.game = game;
        this.whiteBall = this.game.balls[0];
        this.detectTouch();
        this.detectCursorMove();
    }
    detectCursorMove() {
        HTML.tableCanvas.addEventListener("mousemove", (e) => {
            if (this.isPulling) {
                const pullDistance = this.getPullDistance(Utils.getCursorPosition(HTML.tableCanvas, e));
                const power = Math.max(pullDistance, 0) * G.PULL_DISTANCE_TO_POWER_FACTOR;
                this.power = Math.min(power, G.MAX_POWER);
                this.truePower = this.power;
            }
            else {
                if (this.power > 0)
                    return;
                this.cursorPos = Utils.getCursorPosition(HTML.tableCanvas, e);
            }
        });
    }
    updateWhiteBall() {
        this.whiteBall = this.game.balls[0];
    }
    detectTouch() {
        HTML.tableCanvas.addEventListener("mousedown", (e) => {
            this.isPulling = true;
            this.touchPos = Utils.getCursorPosition(HTML.tableCanvas, e);
        });
        HTML.tableCanvas.addEventListener("mouseup", (e) => {
            this.isPulling = false;
            this.releasePos = Utils.getCursorPosition(HTML.tableCanvas, e);
        });
    }
    getPullDistance(cursorPos) {
        const pullVector = Vector2.subtract(this.touchPos, cursorPos);
        const dirVector = Vector2.subtract(this.touchPos, this.whiteBall.center);
        const pullDistanceSign = Vector2.dot(pullVector, dirVector) >= 0 ? 1 : -1;
        return Vector2.subtract(this.touchPos, cursorPos).length() * pullDistanceSign;
    }
    getBallHitForce() {
        const pullVector = Vector2.subtract(this.touchPos, this.releasePos);
        const dirVector = Vector2.subtract(this.touchPos, this.whiteBall.center);
        const pullDistanceSign = Vector2.dot(pullVector, dirVector) >= 0 ? 1 : -1;
        return Vector2.multiplyByNum(dirVector.normalized(), this.truePower * pullDistanceSign);
    }
    drawCueAndProjection() {
        const collision = CollisionManager.getFirstCollisionPoint(this.cursorPos, this.whiteBall, this.game.balls, this.game.walls, this.game.holes);
        const collisionPoint = collision.closestPoint;
        const ballHit = collision.ballHit;
        this.drawCue();
        const trajectory = new Segment(this.whiteBall.center, collisionPoint, G.CTX);
        trajectory.draw(G.HIT_PROJECTION_COLOR, G.HIT_PROJECTION_WIDTH, { lineCap: "square", lineDash: G.HIT_PROJECTION_DASH });
        const endBallProjection = new Circle(G.HIT_PROJECTION_COLOR, false, G.CTX, collisionPoint, G.BALL_RADIUS, { isHollow: true, borderWidth: G.HIT_PROJECTION_WIDTH });
        endBallProjection.draw();
        if (ballHit) {
            this.drawCollisionLines(ballHit, collisionPoint);
        }
    }
    drawCollisionLines(hitBall, collisionPoint) {
        const normal = Vector2.subtract(hitBall.center, collisionPoint).normalized();
        const tangent = new Vector2(-normal.y, normal.x);
        const incoming = Vector2.subtract(collisionPoint, this.whiteBall.center).normalized();
        const totalLen = G.HIT_DIRECTION_LINES_TOTAL_LENGTH;
        const dot = Math.abs(Vector2.dot(incoming, normal));
        const targetLen = totalLen * dot;
        const whiteLen = totalLen * (1 - dot);
        const targetSeg = new Segment(collisionPoint, Vector2.add(collisionPoint, Vector2.multiplyByNum(normal, targetLen)), G.CTX);
        const tangentSign = Vector2.dot(incoming, tangent) >= 0 ? 1 : -1;
        const whitePostDir = Vector2.multiplyByNum(tangent, tangentSign);
        const whiteSeg = new Segment(collisionPoint, Vector2.add(collisionPoint, Vector2.multiplyByNum(whitePostDir, whiteLen)), G.CTX);
        const targetSegmentColor = Utils.getOppositeColor(hitBall.color);
        targetSeg.draw(targetSegmentColor, G.HIT_PROJECTION_WIDTH);
        whiteSeg.draw(G.HIT_PROJECTION_COLOR, G.HIT_PROJECTION_WIDTH);
    }
    drawCue() {
        const directionVector = Vector2.subtract(this.cursorPos, this.whiteBall.center);
        const normalizedDirection = Vector2.multiplyByNum(directionVector.normalized(), -1);
        if (directionVector.length() === 0) {
            return;
        }
        let currentDistance = this.whiteBall.radius + G.CUE_DISTANCE_FROM_BALL + this.power * G.CUE_PULL_DISTANCE_FACTOR;
        if (!this.isPulling && this.truePower > 0) {
            currentDistance -= G.CUE_DISTANCE_FROM_BALL - G.CUE_TIP_OVERLAP;
        }
        for (let i = G.CUE_SEGMENTS_LENGTH_RATIO.length - 1; i >= 0; i--) {
            const segmentLength = G.CUE_SEGMENTS_LENGTH_RATIO[i] * G.CUE_LENGTH;
            const segmentStart = Vector2.add(this.whiteBall.center, Vector2.multiplyByNum(normalizedDirection, currentDistance));
            const segmentEnd = Vector2.add(this.whiteBall.center, Vector2.multiplyByNum(normalizedDirection, currentDistance + segmentLength));
            const segment = new Segment(segmentStart, segmentEnd, G.CTX);
            segment.draw(G.CUE_SEGMENTS_COLOR[i], G.CUE_SEGMENTS_WIDTH[i], { lineCap: "round" });
            currentDistance += segmentLength;
        }
    }
    releaseIfPullFinished() {
        if (!this.isPulling && this.truePower > 0) {
            const decay = Math.max(1, this.power * G.POWER_RELEASE_FACTOR);
            this.power = Math.max(0, this.power - decay);
            if (this.power === 0) {
                this.whiteBall.velocity = this.getBallHitForce();
                this.truePower = 0;
                this.touchPos = null;
                this.releasePos = null;
            }
        }
    }
}
