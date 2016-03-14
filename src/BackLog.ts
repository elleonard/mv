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
module BackLog {

const parameters = PluginManager.parameters('BackLog');


const backLogButton = parameters['backLogButton'];
const nameLength = parseInt(parameters['nameLength']);
const scrollSpeed = parseInt(parameters['scrollSpeed']);
const bottmMargin = parseInt(parameters['bottmMargin']);
const windowHeight = parseInt(parameters['windowHeight']);
const maxLogCount = parseInt(parameters['maxLogCount']);
const fontSize = parseInt(parameters['fontSize']);
const logMargin = parseInt(parameters['logMargin']);

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
        console.log(message)
    }
}


class Window_BackLog extends Window_Base {
    protected _lineCount: number;
    protected _maxHeight: number;
    constructor() {
        super(0, 0, Graphics.width, windowHeight);
        this._margin = 0;
        this._windowFrameSprite.visible = false;
        this.backOpacity = 255;
        this.opacity = 255;
        this.contentsOpacity = 255;
        this._refreshBack();
        this.drawLogs();
    }
    drawLogs(): void {
        let y = 0;
        for (const log of $gameBackLog.logList) {
            y += this.drawLog(log, y);
            y += this.logMargin();
        }

        if (y > this.height) {
            this._maxHeight = this.height;
            // 一回目の描画ではみだしていたら、はみ出す部分をけずって歳描画
            const diff = y - this.height + bottmMargin;
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

            // 一番下までスクロールさせる
            this.y = Graphics.height - this.height;
        } else {
            this._maxHeight = y + bottmMargin;
            if (this._maxHeight < Graphics.height) {
                this._maxHeight = Graphics.height;
            }
            this.y = Graphics.height - this._maxHeight;
        }
    }
    drawLog(log: Game_TalkLog, y: number): number {
        this._lineCount = 1;
        this.drawTextEx(log.name, 5, y);
        this.drawTextEx(log.message, nameLength, y);
        const height = this._lineCount * (this.standardFontSize() + 8);
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


export const $gameBackLog = new Game_BackLog();

}
