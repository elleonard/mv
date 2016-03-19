var Sample;
(function (Sample) {
    var Window_Status_drawBlock4 = Window_Status.prototype.drawBlock4;
    Window_Status.prototype.drawBlock4 = function (y) {
        Window_Status_drawBlock4.call(this);
        this.drawTachie(this._actor.actorId(), this.contents, 320, 40, new Rectangle(-30, -50, 460, 800), 2);
    };
    Window_Status.prototype.drawExpInfo = function (x, y) {
    };
    Window_Status.prototype.drawEquipments = function (x, y) {
    };
})(Sample || (Sample = {}));
