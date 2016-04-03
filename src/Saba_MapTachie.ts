//=============================================================================
// Saba_MapTachie.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc マップ画面でも立ち絵を表示するプラグインです
 *
 *
 * @param tachieY
 * @desc 立ち絵を表示する時の y 座標です
 * @default 0
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
 * @param changeTachieButton
 * @desc 立ち絵切り替えボタンです
 * @default pagedown
 *
 * @param se
 * @desc 立ち絵切り替え時のSEです。ファイル名、ボリューム、ピッチの順です
 * @default Jump1 80 100
 *
 * @param skipActorList
 * @desc マップで立ち絵を表示しないアクターIDのリストです。空白区切り(2 3 4……など)
 * @default 
 * 
 * @help
 * Ver
 *
 * Saba_Tachie と併用してください
 */
module Saba {
export module MapTachie {

const parameters = PluginManager.parameters('Saba_MapTachie');
const tachieY = parseInt(parameters['tachieY']);
const appearX = parseInt(parameters['appearX']);
const hiddenX = parseInt(parameters['hiddenX']);
const speed = parseInt(parameters['speed']);

const changeTachieButton = parameters['changeTachieButton'];
const seList = parameters['se'].split(' ');
var seFile: MV.AudioParameters = {name: seList[0], pan: 0, volume: parseInt(seList[1]), pitch: parseInt(seList[2]), pos: 0};
const skipActorList = Saba.toIntArray(parameters['skipActorList'].split(' '));

var _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function() {
    _Spriteset_Map_createUpperLayer.call(this);
    this._tachieSprite = new TachieSprite();
    this.addChild(this._tachieSprite);
};

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
        this.y = tachieY;
        if ($gameTemp.tahieMapLastPosX !== undefined) {
            this.redraw();
            this.x = $gameTemp.tahieMapLastPosX;
            if (this.x == this.appearedX) {
                this.hidden = false;
            }
        }
    }
    setActorCommandWindow(commandWindow: Window_ActorCommand): void {
        this._commandWindow = commandWindow;
    }
    update(): void {
        this.updateInput();
        this.moveToTargetPosition();
        super.update();
        this.updateTachie();
    }
    updateInput(): void {
        if (Input.isTriggered(changeTachieButton)) {
            AudioManager.playSe(seFile);
            $gameSystem.mapTachieActorIndex++;
            while (true) {
                if ($gameParty.battleMembers().length <= $gameSystem.mapTachieActorIndex) {
                    $gameSystem.mapTachieActorIndex = -1;
                    break;
                }
                var actor = $gameParty.battleMembers()[$gameSystem.mapTachieActorIndex];
                if (skipActorList.indexOf(actor.actorId()) >= 0) {
                    $gameSystem.mapTachieActorIndex++;
                } else {
                    break;
                }
            }
            
        }
    }
    updateTachie(): void {
        if ($gameSystem.mapTachieActorIndex === undefined) {
            $gameSystem.mapTachieActorIndex = 0;
        }
        var index = $gameSystem.mapTachieActorIndex;
        var actor = $gameParty.battleMembers()[index];
        if (! actor) {
            this.hidden = true;
            return;
        }
        if ($gameTemp.tachieAvairable) {
            // 立ち絵つき会話が始まっている
            this.hidden = true;
            return;
        }
        var id = actor.actorId();
        if (id != this.actorId) {
            if (this.x == this.hiddenX) {
                this.redraw();
            } else if (this.x == this.appearedX) {
                this.hidden = true;
            }
        } else {
            this.hidden = false;
        }
    }
    redraw(): void {
        var index = $gameSystem.mapTachieActorIndex;
        var actor = $gameParty.battleMembers()[index];
        if (! actor) {
            this.hidden = true;
            return;
        }
        var id = actor.actorId();
        this.actorId = id;
        this.bitmap.clear();
        this.drawTachie(id, this.bitmap);
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
        $gameTemp.tahieMapLastPosX = this.x;
    }
}

}}

interface Game_System {
    mapTachieActorIndex: number;
}
interface Game_Temp {
    tahieMapLastPosX: number;
}
