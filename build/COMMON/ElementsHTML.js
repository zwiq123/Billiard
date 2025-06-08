export class ElementsHTML {
    static getMainContainer(ID) {
        ElementsHTML.mainContainer = document.getElementById(ID);
    }
    static getTableCanvas() {
        ElementsHTML.tableCanvas = ElementsHTML.mainContainer.querySelector('canvas');
    }
}
ElementsHTML.tooltips = document.getElementById('tooltips');
ElementsHTML.leftPlayerContainer = document.getElementById('leftPlayer');
ElementsHTML.rightPlayerContainer = document.getElementById('rightPlayer');
ElementsHTML.leftPlayerIcon = ElementsHTML.leftPlayerContainer.querySelector('.playerTag');
ElementsHTML.rightPlayerIcon = ElementsHTML.rightPlayerContainer.querySelector('.playerTag');
ElementsHTML.leftPlayerCanvas = ElementsHTML.leftPlayerContainer.querySelector('canvas');
ElementsHTML.rightPlayerCanvas = ElementsHTML.rightPlayerContainer.querySelector('canvas');
ElementsHTML.menuBtn = document.getElementById('menuBtn');
