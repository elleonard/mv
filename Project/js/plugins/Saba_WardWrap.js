//=============================================================================
// Saba_WardWrap.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc YED_WordWrap を使った時、句読点が先頭にこないようにするプラグインです
 *
 *
 * @param charList
 * @desc 先頭に来ないようにする文字リストです
 * @default 。、」
 *
 * @help
 * Ver0.1
 *
 * YED_WordWrap と併用してください
 */
var Saba;
(function (Saba) {
    var WardWrap;
    (function (WardWrap) {
        if (!YED || !YED.WordWrap) {
            console.error('YED_WordWrap と併用してください');
        }
        var parameters = PluginManager.parameters('Saba_WardWrap');
        var notWrapCharList = parameters['charList'];
        var _Window_Base_needWrap = Window_Base.prototype.needWrap;
        Window_Base.prototype.needWrap = function (textState) {
            var text = textState.text;
            var c = text.substr(textState.index, 1);
            if (notWrapCharList.indexOf(c) >= 0) {
                return false;
            }
            return _Window_Base_needWrap.call(this, textState);
        };
    })(WardWrap = Saba.WardWrap || (Saba.WardWrap = {}));
})(Saba || (Saba = {}));
