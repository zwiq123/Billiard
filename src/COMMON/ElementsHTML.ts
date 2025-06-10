export class ElementsHTML{
    public static mainContainer: HTMLElement;
    public static tableCanvas: HTMLCanvasElement;

    public static getMainContainer(ID: string){
        ElementsHTML.mainContainer = document.getElementById(ID)!;
    }

    public static getTableCanvas(){
        ElementsHTML.tableCanvas = ElementsHTML.mainContainer.querySelector('canvas')!;
    }

    public static tooltips: HTMLElement = document.getElementById('tooltips')!;

    //-----PLAYER MENUS-----

    private static leftPlayerContainer: HTMLElement = document.getElementById('leftPlayer')!;
    private static rightPlayerContainer: HTMLElement = document.getElementById('rightPlayer')!;

    public static leftPlayerTag: HTMLElement = ElementsHTML.leftPlayerContainer.querySelector('.playerTag')!;
    public static rightPlayerTag: HTMLElement = ElementsHTML.rightPlayerContainer.querySelector('.playerTag')!;

    public static leftPlayerIcon: HTMLElement = ElementsHTML.leftPlayerTag.querySelector('.playerIcon')!;
    public static rightPlayerIcon: HTMLElement = ElementsHTML.rightPlayerTag.querySelector('.playerIcon')!;

    public static leftPlayerCanvas: HTMLCanvasElement = ElementsHTML.leftPlayerContainer.querySelector('canvas')!;
    public static rightPlayerCanvas: HTMLCanvasElement = ElementsHTML.rightPlayerContainer.querySelector('canvas')!;

    public static leftPlayerCanvasLabel: HTMLElement = ElementsHTML.leftPlayerContainer.querySelector('.ballContainer div')!;
    public static rightPlayerCanvasLabel: HTMLElement = ElementsHTML.rightPlayerContainer.querySelector('.ballContainer div')!;


    //-----SETTINGS------

    public static menuBtn: HTMLElement = document.getElementById('menuBtn')!;
    public static settings: HTMLElement = document.getElementById('settings')!;
    public static closeSettingsBtn: HTMLElement = document.getElementById('closeSettingsBtn')!;
    public static restartBtnSettings: HTMLElement = document.getElementById('restartBtnSettings')!;
    public static infoBtnSettings: HTMLElement = document.getElementById('infoBtnSettings')!;
    public static showProjectionBtnSettings: HTMLElement = document.getElementById('showProjectionBtnSettings')!;

    //-----TOP BAR-----

    public static extraDataContainer: HTMLElement = document.getElementById('extraDataContainer')!;
    public static timeExtraData: HTMLElement = document.getElementById('timeExtraData')!;
    public static turnExtraData: HTMLElement = document.getElementById('turnExtraData')!;

    //-----GAME OVER SCREEN-----

    public static gameOverScreen: HTMLElement = document.getElementById('gameOverScreen')!;
    public static gameOverTitleBallLeft: HTMLCanvasElement = document.querySelector('#gameOverTitleBallLeft')!;
    public static gameOverTitleBallRight: HTMLCanvasElement = document.querySelector('#gameOverTitleBallRight')!;
    public static gameOverTitle: HTMLElement = document.getElementById('gameOverTitle')!;
    public static gameOverMessage: HTMLElement = document.getElementById('gameOverMessage')!;
    public static gameOverTime: HTMLElement = document.getElementById('gameOverTime')!.querySelector('span')!;
    public static gameOverTurns: HTMLElement = document.getElementById('gameOverTurns')!.querySelector('span')!;
    public static gameOverRestartBtn: HTMLElement = document.getElementById('restartBtnGameOverScreen')!;

}