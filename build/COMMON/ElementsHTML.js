export class ElementsHTML {
    static getMainContainer(ID) {
        ElementsHTML.mainContainer = document.getElementById(ID);
    }
    static getTableCanvas() {
        ElementsHTML.tableCanvas = ElementsHTML.mainContainer.querySelector('canvas');
    }
}
ElementsHTML.tooltips = document.getElementById('tooltips');
//-----PLAYER MENUS-----
ElementsHTML.leftPlayerContainer = document.getElementById('leftPlayer');
ElementsHTML.rightPlayerContainer = document.getElementById('rightPlayer');
ElementsHTML.leftPlayerTag = ElementsHTML.leftPlayerContainer.querySelector('.playerTag');
ElementsHTML.rightPlayerTag = ElementsHTML.rightPlayerContainer.querySelector('.playerTag');
ElementsHTML.leftPlayerIcon = ElementsHTML.leftPlayerTag.querySelector('.playerIcon');
ElementsHTML.rightPlayerIcon = ElementsHTML.rightPlayerTag.querySelector('.playerIcon');
ElementsHTML.leftPlayerCanvas = ElementsHTML.leftPlayerContainer.querySelector('canvas');
ElementsHTML.rightPlayerCanvas = ElementsHTML.rightPlayerContainer.querySelector('canvas');
//----- ------
ElementsHTML.menuBtn = document.getElementById('menuBtn');
ElementsHTML.gameOverScreen = document.getElementById('gameOverScreen');
