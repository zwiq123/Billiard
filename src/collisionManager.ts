import {Vector2} from './utils.js';
import {Polygon, Circle, Segment} from './Shapes.js';

export class Collisions{
    static isBallTouchingWall(ball: Circle, wall: Polygon){
        
    }
}

export function isThereWallInBallsPath(ball: Circle, wall: Polygon):
{ hit: boolean, wallStart?: Vector2, wallEnd?: Vector2} {
    for(let i = 0 ; i < wall.vertices.length ; i++){
        const a = wall.vertices[i];
        const b = wall.vertices[(i + 1) % wall.vertices.length];
        const ab  = new Segment(a, b);
        const ballMovementPath = new Segment(ball.center, Vector2.add(ball.center, ball.velocity));
        if (Segment.distanceBetweenSegments(ab, ballMovementPath) <=  ball.radius) {
            return {
                hit: true,
                wallStart: a,
                wallEnd: b,
                // nearestPoints: Segment.getClosestPointsOnSegments(ab, ballMovementPath)
            };
        }
    }
    return {hit: false};
}

export function findCollisionT(
    start: Vector2,
    end: Vector2,
    wallStart: Vector2,
    wallEnd: Vector2,
    radius: number
): number | null {
    let low = 0, high = 1, eps = 1e-5, found = false;
    let tHit: number | null = null;

    for (let iter = 0; iter < 20; iter++) {
        let mid = (low + high) / 2;
        let pos = Vector2.add(start, Vector2.multiplyByNum(Vector2.subtract(end, start), mid));
        let dist = segmentPointMinDistance(wallStart, wallEnd, pos);
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
    return found ? tHit : null;
}

function segmentPointMinDistance(a: Vector2, b: Vector2, p: Vector2): number {
    const ab = Vector2.subtract(b, a);
    const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(p, a), ab) / ab.length() ** 2));
    const proj = Vector2.add(a, Vector2.multiplyByNum(ab, t));
    return Vector2.subtract(p, proj).length();
}
