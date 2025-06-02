import {Vector2} from './utils.js';
import {Polygon, Circle, Segment} from './Shapes.js';

//refactor coming to this file and movementManager

export function findCollisionPoint(
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
        let dist = distancePointToSegment(pos, wallStart, wallEnd);
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

function closestPointOnSegment(point: Vector2, start: Vector2, end: Vector2): Vector2 {
    const ab = Vector2.subtract(end, start);
    const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(point, start), ab) / ab.length() ** 2));
    return Vector2.add(start, Vector2.multiplyByNum(ab, t));
}

export function distancePointToSegment(point: Vector2, start: Vector2, end: Vector2): number {
    const closest = closestPointOnSegment(point, start, end);
    return Vector2.subtract(point, closest).length();
}

export function distanceSegmentToSegment(start1: Vector2, end1: Vector2, start2: Vector2, end2: Vector2): number {
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
