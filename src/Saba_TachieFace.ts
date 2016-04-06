//=============================================================================
// Saba_TachieFace.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc 顔グラに立ち絵の画像を表示するプラグインです。
 *
 * @param faceScale
 * @desc 顔グラとして立ち絵を描画する時の拡大率(%)です
 * @default 100
 *
 * @param disableTachieFaceIdList
 * @desc 通常の顔グラを表示するアクターのリストです。空白区切り(2 3 4……など)
 * @default 
 *
 * @param actorFaceSize
 * @desc 立ち絵の顔グラを表示する時のデフォルトサイズです。幅、高さの順です
 * @default 144, 144
 * 
 * @param actor1offset
 * @desc アクター１のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor2offset
 * @desc アクター２のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor3offset
 * @desc アクター３のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor4offset
 * @desc アクター４のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor5offset
 * @desc アクター５のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor6offset
 * @desc アクター６のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor7offset
 * @desc アクター７のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor8offset
 * @desc アクター８のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor9offset
 * @desc アクター９のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor10offset
 * @desc アクター１０のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * 
 * @param showTachieActorFace
 * @desc 立ち絵を表示中も顔グラを表示する場合 true にします
 * @default false
 *
 * @param tachieActorFacePos
 * @desc 立ち絵の顔グラを表示する時の座標です。x、yの順です
 * @default 0, 0
 * 
 * @help
 * Ver
 *
 *
 */
module Saba {
export module Tachie {

export const faceOffsetX = {};
export const faceOffsetY = {};

const parameters = PluginManager.parameters('Saba_TachieFace');
const disableTachieFaceIdList = Saba.toIntArray(parameters['disableTachieFaceIdList'].split(' '));
export const showTachieActorFace = parameters['showTachieActorFace'] === 'true';
export const actorFaceSize = Saba.toIntArray(parameters['actorFaceSize'].split(','));
export const tachieActorFacePos = Saba.toIntArray(parameters['tachieActorFacePos'].split(','));

for (let i = 1; i <= 10; i++) {
    var offset1 = String(parameters['actor' + i + 'offset']).split(',');
    faceOffsetX[i] = parseInt(offset1[0] || '0');
    faceOffsetY[i] = parseInt(offset1[1] || '0');
    if (isNaN(faceOffsetX[i])) {
        faceOffsetX[i] = 0;
    }
    if (isNaN(faceOffsetY[i])) {
        faceOffsetY[i] = 0;
    }
}

const faceScale = parseInt(parameters['faceScale']);

var _Scene_MenuBase_prototype_create = Scene_MenuBase.prototype.create;
Scene_MenuBase.prototype.create = function() {
    _Scene_MenuBase_prototype_create.call(this);
    for (let actor of $gameParty.members()) {
        actor.preloadTachie();
    }
}

const _Window_Base_drawActorFace = Window_Base.prototype.drawActorFace;
Window_Base.prototype.drawActorFace = function(actor, x, y, width?, height?, offsetX = 0, offsetY = 0, faceId = 1) {
    if (disableTachieFaceIdList.indexOf(actor.actorId()) >= 0) {
        _Window_Base_drawActorFace.call(this, actor, x, y, width, height);
        return;
    }
    var imageAvailable = PIXI.TextureCache[actor.bodyBackFile() + '.png'] || ImageManager.loadTachie(actor.bodyBackFile()).isReady();
    if (! imageAvailable) {
        _Window_Base_drawActorFace.call(this, actor, x, y, width, height);
        return true;
    }
    const actorId = actor.actorId();
    width = width || actorFaceSize[0];
    height = height || actorFaceSize[1];
    var rect = new Rectangle(faceOffsetX[actorId] + offsetX, faceOffsetY[actorId] + offsetY, width, height);
    var dx = x + tachieActorFacePos[0];
    var dy = y + tachieActorFacePos[1];
    console.log(width, height)
    return this.drawTachie(actorId, this.contents, dx, dy, rect, faceId, faceScale / 100.0);
};


}}

interface Window_Base {
    drawActorFace(actor: Game_Actor, x: number, y: number, width?: number, height?: number, offsetX?: number, offsetY?: number, faceId?: number): void;
}