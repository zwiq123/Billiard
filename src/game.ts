import { Globals as G } from "./COMMON/Globals.js";
import { ElementsHTML as HTML } from "./COMMON/ElementsHTML.js";
import { Polygon, Circle, Vector2 } from "./COMMON/Geometry.js";
import { Ball } from "./COMMON/Ball.js";
import Utils from "./COMMON/Utils.js";
import VisualManager from "./MANAGERS/VisualManager.js";
import MovementManager from './MANAGERS/MovementManager.js'
import CollisionManager from "./MANAGERS/CollisionManager.js";
import CueManager from "./MANAGERS/CueManager.js";
import PlayerManager from "./MANAGERS/PlayerManager.js";


export default class Game{
    public balls: Ball[];
    public walls: Polygon[];
    public holes: Circle[];
    public tableBorders: Polygon[];

    public tableData: any;

    public visualManager: VisualManager;
    public movementManager: MovementManager;
    public collisionManager: CollisionManager;
    public cueManager: CueManager;
    public playerManager: PlayerManager;

    private previousFrameTime: number = 0;
    private currentFrameTime: number = 0;
    public frameTime: number = 0;

    public isGameOver = false;

    constructor(containerID: string){
        this.balls = [];
        this.walls = [];
        this.holes = [];
        this.tableBorders = [];

        HTML.getMainContainer(containerID);
        this.setUpCanvases();
        this.repositionContainer();
    }

    async init(){
        this.tableData = await this.fetchTableSizes();
        this.visualManager = new VisualManager(this);
        this.createBalls();
        this.createTableBorders();
        this.createWalls();
        this.createHoles();
        this.movementManager = new MovementManager(this);
        this.collisionManager = new CollisionManager(this);
        this.playerManager = new PlayerManager(this);
        this.cueManager = new CueManager(this);
    }

    fetchTableSizes(){
        return new Promise((resolve) => {
            fetch('./assets/table.json')
            .then(data => {resolve(data.json());})
        })
    }

    createWalls(){
        const tableSidesData = this.tableData["table-sides"];
        const SQRT2 = Math.sqrt(2);

        tableSidesData.map((side: {x: string | number, y: string | number}[]) => {
            const vertices: Vector2[] = [];
            side.map((vertex: {x: string | number, y: string | number}) => {
                vertices.push(new Vector2(eval(String(vertex.x)), eval(String(vertex.y))))
            })
            const sidePolygon = new Polygon(G.TABLE_SIDE_COLOR, true, G.CTX!, ...vertices); 
            this.walls.push(sidePolygon);
        })
    }

    createHoles(){
        const tableHoleData = this.tableData["holes"];
        const SQRT2 = Math.sqrt(2);

        tableHoleData.map((holeCenter: {x: string | number, y: string | number}) => {
            const center = new Vector2(eval(String(holeCenter.x)), eval(String(holeCenter.y)));
            const holeCircle = new Circle(G.HOLE_COLOR, false, G.CTX!, center, G.HOLE_RADIUS);
            this.holes.push(holeCircle);
        })
    }

    createBalls(){
        this.balls.push(Utils.getNewWhiteBall());
        const ballPlacement = Utils.getRandomBallStartingPlacement();

        const ballPositions = [];
        ballPositions.push([new Vector2(G.TABLE_WIDTH/4*3, G.TABLE_HEIGHT/2)]);
        for(let i=1;i<ballPlacement.length;i++){
            ballPositions.push([]);
            for(let j=0;j<ballPlacement[i].length;j++){
                if(j != ballPlacement[i-1].length){
                    ballPositions[i].push(new Vector2(
                        ballPositions[i-1][j].x + G.BALL_RADIUS*Math.sqrt(3),
                        ballPositions[i-1][j].y + G.BALL_RADIUS
                    ));
                }else{
                    ballPositions[i].push(new Vector2(
                        ballPositions[i-1][j-1].x + G.BALL_RADIUS*Math.sqrt(3),
                        ballPositions[i-1][j-1].y - G.BALL_RADIUS
                    ));
                }
            }
        }

        for(let i=0;i<ballPositions.length;i++){
            for(let j=0;j<ballPositions[i].length;j++){
                this.balls.push(new Ball(G.CTX!, ballPositions[i][j], {number: ballPlacement[i][j]}));
            }
        }
    }

