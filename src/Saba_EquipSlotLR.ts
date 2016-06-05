//=============================================================================
// Saba_EquipSlotLR.js
//=============================================================================
/*:ja
 * @plugindesc 装備スロットウィンドウを選択状態の時、LRでアクターを変更できます。
 * @author Sabakan
 *
 * @help
 * Ver
 *
 * プラグインコマンドはありません。
 *
 * @license
 * Saba_EventPosition licensed under the MIT License.
 */
module Saba {
module Equip {
    
const _Scene_Equip_createSlotWindow = Scene_Equip.prototype.createSlotWindow;
Scene_Equip.prototype.createSlotWindow = function() {
    _Scene_Equip_createSlotWindow.call(this);
    
    this._slotWindow.setHandler('pagedown', this.nextActorSlot.bind(this));
    this._slotWindow.setHandler('pageup',   this.previousActorSlot.bind(this));
};

Scene_Equip.prototype.nextActorSlot = function() {
    this.nextActor();
    this._commandWindow.deactivate();
    this._slotWindow.activate();
};

Scene_Equip.prototype.previousActorSlot = function() {
    this.previousActor();
    this._commandWindow.deactivate();
    this._slotWindow.activate();
};


}
}