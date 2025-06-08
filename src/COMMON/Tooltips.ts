import { ElementsHTML as HTML } from "./ElementsHTML.js";
import Utils from "./Utils.js";


export default class Tooltips{

    public static set(text: string){
        HTML.tooltips.innerText = text;
        Utils.repositionTooltips();
    }

    public static readonly CUE_BALL_POCKETED = "Fault! Cue ball pocketed. Ball in hand!";
    public static readonly NO_BALL_POCKETED = "Fault! No ball pocketed.";
    public static readonly OPPONENTS_BALL_POCKETED = "Fault! Opponent's ball pocketed.";

}