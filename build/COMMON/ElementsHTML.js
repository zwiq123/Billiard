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
ElementsHTML.leftPlayerCanvasLabel = ElementsHTML.leftPlayerContainer.querySelector('.ballContainer div');
ElementsHTML.rightPlayerCanvasLabel = ElementsHTML.rightPlayerContainer.querySelector('.ballContainer div');
//----- ------
ElementsHTML.menuBtn = document.getElementById('menuBtn');
ElementsHTML.settings = document.getElementById('settings');
ElementsHTML.closeSettingsBtn = document.getElementById('closeSettingsBtn');
ElementsHTML.restartBtnSettings = document.getElementById('restartBtnSettings');
ElementsHTML.infoBtnSettings = document.getElementById('infoBtnSettings');
ElementsHTML.showProjectionBtnSettings = document.getElementById('showProjectionBtnSettings');
ElementsHTML.extraDataContainer = document.getElementById('extraDataContainer');
ElementsHTML.timeExtraData = document.getElementById('timeExtraData');
ElementsHTML.turnExtraData = document.getElementById('turnExtraData');
ElementsHTML.gameOverScreen = document.getElementById('gameOverScreen');
ElementsHTML.gameOverTitleBallLeft = document.querySelector('#gameOverTitleBallLeft');
ElementsHTML.gameOverTitleBallRight = document.querySelector('#gameOverTitleBallRight');
ElementsHTML.gameOverTitle = document.getElementById('gameOverTitle');
ElementsHTML.gameOverMessage = document.getElementById('gameOverMessage');
ElementsHTML.gameOverTime = document.getElementById('gameOverTime').querySelector('span');
ElementsHTML.gameOverTurns = document.getElementById('gameOverTurns').querySelector('span');
ElementsHTML.gameOverRestartBtn = document.getElementById('restartBtnGameOverScreen');
