import { Globals as G } from "./Globals.js";
import { Circle, Segment, Vector2 } from "./Geometry.js";

export default class Cue{

    static draw(ball: Circle, mousePos: Vector2){
        const directionVector = Vector2.subtract(mousePos, ball.center);
        const normalizedDirection = Vector2.multiplyByNum(directionVector.normalized(), -1);

        let currentDistance = ball.radius + G.CUE_DISTANCE_FROM_BALL;
        for(let i = G.CUE_SEGMENTS_LENGTH_RATIO.length - 1 ; i >= 0 ; i--){
            const segmentLength = G.CUE_SEGMENTS_LENGTH_RATIO[i] * G.CUE_LENGTH;

            const segmentStart = Vector2.add(ball.center, Vector2.multiplyByNum(normalizedDirection, currentDistance));
            const segmentEnd = Vector2.add(ball.center, Vector2.multiplyByNum(normalizedDirection, currentDistance + segmentLength));
            
            const segment = new Segment(segmentStart, segmentEnd, G.CTX!);
            segment.draw(G.CUE_SEGMENTS_COLOR[i], G.CUE_SEGMENTS_WIDTH[i], {lineCap: "round"});

            currentDistance += segmentLength;
        }
    }
}