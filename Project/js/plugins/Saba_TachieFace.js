var Saba;
(function (Saba) {
    Saba.applyMyMethods = function (myClass, presetClass, applyConstructor) {
        for (var p in myClass.prototype) {
            if (myClass.prototype.hasOwnProperty(p)) {
                if (p === 'constructor' && !applyConstructor) {
                    continue;
                }
                Object.defineProperty(presetClass.prototype, p, Object.getOwnPropertyDescriptor(myClass.prototype, p));
            }
        }
    };
})(Saba || (Saba = {}));

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
 * @help
 * Ver 2016-03-30 21:57:42
 *
 *
 */
var Saba;
(function (Saba) {
    var Tachie;
    (function (Tachie) {
        Tachie.offsetX = {};
        Tachie.offsetY = {};
        var parameters = PluginManager.parameters('Saba_TachieFace');
        for (var i = 1; i <= 10; i++) {
            var offset1 = String(parameters['actor' + i + 'offset']).split(',');
            Tachie.offsetX[i] = parseInt(offset1[0] || '0');
            Tachie.offsetY[i] = parseInt(offset1[1] || '0');
            if (isNaN(Tachie.offsetX[i])) {
                Tachie.offsetX[i] = 0;
            }
            if (isNaN(Tachie.offsetY[i])) {
                Tachie.offsetY[i] = 0;
            }
        }
        var _Window_Base_drawActorFace = Window_Base.prototype.drawActorFace;
        Window_Base.prototype.drawActorFace = function (actor, x, y, width, height) {
            _Window_Base_drawActorFace.call(this, actor, x, y, width, height);
        };
        var _Window_Base_drawFace = Window_Base.prototype.drawFace;
        Window_Base.prototype.drawFace = function (faceName, faceIndex, x, y, width, height) {
            var reg = /tachie_Actor(\d+)/;
            var result = reg.exec(faceName);
            if (!result) {
                _Window_Base_drawFace.call(this, faceName, faceIndex, x, y, width, height);
                return;
            }
            var actorId = parseInt(result[1]);
            width = width || Window_Base._faceWidth;
            height = height || Window_Base._faceHeight;
            var pw = Window_Base._faceWidth;
            var ph = Window_Base._faceHeight;
            var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
            var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
            this.drawTachie(actorId, this.contents, dx, dy, new Rectangle(Tachie.offsetX[actorId], Tachie.offsetY[actorId], width, height), 1);
        };
    })(Tachie || (Tachie = {}));
})(Saba || (Saba = {}));
