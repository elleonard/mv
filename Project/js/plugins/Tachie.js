var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tachie;
(function (Tachie) {
    var DEFAULT_PICTURE_ID1 = 12;
    var DEFAULT_PICTURE_ID2 = 11;
    var ACTOR_PREFIX = '___actor';
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    var _Game_Picture_initTarget = Game_Picture.prototype.initTarget;
    var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    var _Game_Interpreter = (function (_super) {
        __extends(_Game_Interpreter, _super);
        function _Game_Interpreter() {
            _super.apply(this, arguments);
        }
        _Game_Interpreter.prototype.pluginCommand = function (command, args) {
            _Game_Interpreter_pluginCommand.call(this, command, args);
            if (command === 'Tachie' || command === '立ち絵') {
                var x = parseInt(args[2] || '0');
                var y = parseInt(args[3] || '0');
                var opacity = parseInt(args[4] || '255');
                switch (args[0]) {
                    case 'show_left':
                        $gameScreen.showPicture(DEFAULT_PICTURE_ID1, ACTOR_PREFIX + args[1], 0, x, y, 100, 100, opacity, 0);
                        break;
                    case 'show_right':
                        $gameScreen.showPicture(DEFAULT_PICTURE_ID2, ACTOR_PREFIX + args[1], 0, x, y, 100, 100, opacity, 0);
                        break;
                }
            }
        };
        return _Game_Interpreter;
    }(Game_Interpreter));
    var _Game_Picture = (function (_super) {
        __extends(_Game_Picture, _super);
        function _Game_Picture() {
            _super.apply(this, arguments);
        }
        _Game_Picture.prototype.initTarget = function () {
            _Game_Picture_initTarget.call(this);
            this.tachieActorId = this.getTachieActorId();
        };
        _Game_Picture.prototype.getTachieActorId = function () {
            var matcher = /^___actor([-+]?\d+)/;
            var result = matcher.exec(this._name);
            if (result && result.length > 1) {
                return parseInt(result[1]) || 0;
            }
            else {
                return 0;
            }
        };
        return _Game_Picture;
    }(Game_Picture));
    var _Game_Temp = (function (_super) {
        __extends(_Game_Temp, _super);
        function _Game_Temp() {
            _super.apply(this, arguments);
        }
        _Game_Temp.prototype.getActorBitmapCache = function (actorId) {
            this.actorBitmapCache = this.actorBitmapCache || {};
            if (!this.actorBitmapCache[actorId]) {
                this.actorBitmapCache[actorId] = new Bitmap(Graphics.width / 2 + 100, Graphics.height);
            }
            return this.actorBitmapCache[actorId];
        };
        return _Game_Temp;
    }(Game_Temp));
    var _Game_Screen = (function (_super) {
        __extends(_Game_Screen, _super);
        function _Game_Screen() {
            _super.apply(this, arguments);
        }
        _Game_Screen.prototype.showActorPicture = function (actorId, pictureId, x, y) {
            var name = ACTOR_PREFIX + actorId;
            this.showPicture(pictureId, name, 0, x, y, 1, 1, 1, 0);
        };
        return _Game_Screen;
    }(Game_Screen));
    var _Sprite_Picture = (function (_super) {
        __extends(_Sprite_Picture, _super);
        function _Sprite_Picture() {
            _super.apply(this, arguments);
        }
        _Sprite_Picture.prototype.updateBitmap = function () {
            _Sprite_Picture_updateBitmap.call(this);
            var picture = this.picture();
            if (picture && picture.tachieRefreshFlag) {
                picture.tachieRefreshFlag = false;
                this.redrawActorImage();
            }
        };
        _Sprite_Picture.prototype.loadBitmap = function () {
            var picture = this.picture();
            if (picture && picture.tachieActorId !== 0) {
                this.bitmap = $gameTemp.getActorBitmapCache(picture.tachieActorId);
                this.redrawActorImage();
            }
            else {
                _Sprite_Picture_loadBitmap.call(this);
            }
        };
        _Sprite_Picture.prototype.redrawActorImage = function () {
            var picture = this.picture();
            if (!picture) {
                return;
            }
            var actorId = picture.tachieActorId;
            if (actorId === 0) {
                return;
            }
            this.bitmap.clear();
            var actor = $gameActors.actor(actorId);
            var cache = $gameTemp.getActorBitmapCache(actorId);
            this.drawActorImage(actor, cache);
        };
        _Sprite_Picture.prototype.drawActorImage = function (actor, bitmap) {
            var img = ImageManager.loadPicture('actor' + actor.actorId());
            if (img.isReady()) {
                bitmap.blt(img, 0, 0, img.width, img.height, 0, 0);
                this.picture().tachieRefreshFlag = false;
            }
            else {
                this.picture().tachieRefreshFlag = true;
            }
        };
        return _Sprite_Picture;
    }(Sprite_Picture));
    var applyMyMethods = function (myClass, presetClass, applyConstructor) {
        for (var p in myClass.prototype) {
            if (myClass.prototype.hasOwnProperty(p)) {
                if (p === 'constructor' && !applyConstructor) {
                    continue;
                }
                presetClass.prototype[p] = myClass.prototype[p];
            }
        }
    };
    applyMyMethods(_Game_Interpreter, Game_Interpreter);
    applyMyMethods(_Sprite_Picture, Sprite_Picture);
    applyMyMethods(_Game_Screen, Game_Screen);
    applyMyMethods(_Game_Picture, Game_Picture);
    applyMyMethods(_Game_Temp, Game_Temp);
})(Tachie || (Tachie = {}));
