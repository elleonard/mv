//=============================================================================
// Saba_TachieFace.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc 顔グラに立ち絵の画像を表示するプラグインです。
 *
 * @param actor1offset
 * @desc アクター１のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor2offset
 * @desc アクター２のキャラの顔グラのx座標，y座標の補正値です
 * @default 0, 0
 * 
 * @help
 * Ver0.1
 *
 *
 */
module Saba {
module Tachie {

export const offsetX = {};
export const offsetY = {};

const parameters = PluginManager.parameters('Saba_TachieFace');

for (let i = 1; i <= 10; i++) {
    var offset1 = String(parameters['actor' + i + 'offset']).split(',');
    offsetX[i] = parseInt(offset1[0] || '0');
    offsetY[i] = parseInt(offset1[1] || '0');
    if (isNaN(offsetX[i])) {
        offsetX[i] = 0;
    }
    if (isNaN(offsetY[i])) {
        offsetY[i] = 0;
    }
}

const _Window_Base_drawActorFace = Window_Base.prototype.drawActorFace;
Window_Base.prototype.drawActorFace = function(actor, x, y, width, height) {
    _Window_Base_drawActorFace.call(this, actor, x, y, width, height);
};

const _Window_Base_drawFace = Window_Base.prototype.drawFace;
Window_Base.prototype.drawFace = function(faceName: string, faceIndex, x, y, width, height) {
    const reg = /tachie_Actor(\d+)/;
    var result = reg.exec(faceName);
    
    if (! result) {
        _Window_Base_drawFace.call(this, faceName, faceIndex, x, y, width, height);
        return;
    }
    const actorId = parseInt(result[1]);
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    this.drawTachie(actorId, this.contents, dx, dy, new Rectangle(offsetX[actorId], offsetY[actorId], width, height), 1)
};


}
}