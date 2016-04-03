//=============================================================================
// Saba_BattleTachie.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc 戦闘中に立ち絵を表示するプラグインです
 *
 * @param appearX
 * @desc アクターコマンド選択中の x 座標です
 * @default 400
 *
 * @param hiddenX
 * @desc アクターコマンド非選択中の x 座標です
 * @default 900
 *
 * @param speed
 * @desc 立ち絵が移動する時の速度です
 * @default 150
 * 
 * @help
 * Ver
 * 
 */
module Saba {
export module BattleTachie {

const parameters = PluginManager.parameters('Saba_BattleTachie');
const appearX = parseInt(parameters['appearX']);
const hiddenX = parseInt(parameters['hiddenX']);
const speed = parseInt(parameters['speed']);


var _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function () {
    this._tachieSprite = new TachieSprite();
    this._spriteset.addChild(this._tachieSprite);
    _Scene_Battle_createActorCommandWindow.call(this);
    this._tachieSprite.setActorCommandWindow(this._actorCommandWindow);
};

var _Scene_Battle_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function() {
    _Scene_Battle_create.call(this);
    for (let actor of $gameParty.battleMembers()) {
        actor.preloadTachie();
    }
}
    
class TachieSprite extends Sprite_Base {
    _commandWindow: Window_ActorCommand;
    hidden: boolean;
    hiddenX: number;
    appearedX: number;
    speed: number;
    actorId: number;
    constructor() {
        var bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        super();
        this.hiddenX = hiddenX;
        this.appearedX = appearX;
        this.speed = speed;
        this.bitmap = bitmap;
        this.x = this.hiddenX;
    }
    setActorCommandWindow(commandWindow: Window_ActorCommand): void {
        this._commandWindow = commandWindow;
    }
    update(): void {
        this.moveToTargetPosition();
        super.update();
        this.updateTachie();
    }
    updateTachie(): void {
        if (! this._commandWindow || ! this._commandWindow._actor) {
            return;
        }
        var id = this._commandWindow._actor.actorId();
        if (id != this.actorId) {
            if (this.x == this.hiddenX) {
                this.actorId = id;
                this.bitmap.clear();
                this.drawTachie(id, this.bitmap);
            } else if (this.x == this.appearedX) {
                this.hidden = true;
            }
        } else {
            if (! this._commandWindow || ! this._commandWindow.active) {
                this.hidden = true;
            } else {
                this.hidden = false;
            }
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