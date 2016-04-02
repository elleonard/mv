var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//=============================================================================
// Saba_BattleTachie.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc 戦闘中に立ち絵を表示するプラグインです
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
 * @help
 * Ver 2016-04-02 23:18:37
 *
 */
var Saba;
(function (Saba) {
    var BattleTachie;
    (function (BattleTachie) {
        var parameters = PluginManager.parameters('Saba_BattleTachie');
        var appearX = parseInt(parameters['appearX']);
        var hiddenX = parseInt(parameters['hiddenX']);
        var speed = parseInt(parameters['speed']);
        var _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
        Scene_Battle.prototype.createActorCommandWindow = function () {
            this._tachieSprite = new TachieSprite();
            this._spriteset.addChild(this._tachieSprite);
            _Scene_Battle_createActorCommandWindow.call(this);
            this._tachieSprite.setActorCommandWindow(this._actorCommandWindow);
        };
        var TachieSprite = (function (_super) {
            __extends(TachieSprite, _super);
            function TachieSprite() {
                var bitmap = new Bitmap(800, 960);
                _super.call(this);
                this.hiddenX = hiddenX;
                this.appearedX = appearX;
                this.speed = speed;
                this.bitmap = bitmap;
                this.x = this.hiddenX;
            }
            TachieSprite.prototype.setActorCommandWindow = function (commandWindow) {
                this._commandWindow = commandWindow;
            };
            TachieSprite.prototype.update = function () {
                this.moveToTargetPosition();
                _super.prototype.update.call(this);
                this.updateTachie();
            };
            TachieSprite.prototype.updateTachie = function () {
                if (!this._commandWindow || !this._commandWindow._actor) {
                    return;
                }
                var id = this._commandWindow._actor.actorId();
                if (id != this.actorId) {
                    if (this.x == this.hiddenX) {
                        this.actorId = id;
                        this.bitmap.clear();
                        this.drawTachie(id, this.bitmap);
                    }
                    else if (this.x == this.appearedX) {
                        this.hidden = true;
                    }
                }
                else {
                    if (!this._commandWindow || !this._commandWindow.active) {
                        this.hidden = true;
                    }
                    else {
                        this.hidden = false;
                    }
                }
            };
            TachieSprite.prototype.moveToTargetPosition = function () {
                if (this.hidden) {
                    if (Math.abs(this.hiddenX - this.x) < this.speed) {
                        this.x = this.hiddenX;
                    }
                    else if (this.hiddenX > this.x) {
                        this.x += this.speed;
                    }
                    else {
                        this.x -= this.speed;
                    }
                }
                else {
                    if (Math.abs(this.appearedX - this.x) < this.speed) {
                        this.x = this.appearedX;
                    }
                    else if (this.appearedX > this.x) {
                        this.x += this.speed;
                    }
                    else {
                        this.x -= this.speed;
                    }
                }
            };
            return TachieSprite;
        }(Sprite_Base));
    })(BattleTachie = Saba.BattleTachie || (Saba.BattleTachie = {}));
})(Saba || (Saba = {}));
