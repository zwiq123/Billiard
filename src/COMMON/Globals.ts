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

    //-----CUE DRAWING-----
    static readonly CUE_LENGTH: number = 400;
    static readonly CUE_DISTANCE_FROM_BALL: number = 15;
    static readonly CUE_TIP_OVERLAP: number = 2;

    static readonly CUE_SEGMENTS_WIDTH: number[] = [
        10,
        11,
        10,
        9,
        9,
        9,
        9
    ];

    static readonly CUE_SEGMENTS_LENGTH_RATIO: number[] = [
        1 / 1300,
        200 / 1300,
        405 / 1300,
        20 / 1300,
        600 / 1300,
        60 / 1300,
        14 / 1300
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

    // static readonly CUE_SEGMENTS_COLOR: string[] = [
    //     "crimson",
    //     "black",
    //     "crimson",
    //     "black",
    //     "crimson",
    //     "white",
    //     "black"
    // ];

    //-----HIT PROJECTION-----
    static readonly HIT_PROJECTION_WIDTH: number = 2;
    static readonly HIT_PROJECTION_COLOR: string = "white";
    static readonly HIT_PROJECTION_DASH: number[] = [10, 10];
    static readonly HIT_DIRECTION_LINES_TOTAL_LENGTH: number = 125;

    //-----HITTING-----
    static readonly MAX_POWER: number = 50;
    static readonly PULL_DISTANCE_TO_POWER_FACTOR: number = 0.2;
    static readonly CUE_PULL_DISTANCE_FACTOR: number = 1.5;
    static readonly POWER_RELEASE_FACTOR: number = 0.3;
}