var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//=============================================================================
// BackLog.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc バックログを表示するプラグインです。
 *
 *
 * @param backLogButton
 * @desc バックログを表示するボタンです
 * @default pageup
 *
 * @param nameLength
 * @desc 名前表示領域の幅です。変更した場合、改行位置がずれる場合があります。
 * @default 150
 *
 * @param fontSize
 * @desc フォントサイズです。変更した場合、改行位置がずれる場合があります。
 * @default 22
 *
 * @param scrollSpeed
 * @desc カーソルキーでスクロールするときの速度です
 * @default 4
 *
 * @param windowHeight
 * @desc ウィンドウの高さです。大きいほど多く表示できます。
 * @default 1500
 *
 * @param maxLogCount
 * @desc ログを保存しておく最大数です
 * @default 50
 *
 * @param bottmMargin
 * @desc バックログウィンドウの下の空き空間です
 * @default 50
 *
 * @param logMargin
 * @desc ログとログの間の隙間です
 * @default 14
 *
 * @help
 * Ver0.1
 *
 * 睡工房さんのTES　と互換があるようにしています。
 * hime.be/rgss3/tes.html
 * リファレンスも、↑をご覧ください。
 * ただし、未実装箇所が多くあります。
 *
 * ■使い方
 * プロジェクトフォルダと同じディレクトリに
 * scenario フォルダを作成します。
 * その中に.txt ファイルを作成し、シナリオを書いていきます。
 *
 * その後、ツクールの開発環境からゲームを起動し、
 * マップ画面でF7キーを押すことで変換が完了します。
 *
 * シナリオを実行するには、プラグインコマンドで
 * scenatio <<ファイル名>>
 * と記述します。
 */
var BackLog;
(function (BackLog) {
    var parameters = PluginManager.parameters('BackLog');
    var backLogButton = parameters['backLogButton'];
    var nameLength = parseInt(parameters['nameLength']);
    var scrollSpeed = parseInt(parameters['scrollSpeed']);
    var bottmMargin = parseInt(parameters['bottmMargin']);
    var windowHeight = parseInt(parameters['windowHeight']);
    var maxLogCount = parseInt(parameters['maxLogCount']);
    var fontSize = parseInt(parameters['fontSize']);
    var logMargin = parseInt(parameters['logMargin']);
    var Game_BackLog = (function () {
        function Game_BackLog() {
            this.logList = [];
        }
        Game_BackLog.prototype.addLog = function (name, message) {
            this.logList.push(new Game_TalkLog(name, message));
            if (this.logList.length >= maxLogCount) {
                this.logList.shift();
            }
        };
        return Game_BackLog;
    }());
    var Game_TalkLog = (function () {
        function Game_TalkLog(name, message) {
            this.name = name;
            this.message = message;
            console.log(message);
        }
        return Game_TalkLog;
    }());
    var Window_BackLog = (function (_super) {
        __extends(Window_BackLog, _super);
        function Window_BackLog() {
            _super.call(this, 0, 0, Graphics.width, windowHeight);
            this._margin = 0;
            this._windowFrameSprite.visible = false;
            this.backOpacity = 255;
            this.opacity = 255;
            this.contentsOpacity = 255;
            this._refreshBack();
            this.drawLogs();
        }
        Window_BackLog.prototype.drawLogs = function () {
            var y = 0;
            for (var _i = 0, _a = BackLog.$gameBackLog.logList; _i < _a.length; _i++) {
                var log = _a[_i];
                y += this.drawLog(log, y);
                y += this.logMargin();
            }
            if (y > this.height) {
                this._maxHeight = this.height;
                // 一回目の描画ではみだしていたら、はみ出す部分をけずって歳描画
                var diff = y - this.height + bottmMargin;
                while (true) {
                    if (BackLog.$gameBackLog.logList.length === 0) {
                        break;
                    }
                    var log = BackLog.$gameBackLog.logList.shift();
                    if (diff < log.y) {
                        break;
                    }
                }
                this.contents.clear();
                y = 0;
                for (var _b = 0, _c = BackLog.$gameBackLog.logList; _b < _c.length; _b++) {
                    var log = _c[_b];
                    y += this.drawLog(log, y);
                    y += this.logMargin();
                }
                // 一番下までスクロールさせる
                this.y = Graphics.height - this.height;
            }
            else {
                this._maxHeight = y + bottmMargin;
                if (this._maxHeight < Graphics.height) {
                    this._maxHeight = Graphics.height;
                }
                this.y = Graphics.height - this._maxHeight;
            }
        };
        Window_BackLog.prototype.drawLog = function (log, y) {
            this._lineCount = 1;
            this.drawTextEx(log.name, 5, y);
            this.drawTextEx(log.message, nameLength, y);
            var height = this._lineCount * (this.standardFontSize() + 8);
            log.y = y + height;
            return height;
        };
        Window_BackLog.prototype.processNewLine = function (textState) {
            this._lineCount++;
            _super.prototype.processNewLine.call(this, textState);
        };
        Window_BackLog.prototype.logMargin = function () {
            return logMargin;
        };
        Window_BackLog.prototype.update = function () {
            _super.prototype.update.call(this);
            if (Input.isPressed('down')) {
                this.y -= scrollSpeed;
                if (this.y < Graphics.height - this._maxHeight) {
                    this.y = Graphics.height - this._maxHeight;
                }
            }
            else if (Input.isPressed('up')) {
                this.y += scrollSpeed;
                if (this.y > 0) {
                    this.y = 0;
                }
            }
        };
        Window_BackLog.prototype.standardFontSize = function () {
            return fontSize;
        };
        Window_BackLog.prototype.backPaintOpacity = function () {
            return 128;
        };
        return Window_BackLog;
    }(Window_Base));
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        if (this._windowBackLog) {
            this._windowBackLog.update();
            if (Input.isTriggered(backLogButton) || Input.isTriggered('cancel')) {
                this.removeChild(this._windowBackLog);
                this._windowBackLog = null;
                SoundManager.playCancel();
            }
            return;
        }
        _Scene_Map_update.call(this);
        if (Input.isTriggered(backLogButton)) {
            this._windowBackLog = new Window_BackLog();
            SoundManager.playOk();
            this.addChild(this._windowBackLog);
        }
    };
    BackLog.$gameBackLog = new Game_BackLog();
})(BackLog || (BackLog = {}));
