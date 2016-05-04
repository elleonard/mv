//=============================================================================
// Saba_EventPosition.js
//=============================================================================
/*:ja
 * @plugindesc イベントの座標を1ピクセル単位で調整します。
 * 張り紙の座標とか、テーブルの上のアイテム座標を調整したいときにどうぞ。
 * @author Sabakan
 *
 * @help
 * イベントのメモ欄に、
 * <position_x:10>
 * と書くと、イベントの位置が10ピクセル右にずれます。
 *
 * <position_y:10>
 * と書くと、イベントの位置が10ピクセル下にずれます。
 *
 * プラグインコマンドはありません。
 *
 * @license
 * Saba_EventPosition licensed under the MIT License.
 */
var Saba;
(function (Saba) {
    var _Game_Event_screenX = Game_Event.prototype.screenX;
    Game_Event.prototype.screenX = function () {
        var x = _Game_Event_screenX.call(this);
        var e = this.event();
        if (e && e.meta['position_x']) {
            x += parseInt(e.meta['position_x']);
        }
        return x;
    };
    var _Game_Event_screenY = Game_Event.prototype.screenY;
    Game_Event.prototype.screenY = function () {
        var y = _Game_Event_screenY.call(this);
        var e = this.event();
        if (e && e.meta['position_y']) {
            y += parseInt(e.meta['position_y']);
        }
        return y;
    };
})(Saba || (Saba = {}));
