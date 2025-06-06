import { Circle, Vector2, Polygon } from '../COMMON/Geometry.js';
import { Ball } from '../COMMON/Ball.js';
import Game from '../Game.js';
import Utils from '../COMMON/Utils.js';


export default class CollisionManager{
    private game: Game;

    constructor(game: Game){
        this.game = game;
    }

    //-----RESOLVING COLLISIONS-----

    //only to help with start of the game where all balls are touching each other
    public resolveBallCollisionsWithOtherBalls(){
        for(let j = 0 ; j < this.game.balls.length ; j++){
            for(let k = j + 1 ; k < this.game.balls.length ; k++){
                const ballA = this.game.balls[j];
                const ballB = this.game.balls[k];

                if(Utils.areBallsTouching(ballA, ballB)){
                    CollisionManager.reflectBalls(ballA, ballB);
                }
            }
        }
    }

    public resolveCollisions(ball: Circle) {
        const steps = 4;
        const subVelocity = Vector2.multiplyByNum(ball.velocity, 1 / steps);

        for (let step = 0; step < steps; step++) {
            let hit = false;
            let ballCenterAtCollisionWithWall: Vector2 | null = null;
            let wallNormal: Vector2 | null = null;
            let ballCenterAtCollisionWithBall: Vector2 | null = null;
            let hitBall: Circle | null = null;

            // walls
            for (const wall of this.game.walls) {
                for (let i = 0; i < wall.vertices.length; i++) {
                    const wallStart = wall.vertices[i];
                    const wallEnd = wall.vertices[(i + 1) % wall.vertices.length];
                    const ballPathStart = ball.center;
                    const ballPathEnd = Vector2.add(ball.center, subVelocity);

                    if (CollisionManager.distanceSegmentToSegment(ballPathStart, ballPathEnd, wallStart, wallEnd) <= ball.radius) {
                        ballCenterAtCollisionWithWall = CollisionManager.findBallWallCollisionPoint(ballPathStart, ballPathEnd, wallStart, wallEnd, ball.radius);
                        if (!ballCenterAtCollisionWithWall) continue;
                        wallNormal = Vector2.getWallNormal(wallStart, wallEnd);
                        hit = true;
                        break;
                    }
                }
                if (hit) break;
            }

            // balls
            for (const otherBall of this.game.balls) {
                if (otherBall === ball) continue;

                if (CollisionManager.getBallCollisionTime(ball, otherBall)) {
                    const collision = CollisionManager.rayBallIntersection(ball, otherBall, subVelocity.normalized());
                    if (!collision) continue;
                    ballCenterAtCollisionWithBall = collision.point;
                    hitBall = otherBall;
                    hit = true;
                    break;
                }
            }

            if (!hit) {
                ball.center = Vector2.add(ball.center, subVelocity);
                continue;
            }

            let ballFirst = false;

            if (ballCenterAtCollisionWithBall && ballCenterAtCollisionWithWall) {
                if (Vector2.subtract(ballCenterAtCollisionWithBall, ball.center).length() < Vector2.subtract(ballCenterAtCollisionWithWall, ball.center).length()) {
                    ballFirst = true;
                }
            } else if (ballCenterAtCollisionWithBall) ballFirst = true;

            if (ballFirst) {
                ball.center = ballCenterAtCollisionWithBall!;
                CollisionManager.reflectBalls(ball, hitBall!);
            } else {
                ball.center = ballCenterAtCollisionWithWall!;
                CollisionManager.reflectBallOffWall(ball, wallNormal!);
            }

            break;
        }
    }

    //-----REFLECTING BALLS-----

    private static reflectBallOffWall(ball: Circle, normal: Vector2): void{
        ball.velocity = Vector2.reflect(ball.velocity, normal);
    }

    private static reflectBalls(ballA: Circle, ballB: Circle): void{
        const normal = Vector2.subtract(ballA.center, ballB.center).normalized();
        const relativeVelocity = Vector2.subtract(ballA.velocity, ballB.velocity);
        const velocityAlongNormal = Vector2.dot(relativeVelocity, normal);

        if (velocityAlongNormal > 0) return;

        const restitution = 1;
        const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / 2;

        const impulse = Vector2.multiplyByNum(normal, impulseMagnitude);

        ballA.velocity = Vector2.add(ballA.velocity, impulse);
        ballB.velocity = Vector2.subtract(ballB.velocity, impulse);

        //for more "splash" 
        const distance = Vector2.subtract(ballA.center, ballB.center).length();
        const overlap = ballA.radius + ballB.radius - distance;
        if (overlap > 0) {
            const correction = Vector2.multiplyByNum(normal, overlap / 2 + 0.001);
            ballA.center = Vector2.add(ballA.center, correction);
            ballB.center = Vector2.subtract(ballB.center, correction);
        }
    }

    //-----HELPERS-----

