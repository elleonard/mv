//=============================================================================
// Saba_SortOrder.js
//=============================================================================
/*:ja
 * @plugindesc アイテム、武器防具、スキルの並び順をメモ欄で指定できるようになります。
 * @author Sabakan
 *
 * @help
 * Ver
 * アイテム、武器防具、スキル（以下ひっくるめてアイテム）のメモ欄に、
 * <order:10>
 * と書くと、並び順がID10のアイテム相当になります。
 * 同じ並びのアイテムが存在する場合、元のIDの若い方が先に表示されます。
 *
 * プラグインコマンドはありません。
 *
 * @license
 * Saba_EventPosition licensed under the MIT License.
 */
module Saba {
module SortOrder {

const SORT_ID_WEIGHT = 10000;

const _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
Window_ItemList.prototype.makeItemList = function() {
    _Window_ItemList_makeItemList.call(this);
    this.data = this._data.sort(sortFunction);
};

const _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
Window_SkillList.prototype.makeItemList = function() {
    _Window_SkillList_makeItemList.call(this);
    this.data = this._data.sort(sortFunction);
};

function sortFunction(a, b) {
    if (! a) {
        return 1;
    }
    if (! b) {
        return -1;
    }
    let aId = a.id;
    let aValue = 0;
    var order =  parseInt(a.meta.order);
    if (isNaN(order)) {
        aValue = aId * SORT_ID_WEIGHT;
    } else {
        aValue = order * SORT_ID_WEIGHT;
        aValue += aId;
    }
    
    let bId = b.id;
    let bValue = 0;
    order =  parseInt(b.meta.order);
    if (isNaN(order)) {
        bValue = bId * SORT_ID_WEIGHT;
    } else {
        bValue = order * SORT_ID_WEIGHT;
        bValue += bId;
    }
    return aValue - bValue;
}


}}