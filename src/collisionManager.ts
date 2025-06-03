import { Circle, Vector2 } from './Geometry.js';
import Game from './Game.js';


export default class CollisionManager{
    private game: Game;

    constructor(game: Game){
        this.game = game;
    }

    //-----RESOLVING COLLISIONS-----

    resolveBallCollisionsWithOtherBalls(){
        for(let j = 0 ; j < this.game.balls.length ; j++){
            for(let k = j + 1 ; k < this.game.balls.length ; k++){
                const ballA = this.game.balls[j];
                const ballB = this.game.balls[k];

                if(CollisionManager.areBallsTouching(ballA, ballB)){
                    CollisionManager.reflectBalls(ballA, ballB);
                }
            }
        }
    }

    resolveBallCollisionsWithWalls(ball: Circle): void {
        const steps = 4;
        const subVelocity = Vector2.multiplyByNum(ball.velocity,  1 / steps);

        for (let step = 0; step < steps; step++) {
            let hit = false;
            for (const wall of this.game.walls) {
                for (let i = 0; i < wall.vertices.length; i++) {
                    const wallStart = wall.vertices[i];
                    const wallEnd = wall.vertices[(i + 1) % wall.vertices.length];
                    const ballPathStart = ball.center;
                    const ballPathEnd = Vector2.add(ball.center, subVelocity);

                    if (CollisionManager.distanceSegmentToSegment(ballPathStart, ballPathEnd, wallStart, wallEnd) <= ball.radius) {
                        const ballCenterAtCollision = CollisionManager.findCollisionPoint(ballPathStart, ballPathEnd, wallStart, wallEnd, ball.radius);
                        if (ballCenterAtCollision === null) continue;
                        ball.center = ballCenterAtCollision;
                        const wallNormal = Vector2.getWallNormal(wallStart, wallEnd);
                        CollisionManager.reflectBallOffWall(ball, wallNormal);
                        hit = true;
                        break;
                    }
                }
                if (hit) break;
            }
            if (!hit) {
                ball.center = Vector2.add(ball.center, subVelocity);
            } else {
                break;
            }
        }
    }

    //-----REFLECTING BALLS-----

    static reflectBallOffWall(ball: Circle, normal: Vector2): void{
        ball.velocity = Vector2.reflect(ball.velocity, normal);
    }

    static areBallsTouching(ballA: Circle, ballB: Circle): boolean{
        return Vector2.subtract(ballA.center, ballB.center).length() <= ballA.radius + ballB.radius;
    }

    static reflectBalls(ballA: Circle, ballB: Circle): void{

        const normal = Vector2.subtract(ballA.center, ballB.center).normalized();
        const relativeVelocity = Vector2.subtract(ballA.velocity, ballB.velocity);
        const velocityAlongNormal = Vector2.dot(relativeVelocity, normal);

        if (velocityAlongNormal > 0) return;

        const restitution = 1;
        const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / 2;

        const impulse = Vector2.multiplyByNum(normal, impulseMagnitude);

        ballA.velocity = Vector2.add(ballA.velocity, impulse);
        ballB.velocity = Vector2.subtract(ballB.velocity, impulse);

        const distance = Vector2.subtract(ballA.center, ballB.center).length();
        const overlap = ballA.radius + ballB.radius - distance;
        if (overlap > 0) {
            const correction = Vector2.multiplyByNum(normal, overlap / 2 + 0.01); // Adding a small value to prevent sticking
            ballA.center = Vector2.add(ballA.center, correction);
            ballB.center = Vector2.subtract(ballB.center, correction);
        }
    }

    //-----HELPERS-----

    static findCollisionPoint(
        start: Vector2,
        end: Vector2,
        wallStart: Vector2,
        wallEnd: Vector2,
        radius: number
    ): Vector2 | null{
        let low = 0, high = 1, eps = 1e-5, found = false;
        let tHit: number | null = null;

        for (let iter = 0; iter < 20; iter++) {
            let mid = (low + high) / 2;
            let pos = Vector2.add(start, Vector2.multiplyByNum(Vector2.subtract(end, start), mid));
            let dist = this.distancePointToSegment(pos, wallStart, wallEnd);
            if (Math.abs(dist - radius) < eps) {
                found = true;
                tHit = mid;
                break;
            }
            if (dist > radius) {
                low = mid;
            } else {
                high = mid;
                tHit = mid;
            }
        }
        return found ? Vector2.add(start, Vector2.multiplyByNum(Vector2.subtract(end, start), tHit!)) : null;
    }

    static closestPointOnSegment(point: Vector2, start: Vector2, end: Vector2): Vector2 {
        const ab = Vector2.subtract(end, start);
        const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(point, start), ab) / ab.length() ** 2));
        return Vector2.add(start, Vector2.multiplyByNum(ab, t));
    }

    static distancePointToSegment(point: Vector2, start: Vector2, end: Vector2): number {
        const closest = this.closestPointOnSegment(point, start, end);
        return Vector2.subtract(point, closest).length();
    }

    static distanceSegmentToSegment(start1: Vector2, end1: Vector2, start2: Vector2, end2: Vector2): number {
        const seg1 = Vector2.subtract(end1, start1); // segment 1 as vector (just direction)
        const seg2 = Vector2.subtract(end2, start2); // segment 2 as vector (just direction)
        const betweenStarts = Vector2.subtract(start1, start2); // vector betwwen the start points of the segments
        const seg1SqLength = seg1.length() ** 2;
        const seg2SqLength = seg2.length() ** 2; 
        const dotSeg2ToBetweenStarts = Vector2.dot(seg2, betweenStarts);

        const EPS = 1e-8;
        let closestPointOnSeg1Ratio: number
        let closestPointOnSeg2Ratio: number; // ...
        if (seg1SqLength <= EPS && seg2SqLength <= EPS) {
            // both segments are points
            return betweenStarts.length();
        }
        if (seg1SqLength <= EPS) {
            // first segment is a point
            closestPointOnSeg1Ratio = 0;
            closestPointOnSeg2Ratio = Math.max(0, Math.min(1, dotSeg2ToBetweenStarts / seg2SqLength));
        } else {
            const dotSeg1ToBetweenStarts = Vector2.dot(seg1, betweenStarts);
            if (seg2SqLength <= EPS) {
                // second segment is a point
                closestPointOnSeg2Ratio = 0;
                closestPointOnSeg1Ratio = Math.max(0, Math.min(1, -dotSeg1ToBetweenStarts / seg1SqLength));
            } else {
                // neither segment is a point
                const b = Vector2.dot(seg1, seg2);
                const denom = seg1SqLength * seg2SqLength - b * b;
                if (denom !== 0) {
                    closestPointOnSeg1Ratio = Math.max(0, Math.min(1, (b * dotSeg2ToBetweenStarts - dotSeg1ToBetweenStarts * seg2SqLength) / denom));
                } else {
                    closestPointOnSeg1Ratio = 0;
                }
                closestPointOnSeg2Ratio = Math.max(0, Math.min(1, (b * closestPointOnSeg1Ratio + dotSeg2ToBetweenStarts) / seg2SqLength));
            }
        }

        const pt1 = Vector2.add(start1, Vector2.multiplyByNum(seg1, closestPointOnSeg1Ratio));
        const pt2 = Vector2.add(start2, Vector2.multiplyByNum(seg2, closestPointOnSeg2Ratio));
        return Vector2.subtract(pt1, pt2).length();
    }

}

