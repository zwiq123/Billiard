export class Globals {
}
//-----DIMENSIONS-----
Globals.TABLE_WIDTH = 1440;
Globals.TABLE_HEIGHT = 720;
Globals.TABLE_BORDER_WIDTH = 40;
Globals.HOLE_RADIUS = 30;
Globals.BALL_RADIUS = 20;
//-----CANVAS-----
Globals.CTX = null;
Globals.CANVAS_WIDTH = Globals.TABLE_WIDTH * 2;
Globals.CANVAS_HEIGHT = Globals.TABLE_HEIGHT * 2;
Globals.OFFSET_X = Globals.CANVAS_WIDTH / 2 - Globals.TABLE_WIDTH / 2;
Globals.OFFSET_Y = Globals.CANVAS_HEIGHT / 2 - Globals.TABLE_HEIGHT / 2;
//-----MOVEMENT-----
Globals.MIN_BALL_SPEED = 0.05;
Globals.SLOW_DOWN_FACTOR = 0.99;
Globals.BALL_ROTATION_FACTOR = 5;
//-----TABLE-----
Globals.TABLE_BORDER_COLOR = "#8f5d1b";
Globals.TABLE_MAIN_COLOR = "#169149";
Globals.TABLE_SIDE_COLOR = "#117038";
Globals.HOLE_COLOR = "#141414";
//-----CUE DRAWING-----
Globals.CUE_LENGTH = 400;
Globals.CUE_DISTANCE_FROM_BALL = 15;
Globals.CUE_TIP_OVERLAP = 2;
Globals.CUE_SEGMENTS_WIDTH = [
    10,
    11,
    10,
    9,
    9,
    9,
    9
];
Globals.CUE_SEGMENTS_LENGTH_RATIO = [
    1 / 1300,
    200 / 1300,
    405 / 1300,
    20 / 1300,
    600 / 1300,
    60 / 1300,
    14 / 1300
];
Globals.CUE_SEGMENTS_COLOR = [
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
Globals.HIT_PROJECTION_WIDTH = 2;
Globals.HIT_PROJECTION_COLOR = "white";
Globals.HIT_PROJECTION_DASH = [10, 10];
Globals.HIT_DIRECTION_LINES_TOTAL_LENGTH = 125;
//-----HITTING-----
Globals.MAX_POWER = 50;
Globals.PULL_DISTANCE_TO_POWER_FACTOR = 0.2;
Globals.CUE_PULL_DISTANCE_FACTOR = 1.5;
Globals.POWER_RELEASE_FACTOR = 0.3;
