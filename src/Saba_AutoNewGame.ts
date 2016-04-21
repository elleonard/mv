//=============================================================================
// Saba_AutoNewGame.js
//=============================================================================
/*:ja
 * @plugindesc F5を押した時、自動で NewGame かファイル読み込みを行います
 * @author Sabakan
 *
 * @help
 * Ver
 *
 * New Game を選択した後に F5 を押すと、自動で New Game が実行されます。
 * Continue を選択した後に F5 を押すと、自動で最後にロードされたファイルが実行されます。
 * Save を選択した後に F5 を押すと、自動でそのファイルが読み込まれます。
 * プラグインコマンドはありません。
 */
module Saba {
module AutoNewGame {

var _Scene_Boot_prototype_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    var gameFileData = sessionStorage.getItem('gameFile');
    if (gameFileData != null) {
        if (gameFileData === '0') {
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Map);
        } else {
            var savefileId = parseInt(gameFileData);
            if (DataManager.loadGame(savefileId)) {
                SoundManager.playLoad();
                this.fadeOutAll();
                SceneManager.goto(Scene_Map);
            } else {
                console.error('ファイルロードができませんでした');
                _Scene_Boot_prototype_start.call(this);
            }
        }
    } else {
        _Scene_Boot_prototype_start.call(this);
    }
};

var _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    _Scene_Title_commandNewGame.call(this);
    if ($gameTemp.isPlaytest()) {
        sessionStorage.setItem('gameFile', '0');
    }
}

var _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess
Scene_Load.prototype.onLoadSuccess = function() {
    _Scene_Load_onLoadSuccess.call(this);
    if ($gameTemp.isPlaytest()) {
        sessionStorage.setItem('gameFile', this.savefileId());
    }
};

var _Scene_Save_onSaveSuccess = Scene_Save.prototype.onSaveSuccess
Scene_Save.prototype.onSaveSuccess = function() {
    _Scene_Save_onSaveSuccess.call(this);
    if ($gameTemp.isPlaytest()) {
        sessionStorage.setItem('gameFile', this.savefileId());
    }
};

}}