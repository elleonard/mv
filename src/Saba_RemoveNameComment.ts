//=============================================================================
// Saba_RemoveNameComment.js
//=============================================================================
/*:ja
 * @plugindesc 実行時に、スキル名やステート名の(以降の文字列を削除します
 * @author Sabakan
 *
 * @help
 * Ver
 *
 * 例えばスキル名に
 * 　ヒール(敵用)
 * とつけた場合、ゲーム中では
 * 　ヒール
 * となり、カッコ以降がなくなります。
 *
 * プラグインコマンドはありません。
 */
module Saba {
module RemoveNameComment {
    
var re = /[(（]/;

var _DataManager_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function(data) {
    _DataManager_extractMetadata.call(this, data);
    if (! data.name) {
        return;
    }
    var match = re.exec(data.name);
    if (match) {
        data.name = data.name.substr(0, match.index);
    }
}

}}