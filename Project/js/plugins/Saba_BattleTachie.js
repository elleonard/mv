var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
 * Ver 2016-03-30 21:24:31
 *
 * テキストのバックログを表示するプラグインです。
 * 立ち絵スクリプトとの併用を想定しています。
 * 併用しない場合、独自に
 * $gameBackLog.addLog(name, message);
 * を呼ぶ必要があります。
 *
 */
var Saba;
(function (Saba) {
    var BattleTachie;
    (function (BattleTachie) {
        var _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
        Scene_Battle.prototype.createActorCommandWindow = function () {
            this._tachieSprite = new TachieSprite();
            this._spriteset.addChild(this._tachieSprite);
            _Scene_Battle_createActorCommandWindow.call(this);
            this._tachieSprite.setActorCommandWindow(this._actorCommandWindow);
        };
        var TachieSprite = (function (_super) {
            __extends(TachieSprite, _super);
            function TachieSprite() {
                var bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
                _super.call(this);
                this.hiddenX = 960;
                this.appearedX = 620;
                this.speed = 150;
                this.bitmap = bitmap;
                this.x = this.hiddenX;
            }
            TachieSprite.prototype.setActorCommandWindow = function (commandWindow) {
                this._commandWindow = commandWindow;
            };
            TachieSprite.prototype.update = function () {
                _super.prototype.update.call(this);
                this.updateTachie();
                this.updateTargetPosition();
                this.moveToTargetPosition();
            };
            TachieSprite.prototype.updateTachie = function () {
                if (!this._commandWindow || !this._commandWindow._actor) {
                    return;
                }
                var id = this._commandWindow._actor.actorId();
                if (id != this.actorId && this.x == this.hiddenX) {
                    this.actorId = id;
                    this.bitmap.clear();
                    this.drawTachie(id, this.bitmap);
                }
            };
            TachieSprite.prototype.updateTargetPosition = function () {
                if (!this._commandWindow || !this._commandWindow.active) {
                    this.hidden = true;
                }
                else {
                    this.hidden = false;
                }
            };
            TachieSprite.prototype.moveToTargetPosition = function () {
                if (this.hidden) {
                    if (Math.abs(this.hiddenX - this.x) < this.speed) {
                        this.x = this.hiddenX;
                    }
                    else if (this.hiddenX > this.x) {
                        this.x += this.speed;
                    }
                    else {
                        this.x -= this.speed;
                    }
                }
                else {
                    if (Math.abs(this.appearedX - this.x) < this.speed) {
                        this.x = this.appearedX;
                    }
                    else if (this.appearedX > this.x) {
                        this.x += this.speed;
                    }
                    else {
                        this.x -= this.speed;
                    }
                }
            };
            return TachieSprite;
        }(Sprite_Base));
    })(BattleTachie = Saba.BattleTachie || (Saba.BattleTachie = {}));
})(Saba || (Saba = {}));