    createTableBorders(){
        this.tableBorders.push(new Polygon(G.TABLE_BORDER_COLOR, false, G.CTX!, new Vector2(0, 0), new Vector2(G.TABLE_WIDTH, 0), new Vector2(G.TABLE_WIDTH, G.TABLE_BORDER_WIDTH), new Vector2(0, G.TABLE_BORDER_WIDTH)));
        this.tableBorders.push(new Polygon(G.TABLE_BORDER_COLOR, false, G.CTX!, new Vector2(0, 0), new Vector2(G.TABLE_BORDER_WIDTH, 0), new Vector2(G.TABLE_BORDER_WIDTH, G.TABLE_HEIGHT), new Vector2(0, G.TABLE_HEIGHT)));
        this.tableBorders.push(new Polygon(G.TABLE_BORDER_COLOR, false, G.CTX!, new Vector2(0, G.TABLE_HEIGHT - G.TABLE_BORDER_WIDTH), new Vector2(G.TABLE_WIDTH, G.TABLE_HEIGHT - G.TABLE_BORDER_WIDTH), new Vector2(G.TABLE_WIDTH, G.TABLE_HEIGHT), new Vector2(0, G.TABLE_HEIGHT)));
        this.tableBorders.push(new Polygon(G.TABLE_BORDER_COLOR, false, G.CTX!, new Vector2(G.TABLE_WIDTH - G.TABLE_BORDER_WIDTH, 0), new Vector2(G.TABLE_WIDTH, 0), new Vector2(G.TABLE_WIDTH, G.TABLE_HEIGHT), new Vector2(G.TABLE_WIDTH - G.TABLE_BORDER_WIDTH, G.TABLE_HEIGHT)));
    }

    setUpCanvases(){
        const tableCanvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;

        tableCanvas.width = G.TABLE_WIDTH * 2 * dpr;
        tableCanvas.height = G.TABLE_HEIGHT * 2 * dpr;
        G.CTX = tableCanvas.getContext('2d')!
        G.CTX.setTransform(dpr, 0, 0, dpr, 0, 0);
        HTML.mainContainer!.appendChild(tableCanvas);
        HTML.getTableCanvas();

        HTML.leftPlayerCanvas.width = G.BALL_RADIUS * 9;
        HTML.rightPlayerCanvas.width = G.BALL_RADIUS * 9;
        HTML.leftPlayerCanvas.height = G.BALL_RADIUS * 2;
        HTML.rightPlayerCanvas.height = G.BALL_RADIUS * 2;
    }

    repositionContainer(){
        Utils.repostion();
        window.addEventListener('resize', Utils.repostion);
    }

    updateGame(){
        this.movementManager.moveBallsAccordingly();
        this.visualManager.drawTable();
        this.visualManager.drawBalls();
        
        const areBallsMovingNow = !Utils.areBallsStill(this.balls)

        if(!areBallsMovingNow && !this.playerManager.isWhiteBallOut){
            this.cueManager.releaseIfPullFinished();
            this.cueManager.drawCueAndProjection();
        }
        if(!areBallsMovingNow && this.playerManager.isWhiteBallOut && this.playerManager.hasCursorMoved){
            HTML.tableCanvas.style.cursor = "grabbing";
            this.playerManager.drawWhiteBallProjection();
        }

        this.playerManager.nextTurnIfTime(areBallsMovingNow);
        
        this.previousFrameTime = this.currentFrameTime || performance.now();
        this.currentFrameTime = performance.now();
        this.frameTime = (this.currentFrameTime - this.previousFrameTime) / 1000;
    }
}

window.addEventListener("load", ()=>{
    const game = new Game("mainContainer");
    function gameLoop(){
        requestAnimationFrame(gameLoop);
        game.updateGame();
    }

    async function startGame(){
        await game.init();
        gameLoop();
    }

    startGame();
})