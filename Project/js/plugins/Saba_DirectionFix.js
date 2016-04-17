//=============================================================================
// Saba_DirectionFix.js
//=============================================================================
/*:ja
 * @plugindesc イベントページの設定で「向き固定」にチェックを入れた場合、直前の向きに関わらず、イベントで指定した向きにします。
 * @author Sabakan
 *
 * @help
 * デフォルトでは、イベントページの１枚目と２枚目のキャラの向きが同じ場合、
 * イベントページ１枚目で向きを変えてからイベントページ２枚目になっても、
 * イベントページ１枚目の向きがそのまま使われます。
 * しかし、イベントページ２枚目が倒れている時のグラなどで、
 * 必ず下向きにしたい場合、この機能が邪魔になります。
 * このプラグインでは、「向き固定」にチェックを入れた場合は、
 * 必ずイベントで指定した向きになるようにします。
 *
 *
 * プラグインコマンドはありません。
 */
var Saba;
(function (Saba) {
    var Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function () {
        var page = this.page();
        var image = page.image;
        if (page.directionFix) {
            this._originalDirection = image.direction;
            this._prelockDirection = 0;
            this.setDirectionFix(false);
            this.setDirection(image.direction);
        }
        Game_Event_setupPageSettings.call(this);
    };
})(Saba || (Saba = {}));
