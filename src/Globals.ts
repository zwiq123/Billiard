export class Globals{
    //-----DIMENSIONS-----
    static readonly TABLE_WIDTH: number = 1440;
    static readonly TABLE_HEIGHT: number = 720;
    static readonly TABLE_BORDER_WIDTH: number = 40;
    static readonly HOLE_RADIUS: number = 30;
    static readonly BALL_RADIUS: number = 20;

    //-----CANVAS-----
    static CTX: CanvasRenderingContext2D | null = null;
    
    //-----MOVEMENT-----
    static readonly MIN_BALL_SPEED: number = 0.05;
    static readonly SLOW_DOWN_FACTOR: number = 0.99;
    static readonly BALL_ROTATION_FACTOR: number = 5;
}