import { ElementsHTML as HTML } from "./ElementsHTML.js";
import Utils from "./Utils.js";
class Tooltips {
    static set(text) {
        HTML.tooltips.innerText = text;
        Utils.repositionTooltips();
    }
}
Tooltips.CUE_BALL_POCKETED = "Fault! Cue ball pocketed. Ball in hand!";
Tooltips.NO_BALL_POCKETED = "Fault! No ball pocketed.";
Tooltips.OPPONENTS_BALL_POCKETED = "Fault! Opponent's ball pocketed.";
export default Tooltips;
