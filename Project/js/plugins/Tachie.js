var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//=============================================================================
// Tachie.js
//=============================================================================
/*:ja
 * @author Sabakan
 *
 * @param useTextureAtlas
 * @desc バラバラの画像でなく、一枚のアトラス画像を使うか？
 * @default false
 *
 * @param actor1offset
 * @desc バラバラの画像でなく、一枚のアトラス画像を使うか？
 * @default 0, 0
 *
 * @help
 * Ver0.1
 */
var Tachie;
(function (Tachie) {
    var parameters = PluginManager.parameters('Tachie');
    var offsetX = {};
    var offsetY = {};
    for (var i = 1; i < 10; i++) {
        var offset1 = String(parameters['actor' + i + 'offset']).split(',');
        offsetX[i] = parseInt(offset1[0] || '0');
        offsetY[i] = parseInt(offset1[1] || '0');
        if (isNaN(offsetX[i])) {
            offsetX[i] = 0;
        }
        if (isNaN(offsetY[i])) {
            offsetY[i] = 0;
        }
    }
    var useTextureAtlas = parameters['useTextureAtlas'] === 'true';
    var DEFAULT_PICTURE_ID1 = 12;
    var DEFAULT_PICTURE_ID2 = 11;
    var ACTOR_PREFIX = '___actor';
    var LEFT_POS = 1;
    var RIGHT_POS = 2;
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    var _Game_Picture_initTarget = Game_Picture.prototype.initTarget;
    var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    var _Game_Interpreter = (function (_super) {
        __extends(_Game_Interpreter, _super);
        function _Game_Interpreter() {
            _super.apply(this, arguments);
        }
        _Game_Interpreter.prototype.pluginCommand = function (command, args) {
            _Game_Interpreter_pluginCommand.call(this, command, args);
            if (command !== 'Tachie' && command !== '立ち絵') {
                return;
            }
            switch (args[0]) {
                case 'showName':
                    $gameTemp.tachieName = args[1];
                    break;
                case 'showHide':
                    $gameTemp.tachieName = null;
                    break;
                case 'showLeft':
                case 'showRight':
                    var pictureId = parseInt(args[1]);
                    var x = parseInt(args[2] || '0');
                    var y = parseInt(args[3] || '0');
                    var opacity = parseInt(args[4] || '255');
                    this.tachiePictureCommnad(args[0], pictureId, x, y, opacity);
                    break;
                case 'face':
                case 'pose':
                case 'hoppe':
                case 'bote':
                case 'outer':
                case 'innerTop':
                case 'innerBottom':
                    var actor = $gameActors.actor(parseInt(args[1]));
                    if (args[2] == null) {
                        throw new Error('立ち絵コマンド: ' + args[0] + ' の第二引数が存在しません');
                    }
                    this.tachieActorCommnad(actor, args[0], args[2]);
                    break;
                case 'start':
                    break;
                default:
                    console.error(args[0]);
            }
        };
        _Game_Interpreter.prototype.tachiePictureCommnad = function (command, pictureId, x, y, opacity) {
            switch (command) {
                case 'showLeft':
                    $gameTemp.tachieActorId = pictureId;
                    $gameTemp.tachieActorPos = LEFT_POS;
                    $gameScreen.showPicture(DEFAULT_PICTURE_ID1, ACTOR_PREFIX + pictureId, 0, x, y, 100, 100, opacity, 0);
                    break;
                case 'showRight':
                    $gameTemp.tachieActorId = pictureId;
                    $gameTemp.tachieActorPos = RIGHT_POS;
                    $gameScreen.showPicture(DEFAULT_PICTURE_ID2, ACTOR_PREFIX + pictureId, 0, x + 400, y, 100, 100, opacity, 0);
                    break;
            }
        };
        _Game_Interpreter.prototype.tachieActorCommnad = function (actor, command, arg2) {
            switch (command) {
                case 'face':
                    actor.setFaceId(parseInt(arg2));
                    break;
                case 'pose':
                    actor.setPoseId(parseInt(arg2));
                    break;
                case 'hoppe':
                    actor.setHoppeId(parseInt(arg2));
                    break;
                case 'outer':
                    this.validateCosId(arg2);
                    actor.setOuterId(arg2);
                    break;
                case 'innerTop':
                    this.validateCosId(arg2);
                    actor.setInnerTopId(arg2);
                    break;
                case 'innerBottom':
                    this.validateCosId(arg2);
                    actor.setInnerBottomId(arg2);
                    break;
                case 'outerItem':
                    var outerId = parseInt(arg2);
                    if (outerId === 0) {
                        actor.setOuterItemId(0);
                        break;
                    }
                    var outer = new Game_Item($dataArmors[outerId]);
                    if (!outer.isOuter()) {
                        throw new Error('Armor ID ' + outerId + 'はアウターではありません' + JSON.stringify($dataArmors[outerId].meta));
                    }
                    actor.setOuterItemId(outerId);
                    break;
                case 'innerTopItem':
                    var innerTopId = arg2;
                    var innerTop = new Game_Item($dataArmors[innerTopId]);
                    if (!innerTop.isInnerTop()) {
                        throw new Error('Armor ID ' + innerTopId + 'はインナートップではありません' + JSON.stringify($dataArmors[innerTopId].meta));
                    }
                    actor.setInnerTopItemId(innerTopId);
                    break;
                case 'innerBottomItem':
                    var innerBottomId = arg2;
                    var innerBottom = new Game_Item($dataArmors[innerBottomId]);
                    if (!innerBottom.isInnerBottom()) {
                        throw new Error('Armor ID ' + innerBottomId + 'はインナーボトムではありません' + JSON.stringify($dataArmors[innerBottomId].meta));
                    }
                    actor.setInnerBottomItemId(innerBottomId);
                    break;
            }
        };
        _Game_Interpreter.prototype.validateCosId = function (id) {
            var re = /[a-z]/;
            if (!re.exec(id)) {
                throw new Error('コスチュームIDが不正です:' + id);
            }
        };
        return _Game_Interpreter;
    }(Game_Interpreter));
    ImageManager.loadTachie = function (filename, hue) {
        if (filename == null || filename == 'undefined') {
            throw new Error();
        }
        return this.loadBitmap('img/tachie/', filename, hue, true);
    };
    var _Game_Item = (function (_super) {
        __extends(_Game_Item, _super);
        function _Game_Item() {
            _super.apply(this, arguments);
        }
        _Game_Item.prototype.isOuter = function () {
            return this.outerId() != null;
        };
        _Game_Item.prototype.isInnerTop = function () {
            return this.innerTopId() != null;
        };
        _Game_Item.prototype.isInnerBottom = function () {
            return this.innerBottomId() != null;
        };
        _Game_Item.prototype.outerId = function () {
            return this.object().meta['outer'];
        };
        _Game_Item.prototype.innerTopId = function () {
            return this.object().meta['innerTop'];
        };
        _Game_Item.prototype.innerBottomId = function () {
            return this.object().meta['innerBottom'];
        };
        return _Game_Item;
    }(Game_Item));
    ;
    var _Game_Actor = (function (_super) {
        __extends(_Game_Actor, _super);
        function _Game_Actor() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(_Game_Actor.prototype, "baseId", {
            get: function () {
                return 'actor' + this.actorId().padZero(2) + '_';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "poseId", {
            get: function () {
                return this._poseId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "faceId", {
            get: function () {
                if (!this._faceId) {
                    return '';
                }
                return this._faceId.padZero(2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "hoppeId", {
            get: function () {
                return this._hoppeId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "outerId", {
            get: function () {
                if (this._outerId != null) {
                    return this._outerId;
                }
                if (this._outerItemId === 0) {
                    return 'a';
                }
                if (this._castOffOuter) {
                    return 'a';
                }
                return $dataArmors[this._outerItemId].meta['outer'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "innerBottomId", {
            get: function () {
                if (this._innerBottomId != null) {
                    return this._innerBottomId;
                }
                if (this._innerBottomItemId === 0) {
                    return 'a';
                }
                if (this._castOffInnerBottom) {
                    return 'a';
                }
                return $dataArmors[this._innerBottomItemId].meta['innerBottom'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "innerTopId", {
            get: function () {
                if (this._innerTopId != null) {
                    return this._innerTopId;
                }
                if (this._innerTopItemId === 0) {
                    return 'a';
                }
                if (this._castOffInnerTop) {
                    return 'a';
                }
                return $dataArmors[this._innerTopItemId].meta['innerTop'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "outerArmor", {
            get: function () {
                if (this._outerItemId === 0) {
                    return null;
                }
                return $dataArmors[this._outerItemId];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "innerBottomArmor", {
            get: function () {
                if (this._innerBottomItemId === 0) {
                    return null;
                }
                return $dataArmors[this._innerBottomItemId];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "innerTopArmor", {
            get: function () {
                if (this._innerTopItemId === 0) {
                    return null;
                }
                return $dataArmors[this._innerTopItemId];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "tachieOffsetX", {
            get: function () {
                return offsetX[this.actorId()] || 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "tachieOffsetY", {
            get: function () {
                return offsetY[this.actorId()] || 0;
            },
            enumerable: true,
            configurable: true
        });
        _Game_Actor.prototype.initMembers = function () {
            _Game_Actor_initMembers.call(this);
            this._faceId = 1;
            this._poseId = 1;
            this._hoppeId = 0;
            this._outerItemId = 0;
            this._innerTopItemId = 0;
            this._innerBottomItemId = 0;
            this._castOffInnerTop = false;
            this._castOffInnerBottom = false;
            this._castOffOuter = false;
            this.setDirty();
        };
        _Game_Actor.prototype.isDirty = function () {
            return this._dirty;
        };
        _Game_Actor.prototype.setDirty = function () {
            this._dirty = true;
        };
        _Game_Actor.prototype.clearDirty = function () {
            this._dirty = false;
        };
        _Game_Actor.prototype.castOffOuter = function () {
            if (this._castOffOuter) {
                return;
            }
            this._castOffOuter = true;
            this.setDirty();
        };
        _Game_Actor.prototype.castOffInnerBottom = function () {
            if (this._castOffInnerBottom) {
                return;
            }
            this._castOffInnerBottom = true;
            this.setDirty();
        };
        _Game_Actor.prototype.castOffInnerTop = function () {
            if (this._castOffInnerTop) {
                return;
            }
            this._castOffInnerTop = true;
            this.setDirty();
        };
        _Game_Actor.prototype.isCastOffOuter = function () {
            return this._castOffOuter;
        };
        _Game_Actor.prototype.isCastOffInnerTop = function () {
            return this._castOffInnerTop;
        };
        _Game_Actor.prototype.isCastOffInnerBottom = function () {
            return this._castOffInnerBottom;
        };
        _Game_Actor.prototype.tachieArrayString = function () {
            return [this.faceId, this.hoppeId, this.outerId, this.innerBottomId, this.innerTopId].toString();
        };
        _Game_Actor.prototype.hasOuter = function () {
            return this.outerId !== 'a';
        };
        _Game_Actor.prototype.hasInnerBottom = function () {
            return this.innerBottomId !== 'a';
        };
        _Game_Actor.prototype.hasInnerTop = function () {
            return this.innerTopId !== 'a';
        };
        _Game_Actor.prototype.setFaceId = function (n) {
            if (this._faceId === n) {
                return;
            }
            this._faceId = n;
            this.setDirty();
        };
        _Game_Actor.prototype.setHoppeId = function (n) {
            if (this._hoppeId === n) {
                return;
            }
            this._hoppeId = n;
            this.setDirty();
        };
        _Game_Actor.prototype.setPoseId = function (n) {
            if (this._poseId === n) {
                return;
            }
            this._poseId = n;
            this.setDirty();
        };
        _Game_Actor.prototype.setOuterId = function (newId) {
            if (this._outerId === newId) {
                return;
            }
            this._outerId = newId;
            this.setDirty();
        };
        _Game_Actor.prototype.setOuterItemId = function (newId) {
            if (this._outerItemId === newId) {
                return;
            }
            this._outerItemId = newId;
            this.setDirty();
        };
        _Game_Actor.prototype.setInnerBottomId = function (newId) {
            if (this._innerBottomId === newId) {
                return;
            }
            this._innerBottomId = newId;
            this.setDirty();
        };
        _Game_Actor.prototype.setInnerBottomItemId = function (newId) {
            if (this._innerBottomItemId === newId) {
                return;
            }
            this._innerBottomItemId = newId;
            this.setDirty();
        };
        _Game_Actor.prototype.setInnerTopId = function (newId) {
            if (this._innerTopId === newId) {
                return;
            }
            this._innerTopId = newId;
            this.setDirty();
        };
        _Game_Actor.prototype.setInnerTopItemId = function (newId) {
            if (this._innerTopItemId === newId) {
                return;
            }
            this._innerTopItemId = newId;
            this.setDirty();
        };
        return _Game_Actor;
    }(Game_Actor));
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
    var _ImageManager_isReady = ImageManager.isReady;
    ImageManager.isReady = function () {
        for (var key in this._cache) {
            var bitmap = this._cache[key];
            if (bitmap.isError()) {
                if (bitmap.url.indexOf('tachie') >= 0) {
                    console.error('Failed to load: ' + bitmap.url);
                    this._cache[key] = new Bitmap();
                    return true;
                }
                else {
                    throw new Error('Failed to load: ' + bitmap.url);
                }
            }
            if (!bitmap.isReady()) {
                return false;
            }
        }
        return true;
    };
    var _Game_Temp = (function (_super) {
        __extends(_Game_Temp, _super);
        function _Game_Temp() {
            _super.apply(this, arguments);
        }
        _Game_Temp.prototype.getActorBitmapBodyCache = function (actorId) {
            this.actorBitmapBodyCache = this.actorBitmapBodyCache || {};
            if (!this.actorBitmapBodyCache[actorId]) {
                this.actorBitmapBodyCache[actorId] = new Bitmap(Graphics.width / 2 + 100, Graphics.height);
            }
            return this.actorBitmapCache[actorId];
        };
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
            if (picture && picture.tachieActorId !== 0) {
                var actorId = picture.tachieActorId;
                var actor = $gameActors.actor(actorId);
                if (actor.isDirty()) {
                    this.redrawActorImage();
                }
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
            var bitmap = $gameTemp.getActorBitmapCache(actorId);
            this.drawActorImage(actor, bitmap);
        };
        _Sprite_Picture.prototype.drawActorImage = function (actor, bitmap) {
            var cache = $gameTemp.getActorBitmapBodyCache(actor.actorId());
            if (actor.isDirty()) {
                cache.clear();
                actor.clearDirty();
                this.drawOuterBack(actor, cache);
                this.drawBodyBack(actor, cache);
                this.drawInnerBottom(actor, cache);
                this.drawInnerTop(actor, cache);
                this.drawOuterMain(actor, cache);
                this.drawBodyFront(actor, cache);
                //this.drawOuterFront(actor, cache);
                console.log('createCache');
            }
            this.drawCache(cache);
            //this.drawHoppe(actor, this.bitmap);
            this.drawFace(actor, this.bitmap);
        };
        _Sprite_Picture.prototype.drawCache = function (cache) {
            this.bitmap.blt(cache, 0, 0, cache.width, cache.height, 0, 0);
            //this.bitmap._context.putImageData(cache._context.getImageData(0, 0, cache.width, cache.height), 0, 0);
        };
        _Sprite_Picture.prototype.drawTachieFile = function (file, bitmap, actor) {
            if (useTextureAtlas) {
                this.drawTachieTextureAtlas(file, bitmap, actor);
            }
            else {
                this.drawTachieImage(file, bitmap, actor);
            }
        };
        _Sprite_Picture.prototype.drawTachieTextureAtlas = function (file, bitmap, actor) {
            var texture = PIXI.TextureCache[file + '.png'];
            if (!texture) {
                return;
            }
            var img = texture.baseTexture.source;
            var rect = texture.frame;
            var trim = texture.trim;
            var crop = texture.crop;
            var dx = trim.x + actor.tachieOffsetX;
            var dy = trim.y + actor.tachieOffsetY;
            bitmap._context.drawImage(img, rect.x, rect.y, crop.width, crop.height, dx, dy, crop.width, crop.height);
        };
        _Sprite_Picture.prototype.drawTachieImage = function (file, bitmap, actor) {
            var img = ImageManager.loadTachie(file);
            if (!img.isReady()) {
                console.log('draw' + file);
                actor.setDirty();
                return;
            }
            var dx = actor.tachieOffsetX;
            var dy = actor.tachieOffsetY;
            if (isNaN(dx)) {
                dx = 0;
            }
            if (isNaN(dy)) {
                dy = 0;
            }
            this.bitmap.blt(img, 0, 0, img.width, img.height, dx, dy);
        };
        _Sprite_Picture.prototype.drawOuterBack = function (actor, bitmap) {
            if (!actor.hasOuter()) {
                return;
            }
            var file = actor.baseId + 'out_' + actor.outerId + '_back_' + actor.poseId;
            this.drawTachieFile(file, bitmap, actor);
        };
        _Sprite_Picture.prototype.drawOuterShadow = function (actor, bitmap) {
            if (!actor.hasOuter()) {
                return;
            }
            var file = actor.baseId + 'out_' + actor.outerId + '_shadow_' + actor.poseId;
            this.drawTachieFile(file, bitmap, actor);
        };
        _Sprite_Picture.prototype.drawOuterMain = function (actor, bitmap) {
            if (!actor.hasOuter()) {
                return;
            }
            var file = actor.baseId + 'out_' + actor.outerId + '_main_' + actor.poseId;
            this.drawTachieFile(file, bitmap, actor);
        };
        _Sprite_Picture.prototype.drawOuterFront = function (actor, bitmap) {
            if (!actor.hasOuter()) {
                return;
            }
            var file = actor.baseId + 'out_' + actor.outerId + '_front_' + actor.poseId;
            this.drawTachieFile(file, bitmap, actor);
        };
        _Sprite_Picture.prototype.drawBodyBack = function (actor, bitmap) {
            var file = actor.baseId + 'body_' + actor.poseId;
            this.drawTachieFile(file, bitmap, actor);
        };
        _Sprite_Picture.prototype.drawBodyFront = function (actor, bitmap) {
            var file = actor.baseId + 'face_' + actor.poseId;
            this.drawTachieFile(file, bitmap, actor);
        };
        _Sprite_Picture.prototype.drawInnerBottom = function (actor, bitmap) {
            if (!actor.hasInnerBottom()) {
                return;
            }
            var file = actor.baseId + 'in_' + actor.innerBottomId + '_bottom';
            this.drawTachieFile(file, bitmap, actor);
        };
        _Sprite_Picture.prototype.drawInnerTop = function (actor, bitmap) {
            if (!actor.hasInnerTop()) {
                return;
            }
            var file = actor.baseId + 'in_' + actor.innerTopId + '_top';
            this.drawTachieFile(file, bitmap, actor);
        };
        _Sprite_Picture.prototype.drawHoppe = function (actor, bitmap) {
            if (actor.hoppeId === 0) {
                return;
            }
            var file = actor.baseId + 'hoppe';
            this.drawTachieFile(file, bitmap, actor);
        };
        _Sprite_Picture.prototype.drawFace = function (actor, bitmap) {
            var file = actor.baseId + actor.faceId;
            this.drawTachieFile(file, bitmap, actor);
        };
        return _Sprite_Picture;
    }(Sprite_Picture));
    var Window_MessageName = (function (_super) {
        __extends(Window_MessageName, _super);
        function Window_MessageName() {
            var width = 180;
            var height = this.windowHeight();
            var x = 30;
            var y = 430;
            console.log(width);
            console.log(height);
            _super.call(this, x, y, width, height);
            this.padding = 8;
            this.openness = 0;
        }
        Window_MessageName.prototype.windowHeight = function () {
            return this.fittingHeight(1) + 14;
        };
        Window_MessageName.prototype.standardPadding = function () {
            return 0;
        };
        Window_MessageName.prototype.draw = function (name) {
            this.width = name.length * 34 + 30;
            this.contents.clear();
            this.drawText(name, 8, 0, 160);
            this.open();
        };
        return Window_MessageName;
    }(Window_Base));
    var Sprite_WindowBalloon = (function (_super) {
        __extends(Sprite_WindowBalloon, _super);
        function Sprite_WindowBalloon() {
            _super.apply(this, arguments);
        }
        Sprite_WindowBalloon.prototype.update = function () {
            _super.prototype.update.call(this);
            this.updateBitmap();
            this.updatePosition();
        };
        Sprite_WindowBalloon.prototype.updateBitmap = function () {
            if (this._balloonColorId == $gameTemp.tachieActorId) {
                return;
            }
            if ($gameTemp.tachieActorId > 0) {
                this._windowSkilId = $gameTemp.tachieActorId;
                this.bitmap = ImageManager.loadSystem('WindowBaloon' + $gameTemp.tachieActorId);
                this.visible = true;
            }
            else {
                this.visible = false;
                this._windowSkilId = 0;
            }
        };
        Sprite_WindowBalloon.prototype.updatePosition = function () {
            if ($gameTemp.tachieActorPos === LEFT_POS) {
                this.scale.x = 1;
                this.x = 300;
            }
            else if ($gameTemp.tachieActorPos === RIGHT_POS) {
                this.scale.x = -1;
                this.x = 500;
            }
        };
        return Sprite_WindowBalloon;
    }(Sprite_Base));
    var _Bitmap = (function (_super) {
        __extends(_Bitmap, _super);
        function _Bitmap() {
            _super.apply(this, arguments);
        }
        return _Bitmap;
    }(Bitmap));
    var Window_TachieMessage = (function (_super) {
        __extends(Window_TachieMessage, _super);
        function Window_TachieMessage() {
            _super.apply(this, arguments);
        }
        Window_TachieMessage.prototype.numVisibleRows = function () {
            return 3;
        };
        Window_TachieMessage.prototype.subWindows = function () {
            var ret = _super.prototype.subWindows.call(this);
            ret.push(this._messageNameWindow);
            return ret;
        };
        Window_TachieMessage.prototype.createSubWindows = function () {
            _super.prototype.createSubWindows.call(this);
            this._messageNameWindow = new Window_MessageName();
            this._balloonSprite = new Sprite_WindowBalloon();
            this._balloonSprite.y = -39;
            this.addChild(this._balloonSprite);
        };
        Window_TachieMessage.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this._windowSkilId !== $gameTemp.tachieActorId) {
                if ($gameTemp.tachieActorId > 0) {
                    this._windowSkilId = $gameTemp.tachieActorId;
                    this.windowskin = ImageManager.loadSystem('Window' + $gameTemp.tachieActorId);
                }
                else {
                    this._windowSkilId = 0;
                    this.windowskin = ImageManager.loadSystem('Window');
                    $gameTemp.tachieActorId = 0;
                }
            }
            if (this.isClosing() && this.openness < 240) {
                this._balloonSprite.visible = false;
                this._messageNameWindow.close();
            }
            else if (this.openness >= 255) {
                this._balloonSprite.visible = true;
            }
        };
        Window_TachieMessage.prototype.open = function () {
            _super.prototype.open.call(this);
            this._messageNameWindow.close();
        };
        Window_TachieMessage.prototype.startMessage = function () {
            _super.prototype.startMessage.call(this);
            this._balloonSprite.visible = true;
            this._messageNameWindow.draw($gameTemp.tachieName);
        };
        Window_TachieMessage.prototype.updatePlacement = function () {
            this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
        };
        Window_TachieMessage.prototype.isAnySubWindowActive = function () {
            return false;
        };
        Window_TachieMessage.prototype.terminateMessage = function () {
            this.close();
            $gameMessage.clear();
        };
        return Window_TachieMessage;
    }(Window_Message));
    /*var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (false) {
            this._messageWindow.visible = false;
            this._tachieMessageWindow.visible = true;
        } else {
            this._messageWindow.visible = true;
            this._tachieMessageWindow.visible = false;
        }
    };*/
    var _Scene_Map_createMessageWindow = Scene_Map.prototype.createMessageWindow;
    Scene_Map.prototype.createMessageWindow = function () {
        _Scene_Map_createMessageWindow.call(this);
        this._tachieMessageWindow = new Window_TachieMessage();
        this._originalMessageWindow = this._messageWindow;
        this.addWindow(this._tachieMessageWindow);
        this._windowLayer.removeChild(this._originalMessageWindow);
        this._messageWindow = this._tachieMessageWindow;
        this._messageWindow.subWindows().forEach(function (window) {
            this.addWindow(window);
        }, this);
    };
    var applyMyMethods = function (myClass, presetClass, applyConstructor) {
        for (var p in myClass.prototype) {
            if (myClass.prototype.hasOwnProperty(p)) {
                if (p === 'constructor' && !applyConstructor) {
                    continue;
                }
                Object.defineProperty(presetClass.prototype, p, Object.getOwnPropertyDescriptor(myClass.prototype, p));
            }
        }
    };
    applyMyMethods(_Bitmap, Bitmap);
    applyMyMethods(_Game_Interpreter, Game_Interpreter);
    applyMyMethods(_Sprite_Picture, Sprite_Picture);
    applyMyMethods(_Game_Item, Game_Item);
    applyMyMethods(_Game_Actor, Game_Actor);
    applyMyMethods(_Game_Screen, Game_Screen);
    applyMyMethods(_Game_Picture, Game_Picture);
    applyMyMethods(_Game_Temp, Game_Temp);
})(Tachie || (Tachie = {}));