    private static findBallWallCollisionPoint(
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

    private static closestPointOnSegment(point: Vector2, start: Vector2, end: Vector2): Vector2 {
        const ab = Vector2.subtract(end, start);
        const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(point, start), ab) / ab.length() ** 2));
        return Vector2.add(start, Vector2.multiplyByNum(ab, t));
    }

    private static distancePointToSegment(point: Vector2, start: Vector2, end: Vector2): number {
        const closest = this.closestPointOnSegment(point, start, end);
        return Vector2.subtract(point, closest).length();
    }

    private static distanceSegmentToSegment(start1: Vector2, end1: Vector2, start2: Vector2, end2: Vector2): number {
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

    private static getBallCollisionTime(ballA: Circle, ballB: Circle): number | null {
        const dp = Vector2.subtract(ballB.center, ballA.center);
        const dv = Vector2.subtract(ballB.velocity, ballA.velocity);
        const radii = ballA.radius + ballB.radius;

        const a = Vector2.dot(dv, dv);
        const b = 2 * Vector2.dot(dp, dv);
        const c = Vector2.dot(dp, dp) - radii * radii;

        const discriminant = b * b - 4 * a * c;
        if (a === 0) return null; // Parallel movement
        if (discriminant < 0) return null;

        const sqrtDisc = Math.sqrt(discriminant);
        const t1 = (-b - sqrtDisc) / (2 * a);
        const t2 = (-b + sqrtDisc) / (2 * a);

        // We want the first collision in [0,1]
        if (t1 >= 0 && t1 <= 1) return t1;
        if (t2 >= 0 && t2 <= 1) return t2;
        return null;
    }

    //-----RAY-CASTING (CUE)-----

    public static getFirstCollisionPoint(cursorPos: Vector2, whiteBall: Ball, balls: Circle[], walls: Polygon[], holes: Circle[]): {closestPoint: Vector2, ballHit: Circle  | null} {
        const direction = Vector2.subtract(cursorPos, whiteBall.center).normalized();
        let closestPoint: Vector2 | null = null;
        let minDist = Infinity;
        let ballHit = null;

        for (const ball of balls) {
            if (ball === whiteBall) continue;
            const hit = CollisionManager.rayBallIntersection(whiteBall, ball, direction);

            if (hit && hit.distance < minDist) {
                minDist = hit.distance;
                closestPoint =  hit.point;
                ballHit = ball;
            }
        }

        for (const wall of walls) {
            for (let i = 0; i < wall.vertices.length; i++) {
                const start = wall.vertices[i];
                const end = wall.vertices[(i + 1) % wall.vertices.length];
                const hit = CollisionManager.rayWallIntersection(whiteBall, direction, start, end);

                if (hit && hit.distance < minDist) {
                    minDist = hit.distance;
                    closestPoint = hit.point;
                    ballHit = null;
                }
            }
        }

        for(const hole of holes){
            const hit = CollisionManager.rayHoleIntersection(whiteBall, hole, direction);
            
            if (hit && hit.distance < minDist) {
                minDist = hit.distance;
                closestPoint = hit.point;
                ballHit = null;
            }
        }

        return closestPoint ? {closestPoint: closestPoint, ballHit: ballHit} : {closestPoint: cursorPos, ballHit: null};
    }

    private static rayHoleIntersection(whiteBall: Circle, ball: Circle, dir: Vector2) {
        const origin = whiteBall.center;
        const center = ball.center;
        const sumRadii = whiteBall.radius + ball.radius;

        const oc = Vector2.subtract(origin, center);
        const a = Vector2.dot(dir, dir);
        const b = 2 * Vector2.dot(oc, dir);
        const c = Vector2.dot(oc, oc) - sumRadii * sumRadii;
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return null;

        const sqrtDisc = Math.sqrt(discriminant);
        const t = (-b - sqrtDisc) / (2 * a);
        if (t < 0 || Number.isNaN(t)) return null;

        const whiteAtCollision = Vector2.add(origin, Vector2.multiplyByNum(dir, t));
        const contactDir = Vector2.subtract(whiteAtCollision, center).normalized();
        const contactPoint = Vector2.add(center, Vector2.multiplyByNum(contactDir, ball.radius));

        return { point: contactPoint, distance: t };
    }

    private static rayBallIntersection(ballA: Circle, ballB: Circle, dir: Vector2) {
        const origin = ballA.center;
        const center = ballB.center;
        const radius = ballB.radius + ballA.radius;

        const oc = Vector2.subtract(origin, center);
        const a = Vector2.dot(dir, dir);
        const b = 2 * Vector2.dot(oc, dir);
        const c = Vector2.dot(oc, oc) - (radius ** 2);
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return null;
        const t = (-b - Math.sqrt(discriminant)) / (2 * a);
        if (t < 0 || Number.isNaN(t)) return null;
        return { point: Vector2.add(origin, Vector2.multiplyByNum(dir, t)), distance: t };
    }

    private static rayWallIntersection(whiteBall: Circle, dir: Vector2, segA: Vector2, segB: Vector2) {
        // Ray: origin + t*dir, Segment: segA + u*(segB-segA), 0<=u<=1
        const origin = whiteBall.center;
        const v1 = Vector2.subtract(origin, segA);
        const v2 = Vector2.subtract(segB, segA);
        const v3 = new Vector2(-dir.y, dir.x);
        const dot = Vector2.dot(v2, v3);
        if (Math.abs(dot) < 1e-6) return null; // can't put === 0 bc float
        const t = Vector2.cross(v2, v1) / dot;
        const u = Vector2.dot(v1, v3) / dot;

        let wallNormal = Vector2.getWallNormal(segA, segB);
        if(Vector2.dot(wallNormal, dir) > 0){
            wallNormal = Vector2.multiplyByNum(wallNormal, -1);
        }

        const hitPoint = Vector2.add(origin, Vector2.multiplyByNum(dir, t))
        const hitPointOffset = Vector2.add(hitPoint, Vector2.multiplyByNum(wallNormal, whiteBall.radius))
        

        if (t >= 0 && u >= 0 && u <= 1) {
            return { point: hitPointOffset, distance: t };
        }
        return null;
    }

}

