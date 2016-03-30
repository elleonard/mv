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
export module BattleTachie {

const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    this._tachieSprite = new TachieSprite();
    this._spriteset.addChild(this._tachieSprite);
    _Scene_Battle_createActorCommandWindow.call(this);
    this._tachieSprite.setActorCommandWindow(this._actorCommandWindow);
};

class TachieSprite extends Sprite_Base {
    _commandWindow: Window_ActorCommand;
    hidden: boolean;
    hiddenX: number;
    appearedX: number;
    speed: number;
    actorId: number;
    constructor() {
        var bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight)
        super();
        this.hiddenX = 960;
        this.appearedX = 620;
        this.speed = 150;
        this.bitmap = bitmap;
        this.x = this.hiddenX;
    }
    setActorCommandWindow(commandWindow: Window_ActorCommand): void {
        this._commandWindow = commandWindow;
    }
    update(): void {
        super.update();
        this.updateTachie();
        this.updateTargetPosition();
        this.moveToTargetPosition();
    }
    updateTachie(): void {
        if (! this._commandWindow || ! this._commandWindow._actor) {
            return;
        }
        var id = this._commandWindow._actor.actorId();
        if (id != this.actorId && this.x == this.hiddenX) {
            this.actorId = id;
            this.bitmap.clear();
            this.drawTachie(id, this.bitmap);
        }
    }
    updateTargetPosition(): void {
        if (! this._commandWindow || ! this._commandWindow.active) {
            this.hidden = true;
        } else {
            this.hidden = false;
        }
    }
    moveToTargetPosition(): void {
        if (this.hidden) {
            if (Math.abs(this.hiddenX - this.x) < this.speed) {
                this.x = this.hiddenX;
            } else if (this.hiddenX > this.x) {
                this.x += this.speed;
            } else {
                this.x -= this.speed;
            }
        } else {
            if (Math.abs(this.appearedX - this.x) < this.speed) {
                this.x = this.appearedX;
            } else if (this.appearedX > this.x) {
                this.x += this.speed;
            } else {
                this.x -= this.speed;
            }
        }
    }
} 

}}