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
    Tachie.offsetX = {};
    Tachie.offsetY = {};
    Tachie.RIGHT_POS_OFFSET_X = 400;
    for (var i = 1; i < 10; i++) {
        var offset1 = String(parameters['actor' + i + 'offset']).split(',');
        Tachie.offsetX[i] = parseInt(offset1[0] || '0');
        Tachie.offsetY[i] = parseInt(offset1[1] || '0');
        if (isNaN(Tachie.offsetX[i])) {
            Tachie.offsetX[i] = 0;
        }
        if (isNaN(Tachie.offsetY[i])) {
            Tachie.offsetY[i] = 0;
        }
    }
    var useTextureAtlas = parameters['useTextureAtlas'] === 'true';
    Tachie.DEFAULT_PICTURE_ID1 = 12;
    Tachie.DEFAULT_PICTURE_ID2 = 11;
    var ACTOR_PREFIX = '___actor';
    Tachie.LEFT_POS = 1;
    Tachie.RIGHT_POS = 2;
    Tachie.MESSAGE_SKIP_KEY = 'control';
    Tachie.WINDOW_HIDE_KEY = 'shift';
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
                case 'notClose':
                    $gameTemp.tachieAvairable = args[1] === 'on';
                    break;
                case 'showName':
                    $gameTemp.tachieName = args[1];
                    break;
                case 'hideName':
                    $gameTemp.tachieName = null;
                    break;
                case 'hide':
                    {
                        var picture1 = $gameScreen.picture(Tachie.DEFAULT_PICTURE_ID1);
                        var picture2 = $gameScreen.picture(Tachie.DEFAULT_PICTURE_ID2);
                        var commands = [];
                        if (picture1 && picture1.opacity() > 0) {
                            var c = { 'code': 232, 'indent': this._indent, 'parameters': [Tachie.DEFAULT_PICTURE_ID1,
                                    0, 0, 0, picture1.x(), picture1.y(), 100, 100, 0, 0, 30, false] };
                            commands.push(c);
                        }
                        if (picture2 && picture2.opacity() > 0) {
                            var c = { 'code': 232, 'indent': this._indent, 'parameters': [Tachie.DEFAULT_PICTURE_ID2,
                                    0, 0, 0, picture2.x(), picture2.y(), 100, 100, 0, 0, 20, false] };
                            commands.push(c);
                        }
                        if (commands.length > 0) {
                            commands[0]['parameters'][11] = true;
                        }
                        for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
                            var c = commands_1[_i];
                            this._list.splice(this._index + 1, 0, c);
                        }
                        var c2 = { 'code': 356, 'indent': this._indent, 'parameters': ["Tachie clear"] };
                        this._list.splice(this._index + 1 + commands.length, 0, c2);
                    }
                    break;
                case 'clear':
                    {
                        var picture1 = $gameScreen.picture(Tachie.DEFAULT_PICTURE_ID1);
                        var picture2 = $gameScreen.picture(Tachie.DEFAULT_PICTURE_ID2);
                        if (picture1) {
                            picture1.erase();
                        }
                        if (picture2) {
                            picture2.erase();
                        }
                    }
                    break;
                case 'showLeft':
                case 'showRight':
                    ImageManager.isReady();
                    var actorId = parseInt(args[1]);
                    var x = parseInt(args[2] || '0');
                    var y = parseInt(args[3] || '0');
                    var opacity = parseInt(args[4] || '255');
                    this.tachiePictureCommnad(args[0], actorId, x, y, opacity);
                    break;
                case 'face':
                case 'pose':
                case 'hoppe':
                case 'outer':
                case 'innerTop':
                case 'innerBottom':
                    {
                        var actor = $gameActors.actor(parseInt(args[1]));
                        if (!actor) {
                            throw new Error('立ち絵コマンド: ' + args[0] + ' の' + args[1] + 'のアクターが存在しません');
                        }
                        if (args[2] == null) {
                            throw new Error('立ち絵コマンド: ' + args[0] + ' の第二引数が存在しません');
                        }
                        this.tachieActorCommnad(actor, args[0], args[2]);
                    }
                    break;
                case 'preload':
                    {
                        var actor = $gameActors.actor(parseInt(args[1]));
                        actor.preloadTachie();
                    }
                    break;
                case 'preloadFaces':
                    {
                        var actor = $gameActors.actor(parseInt(args[1]));
                        args.splice(0, 2);
                        actor.preloadFaces(args);
                    }
                    break;
                default:
                    console.error(args[0]);
            }
        };
        _Game_Interpreter.prototype.tachiePictureCommnad = function (command, actorId, x, y, opacity) {
            switch (command) {
                case 'showLeft':
                    $gameTemp.tachieActorId = actorId;
                    $gameTemp.tachieActorPos = Tachie.LEFT_POS;
                    if (opacity < 255) {
                        var picture_1 = $gameScreen.picture(Tachie.DEFAULT_PICTURE_ID1);
                        if (picture_1 && picture_1.tachieActorId === actorId) {
                            opacity = 255;
                        }
                    }
                    $gameScreen.showPicture(Tachie.DEFAULT_PICTURE_ID1, ACTOR_PREFIX + actorId, 0, x, y, 100, 100, opacity, 0);
                    if (opacity < 255) {
                        var c = { 'code': 232, 'indent': this._indent, 'parameters': [Tachie.DEFAULT_PICTURE_ID1, 0, 0, 0, x, y, 100, 100, 255, 0, 15, true] };
                        this._list.splice(this._index + 1, 0, c);
                    }
                    break;
                case 'showRight':
                    $gameTemp.tachieActorId = actorId;
                    $gameTemp.tachieActorPos = Tachie.RIGHT_POS;
                    var picId = Tachie.DEFAULT_PICTURE_ID2;
                    var picture = $gameScreen.picture(picId);
                    if (picture && picture.tachieActorId === actorId) {
                        opacity = 255;
                    }
                    var xx = x + Tachie.RIGHT_POS_OFFSET_X;
                    $gameScreen.showPicture(picId, ACTOR_PREFIX + actorId, 0, xx, y, 100, 100, opacity, 0);
                    if (opacity < 255) {
                        var c = { 'code': 232, 'indent': this._indent, 'parameters': [picId, 0, 0, 0, xx, y, 100, 100, 255, 0, 15, true] };
                        this._list.splice(this._index + 1, 0, c);
                    }
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
                    var innerTopId = parseInt(arg2);
                    var innerTop = new Game_Item($dataArmors[innerTopId]);
                    if (!innerTop.isInnerTop()) {
                        throw new Error('Armor ID ' + innerTopId + 'はインナートップではありません' + JSON.stringify($dataArmors[innerTopId].meta));
                    }
                    actor.setInnerTopItemId(innerTopId);
                    break;
                case 'innerBottomItem':
                    var innerBottomId = parseInt(arg2);
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
    Game_Interpreter.prototype.setup = function (list, eventId) {
        this.clear();
        this._mapId = $gameMap.mapId();
        this._eventId = eventId || 0;
        this._list = [];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var c = list_1[_i];
            this._list.push(c);
        }
    };
    ImageManager.loadTachie = function (filename, hue) {
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
                return Tachie.offsetX[this.actorId()] || 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_Game_Actor.prototype, "tachieOffsetY", {
            get: function () {
                return Tachie.offsetY[this.actorId()] || 0;
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
            this.setCacheChanged();
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
        _Game_Actor.prototype.isCacheChanged = function () {
            return this._cacheChanged;
        };
        _Game_Actor.prototype.setCacheChanged = function () {
            this._cacheChanged = true;
            this.setDirty();
        };
        _Game_Actor.prototype.clearCacheChanged = function () {
            this._cacheChanged = false;
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
            this.setCacheChanged();
        };
        _Game_Actor.prototype.castOffInnerTop = function () {
            if (this._castOffInnerTop) {
                return;
            }
            this._castOffInnerTop = true;
            this.setCacheChanged();
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
            this.setCacheChanged();
        };
        _Game_Actor.prototype.setOuterId = function (newId) {
            if (this._outerId === newId) {
                return;
            }
            this._outerId = newId;
            this.setCacheChanged();
        };
        _Game_Actor.prototype.setOuterItemId = function (newId) {
            if (this._outerItemId === newId) {
                return;
            }
            this._outerItemId = newId;
            this.setCacheChanged();
        };
        _Game_Actor.prototype.setInnerBottomId = function (newId) {
            if (this._innerBottomId === newId) {
                return;
            }
            this._innerBottomId = newId;
            this.setCacheChanged();
        };
        _Game_Actor.prototype.setInnerBottomItemId = function (newId) {
            if (this._innerBottomItemId === newId) {
                return;
            }
            this._innerBottomItemId = newId;
            this.setCacheChanged();
        };
        _Game_Actor.prototype.setInnerTopId = function (newId) {
            if (this._innerTopId === newId) {
                return;
            }
            this._innerTopId = newId;
            this.setCacheChanged();
        };
        _Game_Actor.prototype.setInnerTopItemId = function (newId) {
            if (this._innerTopItemId === newId) {
                return;
            }
            this._innerTopItemId = newId;
            this.setCacheChanged();
        };
        _Game_Actor.prototype.preloadTachie = function () {
            this.doPreloadTachie(this.outerBackFile());
            this.doPreloadTachie(this.outerShadowFile());
            this.doPreloadTachie(this.outerMainFile());
            this.doPreloadTachie(this.outerFrontFile());
            this.doPreloadTachie(this.bodyBackFile());
            this.doPreloadTachie(this.bodyFrontFile());
            this.doPreloadTachie(this.innerBottomFile());
            this.doPreloadTachie(this.innerTopFile());
            this.doPreloadTachie(this.hoppeFile());
            this.doPreloadTachie(this.faceFile());
        };
        _Game_Actor.prototype.preloadFaces = function (faceIds) {
            for (var _i = 0, faceIds_1 = faceIds; _i < faceIds_1.length; _i++) {
                var faceId = faceIds_1[_i];
                this.doPreloadTachie(this.baseId + faceId.padZero(2));
            }
        };
        _Game_Actor.prototype.doPreloadTachie = function (file) {
            if (!file) {
                return;
            }
            ImageManager.loadTachie(file);
        };
        _Game_Actor.prototype.outerBackFile = function () {
            return this.baseId + 'out_' + this.outerId + '_back_' + this.poseId;
        };
        _Game_Actor.prototype.outerShadowFile = function () {
            if (!this.hasOuter()) {
                return null;
            }
            return this.baseId + 'out_' + this.outerId + '_shadow_' + this.poseId;
        };
        _Game_Actor.prototype.outerMainFile = function () {
            if (!this.hasOuter()) {
                return null;
            }
            return this.baseId + 'out_' + this.outerId + '_main_' + this.poseId;
        };
        _Game_Actor.prototype.outerFrontFile = function () {
            if (!this.hasOuter()) {
                return null;
            }
            return this.baseId + 'out_' + this.outerId + '_front_' + this.poseId;
        };
        _Game_Actor.prototype.bodyBackFile = function () {
            return this.baseId + 'body_' + this.poseId;
        };
        _Game_Actor.prototype.bodyFrontFile = function () {
            return this.baseId + 'face_' + this.poseId;
        };
        _Game_Actor.prototype.innerBottomFile = function () {
            if (!this.hasInnerBottom()) {
                return null;
            }
            return this.baseId + 'in_' + this.innerBottomId + '_bottom';
        };
        _Game_Actor.prototype.innerTopFile = function () {
            if (!this.hasInnerTop()) {
                return null;
            }
            return this.baseId + 'in_' + this.innerTopId + '_top';
        };
        _Game_Actor.prototype.hoppeFile = function () {
            if (this.hoppeId === 0) {
                return null;
            }
            return this.baseId + 'hoppe';
        };
        _Game_Actor.prototype.faceFile = function () {
            return this.baseId + this.faceId;
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
                    continue;
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
            return this.actorBitmapBodyCache[actorId];
        };
        _Game_Temp.prototype.getPictureBitmapCache = function (actorId) {
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
        _Game_Screen.prototype.getPictureId = function (picture) {
            for (var i = 0; i < this._pictures.length; i++) {
                if (this._pictures[i] === picture) {
                    return i;
                }
            }
            console.error('picture not found.' + picture);
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
                this.bitmap = $gameTemp.getPictureBitmapCache($gameScreen.getPictureId(picture));
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
            var bitmap = $gameTemp.getPictureBitmapCache($gameScreen.getPictureId(picture));
            this.drawActorImage(actor, bitmap);
        };
        _Sprite_Picture.prototype.drawActorImage = function (actor, bitmap) {
            var cache = $gameTemp.getActorBitmapBodyCache(actor.actorId());
            this.bitmap.clear();
            if (actor.isCacheChanged()) {
                cache.clear();
                actor.clearCacheChanged();
                this.drawOuterBack(actor, cache);
                this.drawBodyBack(actor, cache);
                this.drawInnerBottom(actor, cache);
                this.drawInnerTop(actor, cache);
                this.drawOuterMain(actor, cache);
                this.drawBodyFront(actor, cache);
                this.drawOuterFront(actor, cache);
                console.log('createCache:' + actor.actorId());
            }
            this.drawCache(cache);
            this.drawHoppe(actor, this.bitmap);
            this.drawFace(actor, this.bitmap);
        };
        _Sprite_Picture.prototype.drawCache = function (cache) {
            this.bitmap.blt(cache, 0, 0, cache.width, cache.height, 0, 0);
            //this.bitmap._context.putImageData(cache._context.getImageData(0, 0, cache.width, cache.height), 0, 0);
        };
        _Sprite_Picture.prototype.drawTachieFile = function (file, bitmap, actor) {
            if (!file) {
                return;
            }
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
            bitmap.context.drawImage(img, rect.x, rect.y, crop.width, crop.height, dx, dy, crop.width, crop.height);
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
            bitmap.blt(img, 0, 0, img.width, img.height, dx, dy);
        };
        _Sprite_Picture.prototype.drawOuterBack = function (actor, bitmap) {
            this.drawTachieFile(actor.outerBackFile(), bitmap, actor);
        };
        _Sprite_Picture.prototype.drawOuterShadow = function (actor, bitmap) {
            this.drawTachieFile(actor.outerShadowFile(), bitmap, actor);
        };
        _Sprite_Picture.prototype.drawOuterMain = function (actor, bitmap) {
            this.drawTachieFile(actor.outerMainFile(), bitmap, actor);
        };
        _Sprite_Picture.prototype.drawOuterFront = function (actor, bitmap) {
            this.drawTachieFile(actor.outerFrontFile(), bitmap, actor);
        };
        _Sprite_Picture.prototype.drawBodyBack = function (actor, bitmap) {
            this.drawTachieFile(actor.bodyBackFile(), bitmap, actor);
        };
        _Sprite_Picture.prototype.drawBodyFront = function (actor, bitmap) {
            this.drawTachieFile(actor.bodyFrontFile(), bitmap, actor);
        };
        _Sprite_Picture.prototype.drawInnerBottom = function (actor, bitmap) {
            this.drawTachieFile(actor.innerBottomFile(), bitmap, actor);
        };
        _Sprite_Picture.prototype.drawInnerTop = function (actor, bitmap) {
            this.drawTachieFile(actor.innerTopFile(), bitmap, actor);
        };
        _Sprite_Picture.prototype.drawHoppe = function (actor, bitmap) {
            this.drawTachieFile(actor.hoppeFile(), bitmap, actor);
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
            var height = _super.prototype.fittingHeight.call(this, 1) + 14;
            var x = 30;
            var y = 430;
            _super.call(this, x, y, width, height);
            this.padding = 8;
            this.openness = 0;
        }
        Window_MessageName.prototype.standardPadding = function () {
            return 0;
        };
        Window_MessageName.prototype.draw = function (name) {
            if (!name) {
                this.visible = false;
                return;
            }
            this.width = this.convertEscapeCharacters(name).length * 28 + 40;
            this.contents.clear();
            this.drawTextEx(name, 10, 0);
            this.open();
        };
        return Window_MessageName;
    }(Window_Base));
    var Sprite_WindowBalloon = (function (_super) {
        __extends(Sprite_WindowBalloon, _super);
        function Sprite_WindowBalloon(messageWindow) {
            _super.call(this);
            this._messageWindow = messageWindow;
        }
        Sprite_WindowBalloon.prototype.update = function () {
            _super.prototype.update.call(this);
            this.updateBitmap();
            this.updatePosition();
        };
        Sprite_WindowBalloon.prototype.updateBitmap = function () {
            if (this._balloonColorId === $gameTemp.tachieActorId) {
                return;
            }
            if ($gameTemp.tachieActorId > 0) {
                if (!this._messageWindow.isOpen()) {
                    this.visible = false;
                    return;
                }
                this._windowSkinId = $gameTemp.tachieActorId;
                this.bitmap = ImageManager.loadSystem('WindowBaloon' + $gameTemp.tachieActorId);
                this.visible = true;
            }
            else {
                this.visible = false;
                this._windowSkinId = 0;
            }
        };
        Sprite_WindowBalloon.prototype.updatePosition = function () {
            if ($gameTemp.tachieActorPos === Tachie.LEFT_POS) {
                this.scale.x = 1;
                this.x = 300;
            }
            else if ($gameTemp.tachieActorPos === Tachie.RIGHT_POS) {
                this.scale.x = -1;
                this.x = 500;
            }
        };
        return Sprite_WindowBalloon;
    }(Sprite_Base));
    var Window_TachieMessage = (function (_super) {
        __extends(Window_TachieMessage, _super);
        function Window_TachieMessage() {
            _super.call(this);
        }
        Window_TachieMessage.prototype.contentsHeight = function () {
            return this.height;
        };
        ;
        Window_TachieMessage.prototype.numVisibleRows = function () {
            return 3;
        };
        Window_TachieMessage.prototype._refreshContents = function () {
            this._windowContentsSprite.move(this.padding + 6, 0);
        };
        ;
        Window_TachieMessage.prototype._updateContents = function () {
            var w = this._width - this._padding * 2;
            var h = this._height - 0 * 2;
            if (w > 0 && h > 0) {
                this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
                this._windowContentsSprite.visible = this.isOpen();
            }
            else {
                this._windowContentsSprite.visible = false;
            }
        };
        Window_TachieMessage.prototype.subWindows = function () {
            var ret = _super.prototype.subWindows.call(this);
            ret.push(this._messageNameWindow);
            return ret;
        };
        Window_TachieMessage.prototype.createSubWindows = function () {
            _super.prototype.createSubWindows.call(this);
            this._messageNameWindow = new Window_MessageName();
            this._balloonSprite = new Sprite_WindowBalloon(this);
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
            if (!$gameTemp.tachieAvairable && !$gameMessage.isBusy() && this.isOpen()) {
                this.close();
            }
            this.updateMessageSkip();
            this.updateWindowVisibility();
        };
        Window_TachieMessage.prototype.updateMessageSkip = function () {
            if (Input.isPressed(Tachie.MESSAGE_SKIP_KEY)) {
                if (this._windowHide) {
                    this.changeWindowVisibility();
                }
                if (this.isAnySubWindowActive()) {
                    return;
                }
                this._pauseSkip = true;
                this._showFast = true;
                this._triggered = true;
                this.pause = false;
                this._waitCount = 0;
                if (!this._textState) {
                    this.terminateMessage();
                }
            }
        };
        Window_TachieMessage.prototype.updateWindowVisibility = function () {
            if (Input.isTriggered(Tachie.WINDOW_HIDE_KEY)) {
                this.changeWindowVisibility();
            }
            else if (this._windowHide && Input.isTriggered('ok')) {
                this.changeWindowVisibility();
            }
        };
        Window_TachieMessage.prototype.changeWindowVisibility = function () {
            this._windowHide = !this._windowHide;
            if (this._windowHide && this.visible) {
                this.visible = false;
                this._messageNameWindow.visible = false;
                for (var _i = 0, _a = this.subWindows(); _i < _a.length; _i++) {
                    var window_1 = _a[_i];
                    window_1.visible = false;
                }
            }
            else {
                this.visible = true;
                if ($gameTemp.tachieName) {
                    this._messageNameWindow.visible = true;
                }
                for (var _b = 0, _c = this.subWindows(); _b < _c.length; _b++) {
                    var window_2 = _c[_b];
                    window_2.visible = true;
                }
            }
        };
        Window_TachieMessage.prototype.isTriggered = function () {
            var ret = _super.prototype.isTriggered.call(this) || this._triggered;
            this._triggered = false;
            return ret;
        };
        Window_TachieMessage.prototype.open = function () {
            _super.prototype.open.call(this);
            this._messageNameWindow.close();
        };
        Window_TachieMessage.prototype.startMessage = function () {
            _super.prototype.startMessage.call(this);
            this._textState.y = this.standardPadding();
            this._balloonSprite.visible = true;
            this._messageNameWindow.draw($gameTemp.tachieName);
        };
        Window_TachieMessage.prototype.updatePlacement = function () {
            this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
        };
        /*isAnySubWindowActive(): boolean {
            return false;
        }*/
        Window_TachieMessage.prototype.terminateMessage = function () {
            $gameMessage.clear();
            if ($gameTemp.tachieAvairable) {
                return;
            }
            this.close();
        };
        Window_TachieMessage.prototype.textAreaWidth = function () {
            return this.contentsWidth() + 20;
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
    Saba.applyMyMethods(_Game_Interpreter, Game_Interpreter);
    Saba.applyMyMethods(_Sprite_Picture, Sprite_Picture);
    Saba.applyMyMethods(_Game_Item, Game_Item);
    Saba.applyMyMethods(_Game_Actor, Game_Actor);
    Saba.applyMyMethods(_Game_Screen, Game_Screen);
    Saba.applyMyMethods(_Game_Picture, Game_Picture);
    Saba.applyMyMethods(_Game_Temp, Game_Temp);
})(Tachie || (Tachie = {}));
