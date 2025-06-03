export class Globals{
    //-----DIMENSIONS-----
    static readonly TABLE_WIDTH: number = 1440;
    static readonly TABLE_HEIGHT: number = 720;
    static readonly TABLE_BORDER_WIDTH: number = 40;
    static readonly HOLE_RADIUS: number = 30;
    static readonly BALL_RADIUS: number = 20;

    //-----CANVAS-----
    static CTX: CanvasRenderingContext2D | null = null;
    static readonly CANVAS_WIDTH: number = Globals.TABLE_WIDTH * 2;
    static readonly CANVAS_HEIGHT: number = Globals.TABLE_HEIGHT * 2;
    static readonly OFFSET_X: number = Globals.CANVAS_WIDTH / 2 - Globals.TABLE_WIDTH / 2;
    static readonly OFFSET_Y: number = Globals.CANVAS_HEIGHT / 2 - Globals.TABLE_HEIGHT / 2;
    
    //-----MOVEMENT-----
    static readonly MIN_BALL_SPEED: number = 0.05;
    static readonly SLOW_DOWN_FACTOR: number = 0.99;
    static readonly BALL_ROTATION_FACTOR: number = 5;

    //-----TABLE-----
    static readonly TABLE_BORDER_COLOR: string = "#8f5d1b";
    static readonly TABLE_MAIN_COLOR: string = "#169149";
    static readonly TABLE_SIDE_COLOR: string = "#117038";
    static readonly HOLE_COLOR: string = "#141414";

    //-----CUE-----
    static readonly CUE_LENGTH: number = 400;
    static readonly CUE_DISTANCE_FROM_BALL: number = 15;

    static readonly CUE_SEGMENTS_WIDTH: number[] = [
        11,
        11,
        10,
        9,
        9,
        8,
        8
    ];

    static readonly CUE_SEGMENTS_LENGTH_RATIO: number[] = [
        15 / 1300,
        200 / 1300,
        405 / 1300,
        20 / 1300,
        620 / 1300,
        30 / 1300,
        10 / 1300
    ];

    static readonly CUE_SEGMENTS_COLOR: string[] = [
        "#f0cd81",
        "#452803",
        "#f0cd81",
        "#452803",
        "#f0cd81",
        "white",
        "black"
    ];
}