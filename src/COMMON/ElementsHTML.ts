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

    private static leftPlayerContainer: HTMLElement = document.getElementById('leftPlayer')!;
    private static rightPlayerContainer: HTMLElement = document.getElementById('rightPlayer')!;

    public static leftPlayerCanvas: HTMLCanvasElement = ElementsHTML.leftPlayerContainer.querySelector('canvas')!;
    public static rightPlayerCanvas: HTMLCanvasElement = ElementsHTML.rightPlayerContainer.querySelector('canvas')!;

    public static menuBtn: HTMLElement = document.getElementById('menuBtn')!;

}