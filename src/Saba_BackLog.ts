//=============================================================================
// Saba_BackLog.js
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
 * @param marginLeft
 * @desc 本文の左のスペースです。変更した場合、改行位置がずれる場合があります。
 * @default 70
 *
 * @param marginRight
 * @desc 本文の右のスペースです。変更した場合、改行位置がずれる場合があります。
 * @default 30
 *
 * @param nameLeft
 * @desc 名前の左のスペースです。
 * @default 20
 *
 * @param fontSize
 * @desc フォントサイズです。変更した場合、改行位置がずれる場合があります。
 * @default 24
 *
 * @param scrollSpeed
 * @desc カーソルキーでスクロールするときの速度です
 * @default 5
 *
 * @param windowHeight
 * @desc ウィンドウの高さです。大きいほど多く表示できます。
 * @default 2000
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
 * @default 44
 *
 * @param windowSkin
 * @desc バックログ表示に使うウィンドウです
 * @default WindowBacklog
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param backOpacity
 * @desc 背景の透明度です
 * @default 230
 *
 *
 * @help
 * Ver
 *
 * テキストのバックログを表示するプラグインです。
 * 立ち絵スクリプトとの併用を想定しています。
 * 併用しない場合、独自に
 * $gameBackLog.addLog(name, message);
 * を呼ぶ必要があります。
 *
 */
module Saba {
export module BackLog {

const parameters = PluginManager.parameters('Saba_BackLog');


const backLogButton = parameters['backLogButton'];
const scrollSpeed = parseInt(parameters['scrollSpeed']);
const bottmMargin = parseInt(parameters['bottmMargin']);
const windowHeight = parseInt(parameters['windowHeight']);
const maxLogCount = parseInt(parameters['maxLogCount']);
const fontSize = parseInt(parameters['fontSize']);
const logMargin = parseInt(parameters['logMargin']);
const marginLeft = parseInt(parameters['marginLeft']);
const marginRight = parseInt(parameters['marginRight']);
const nameLeft = parseInt(parameters['nameLeft']);
const windowSkin = parameters['windowSkin'];
const backOpacity = parseInt(parameters['backOpacity']);


class Game_BackLog {
    logList: Array<Game_TalkLog> = [];
    addLog(name: string, message: string) {
        this.logList.push(new Game_TalkLog(name, message));
        if (this.logList.length >= maxLogCount) {
            this.logList.shift();
        }
    }
}

class Game_TalkLog {
    y: number;
    constructor(public name: string, public message: string) {
    }
}

/**
 * バックログを表示するウィンドウクラスです。
 */
class Window_BackLog extends Window_Base {
    protected _lineCount: number;
    protected _maxHeight: number;
    constructor() {
        super(0, 0, Graphics.width, windowHeight);
        this._margin = 0;
        this._windowFrameSprite.visible = false;
        this.backOpacity = backOpacity;
        this.opacity = 255;
        this.contentsOpacity = 255;
        this._refreshBack();
        this.drawLogs();
    }
    loadWindowskin(): void {
        this.windowskin = ImageManager.loadSystem(windowSkin);
    }
    drawLogs(): void {
        let y = 0;
        for (const log of $gameBackLog.logList) {
            y += this.drawLog(log, y);
            y += this.logMargin();
        }

        if (y > windowHeight) {
            this._maxHeight = windowHeight;
            // 一回目の描画ではみだしていたら、はみ出す部分をけずって歳描画
            const diff = y - windowHeight + bottmMargin;
            while (true) {
                if ($gameBackLog.logList.length === 0) {
                    break;
                }
                const log = $gameBackLog.logList.shift();
                if (diff < log.y) {
                    break;
                }
            }
            this.contents.clear();
            y = 0;
            for (const log of $gameBackLog.logList) {
                y += this.drawLog(log, y);
                y += this.logMargin();
            }

            this._maxHeight = y + bottmMargin;
            if (this._maxHeight > windowHeight) {
                this._maxHeight = windowHeight;
            }
            // 一番下までスクロールさせる
            this.y = Graphics.height - this._maxHeight;
        } else {
            this._maxHeight = y + bottmMargin;
            if (this._maxHeight > windowHeight) {
                this._maxHeight = windowHeight;
            }
            if (this._maxHeight < Graphics.height) {
                this._maxHeight = Graphics.height;
            }
            this.y = Graphics.height - this._maxHeight;
        }
    }
    /**
     * ログをひとつ描画します
     * @param  {Game_TalkLog} log 描画するログ
     * @param  {number}       y   描画する y 座標
     * @return {number}           描画した高さ
     */
    drawLog(log: Game_TalkLog, y: number): number {
        this._lineCount = 1;
        let message = log.message;
        let height = 0;
        if (log.name) {
            this.drawTextEx(log.name, nameLeft, y);
            console.log(message.charAt(message.length - 1) )
            if (message.charAt(message.length - 1) === '。') {
                message = message.substring(0, message.length - 1);
            }
            message = message + '」';
            y += this.standardFontSize() + 8;
            height = this.standardFontSize() + 8;
            this.drawTextEx('「', marginLeft - this.standardFontSize(), y);
        }
        this.drawTextEx(message, marginLeft, y);
        height += this._lineCount * (this.standardFontSize() + 8);
        log.y = y + height;
        return height;
    }
    processNewLine(textState: MV.TextState): void {
        this._lineCount++;
        super.processNewLine(textState);
    }
    logMargin(): number {
        return logMargin;
    }
    textAreaWidth(): number {
        return this.contentsWidth() - marginRight;
    }
    update(): void {
        super.update();
        if (Input.isPressed('down')) {
            this.y -= scrollSpeed;
            if (this.y < Graphics.height - this._maxHeight) {
                this.y = Graphics.height - this._maxHeight;
            }
        } else if (Input.isPressed('up')) {
            this.y += scrollSpeed;
            if (this.y > 0) {
                this.y = 0;
            }
        }
    }
    standardFontSize(): number {
        return fontSize;
    }
    backPaintOpacity(): number {
        return 128;
    }

}

interface SceneMap {
    _windowBackLog: Window_BackLog;
}

const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
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


const Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
Scene_Boot.prototype.loadSystemImages = function() {
    Scene_Boot_loadSystemImages.call(this);
    if (windowSkin.length > 0) {
        ImageManager.loadSystem(windowSkin);
    }
};


export const $gameBackLog = new Game_BackLog();

}}
