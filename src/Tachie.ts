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
module Tachie {

var parameters = PluginManager.parameters('Tachie');
var offsetX = {};
var offsetY = {};
var offset1 = String(parameters['actor1offset']).split(',');
console.log(offset1)
offsetX[1] = parseInt(offset1[0] || '0');
offsetY[1] = parseInt(offset1[1] || '0');
var useTextureAtlas = parameters['useTextureAtlas'] === 'true';
console.log(offsetX[1])
var DEFAULT_PICTURE_ID1: number = 12;
var DEFAULT_PICTURE_ID2: number = 11;
var ACTOR_PREFIX: string = '___actor';



var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
var _Game_Picture_initTarget = Game_Picture.prototype.initTarget;
var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;



class _Game_Interpreter extends Game_Interpreter {
    pluginCommand(command: string, args: string[]) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command !== 'Tachie' && command !== '立ち絵') {
            return;
        }

        switch (args[0]) {
        case 'show_name':
            SceneManager._scene.openNameMessage(args[1]);
            break;
        case 'show_hide':
            SceneManager._scene.closeNameMessage();
            break;
        case 'show_left':
        case 'show_right':
            var pictureId: string = args[1];
            var x: number = parseInt(args[2] || '0');
            var y: number = parseInt(args[3] || '0');
            var opacity: number = parseInt(args[4] || '255');
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
            var arg2 = parseInt(args[2]);
            this.tachieActorCommnad(actor, args[0], arg2);
            break;
        case 'start':
            break;
        }
    }
    tachiePictureCommnad(command: string, pictureId: string, x: number, y: number, opacity: number): void {
        switch (command) {
        case 'show_left':
            $gameScreen.showPicture(DEFAULT_PICTURE_ID1, ACTOR_PREFIX + pictureId, 0, x, y, 100, 100, opacity, 0);
            break;
        case 'show_right':
            $gameScreen.showPicture(DEFAULT_PICTURE_ID2, ACTOR_PREFIX + pictureId, 0, x, y, 100, 100, opacity, 0);
            break;
        }
    }
    tachieActorCommnad(actor: Game_Actor, command: string, arg2: number): void {
        switch (command) {
        case 'face':
            actor.setFaceId(arg2);
            break;
        case 'pose':
            actor.setPoseId(arg2);
            break;
        case 'hoppe':
            actor.setHoppeId(arg2);
            break;
        case 'outer':
            var outerId = arg2;
            if (outerId === 0) {
                actor.setOuterId(0);
                break;
            }
            var outer = new Game_Item($dataArmors[outerId]);
            if (! outer.isOuter()) {
                throw new Error('Armor ID ' + outerId + 'はアウターではありません' + JSON.stringify($dataArmors[outerId].meta));
            }
            actor.setOuterId(outerId);
            break;
        case 'innerTop':
            var innerTopId = arg2;
            var innerTop = new Game_Item($dataArmors[innerTopId]);
            if (! innerTop.isInnerTop()) {
                throw new Error('Armor ID ' + innerTopId + 'はインナートップではありません' + JSON.stringify($dataArmors[innerTopId].meta));
            }
            actor.setInnerTopId(innerTopId);
            break;
        case 'innerBottom':
            var innerBottomId = arg2;
            var innerBottom = new Game_Item($dataArmors[innerBottomId]);
            if (! innerBottom.isInnerBottom()) {
                throw new Error('Armor ID ' + innerBottomId + 'はインナーボトムではありません' + JSON.stringify($dataArmors[innerBottomId].meta));
            }
            actor.setInnerBottomId(innerBottomId);
            break;
        }
    }
}

ImageManager.loadTachie = function(filename: string, hue?: number) {
    if (filename == null || filename == 'undefined') {
        throw new Error();
    }
    return this.loadBitmap('img/tachie/', filename, hue, true);
};


class _Game_Item extends Game_Item {
    isOuter(): boolean {
        return this.outerId() != null;
    }
    isInnerTop(): boolean {
        return this.innerTopId() != null;
    }
    isInnerBottom(): boolean {
        return this.innerBottomId() != null;
    }
    outerId(): string {
        return this.object().meta['outer'];
    }
    innerTopId(): string {
        return this.object().meta['innerTop'];
    }
    innerBottomId(): string {
        return this.object().meta['innerBottom'];
    }
};


class _Game_Actor extends Game_Actor {
    protected _poseId: number;
    protected _faceId: number;
    protected _hoppeId: number;
    protected _dirty: boolean;

    protected _outerItemId: number;
    protected _innerTopItemId: number;
    protected _innerBottomItemId: number;

    protected _castOffOuter: boolean;
    protected _castOffInnerBottom: boolean;
    protected _castOffInnerTop: boolean;

    get baseId(): string {
        return 'actor' + this.actorId().padZero(2) + '_';
    }
    get poseId(): number {
        return this._poseId;
    }
    get faceId(): string {
        if (! this._faceId) {
            return '';
        }
        return this._faceId.padZero(2);
    }
    get hoppeId(): number {
        return this._hoppeId;
    }

    get outerId(): string {
        if (this._outerItemId === 0) {
            return 'a';
        }
        if (this._castOffOuter) {
            return 'a';
        }
        return $dataArmors[this._outerItemId].meta['outer'];
    }
    get innerBottomId(): string {
        if (this._innerBottomItemId === 0) {
            return 'a';
        }
        if (this._castOffInnerBottom) {
            return 'a';
        }
        return $dataArmors[this._innerBottomItemId].meta['innerBottom'];
    }
    get innerTopId(): string {
        if (this._innerTopItemId === 0) {
            return 'a';
        }
        if (this._castOffInnerTop) {
            return 'a';
        }
        return $dataArmors[this._innerTopItemId].meta['innerTop'];
    }
    get outerArmor(): RPG.Armor {
        if (this._outerItemId === 0) {
            return null;
        }
        return $dataArmors[this._outerItemId];
    }
    get innerBottomArmor(): RPG.Armor {
        if (this._innerBottomItemId === 0) {
            return null;
        }
        return $dataArmors[this._innerBottomItemId];
    }
    get innerTopArmor(): RPG.Armor {
        if (this._innerTopItemId === 0) {
            return null;
        }
        return $dataArmors[this._innerTopItemId];
    }
    get tachieOffsetX(): number {
        return offsetX[this.actorId()] || 0;
    }
    initMembers(): void {
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
    }
    isDirty(): boolean {
        return this._dirty;
    }
    setDirty(): void {
        this._dirty = true;
    }
    clearDirty(): void {
        this._dirty = false;
    }
    castOffOuter(): void {
        if (this._castOffOuter) {
            return;
        }
        this._castOffOuter = true;
        this.setDirty();
    }
    castOffInnerBottom(): void {
        if (this._castOffInnerBottom) {
            return;
        }
        this._castOffInnerBottom = true;
        this.setDirty();
    }
    castOffInnerTop(): void {
        if (this._castOffInnerTop) {
            return;
        }
        this._castOffInnerTop = true;
        this.setDirty();
    }
    isCastOffOuter(): boolean {
        return this._castOffOuter;
    }
    isCastOffInnerTop(): boolean {
        return this._castOffInnerTop;
    }
    isCastOffInnerBottom(): boolean {
        return this._castOffInnerBottom;
    }
    tachieArrayString(): string {
        return [this.faceId, this.hoppeId, this.outerId, this.innerBottomId, this.innerTopId].toString();
    }
    hasOuter(): boolean {
        return this.outerId !== 'a';
    }
    hasInnerBottom(): boolean {
        return this.innerBottomId !== 'a';
    }
    hasInnerTop(): boolean {
        return this.innerTopId !== 'a';
    }
    setFaceId(n: number): void {
        if (this._faceId === n) {
            return;
        }
        this._faceId = n;
        this.setDirty();
    }
    setHoppeId(n: number): void {
        if (this._hoppeId === n) {
            return;
        }
        this._hoppeId = n;
        this.setDirty();
    }
    setPoseId(n: number): void {
        if (this._poseId === n) {
            return;
        }
        this._poseId = n;
        this.setDirty();
    }
    setOuterId(newId: number): void {
        if (this._outerItemId === newId) {
            return;
        }
        this._outerItemId = newId;
        this.setDirty();
    }
    setInnerBottomId(newId: number): void {
        if (this._innerBottomItemId === newId) {
            return;
        }
        this._innerBottomItemId = newId;
        this.setDirty();
    }
    setInnerTopId(newId: number): void {
        if (this._innerTopItemId === newId) {
            return;
        }
        this._innerTopItemId = newId;
        this.setDirty();
    }
}


class _Game_Picture extends Game_Picture {
    initTarget(): void {
        _Game_Picture_initTarget.call(this);
        this.tachieActorId = this.getTachieActorId();
    }
    protected getTachieActorId(): number {
        var matcher = /^___actor([-+]?\d+)/;
        var result = matcher.exec(this._name);
        if (result && result.length > 1) {
            return parseInt(result[1]) || 0;
        } else {
            return 0;
        }
    }
}

var _ImageManager_isReady = ImageManager.isReady;
ImageManager.isReady = function() {
    for (var key in this._cache) {
        var bitmap = this._cache[key];
        if (bitmap.isError()) {
            if (bitmap.url.indexOf('tachie') >= 0) {
                console.error('Failed to load: ' + bitmap.url);
                this._cache[key] = new Bitmap();
                return true;
            } else {
                throw new Error('Failed to load: ' + bitmap.url);
            }
        }
        if (!bitmap.isReady()) {
            return false;
        }
    }
    return true;
};


class _Game_Temp extends Game_Temp {
    protected actorBitmapCache: {[actorId: number]: Bitmap};
    protected actorBitmapBodyCache: {[actorId: number]: Bitmap};

    getActorBitmapBodyCache(actorId: number): Bitmap {
        this.actorBitmapBodyCache = this.actorBitmapBodyCache || {};
        if (! this.actorBitmapBodyCache[actorId]) {
            this.actorBitmapBodyCache[actorId] = new Bitmap(Graphics.width / 2 + 100, Graphics.height);
        }
        return this.actorBitmapCache[actorId];
    }
    getActorBitmapCache(actorId: number): Bitmap {
        this.actorBitmapCache = this.actorBitmapCache || {};
        if (! this.actorBitmapCache[actorId]) {
            this.actorBitmapCache[actorId] = new Bitmap(Graphics.width / 2 + 100, Graphics.height);
        }
        return this.actorBitmapCache[actorId];
    }
}



class _Game_Screen extends Game_Screen {
    showActorPicture(actorId: number, pictureId: number, x: number, y: number) {
        var name = ACTOR_PREFIX + actorId;
        this.showPicture(pictureId, name, 0, x, y, 1, 1, 1, 0);
    }
}



class _Sprite_Picture extends Sprite_Picture {
    updateBitmap(): void {
        _Sprite_Picture_updateBitmap.call(this);
        var picture = this.picture();
        if (picture && picture.tachieActorId !== 0) {
            var actorId = picture.tachieActorId;
            var actor = $gameActors.actor(actorId);
            if (actor.isDirty()) {
                this.redrawActorImage();
            }
        }
    }
    loadBitmap(): void {
        var picture = this.picture();
        if (picture && picture.tachieActorId !== 0) {
            this.bitmap = $gameTemp.getActorBitmapCache(picture.tachieActorId);
            this.redrawActorImage();
        } else {
            _Sprite_Picture_loadBitmap.call(this);
        }
    }
    protected redrawActorImage(): void {
        var picture = this.picture();
        if (! picture) {
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
    }
    drawActorImage(actor: Game_Actor, bitmap: Bitmap): void {
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
    }
    protected drawCache(cache: Bitmap): void {
        this.bitmap.blt(cache, 0, 0, cache.width, cache.height, 0, 0);
        //this.bitmap._context.putImageData(cache._context.getImageData(0, 0, cache.width, cache.height), 0, 0);
    }
    protected drawTachieFile(file: string, bitmap: Bitmap, actor: Game_Actor): void {
        if (useTextureAtlas) {
            this.drawTachieTextureAtlas(file, bitmap, actor);
        } else {
            this.drawTachieImage(file, bitmap, actor);
        }
    }
    protected drawTachieTextureAtlas(file: string, bitmap: Bitmap, actor: Game_Actor): void {
        var texture = PIXI.TextureCache[file + '.png'];
        if (! texture) {
            return;
        }
        var img = texture.baseTexture.source;
        var rect = texture.frame;
        var trim = texture.trim;
        var crop = texture.crop;
        var dx = trim.x + actor.tachieOffsetX;
        var dy = trim.y + actor.tachieOffsetY;
        bitmap._context.drawImage(img, rect.x, rect.y, crop.width, crop.height, dx, dy, crop.width, crop.height);
    }
    protected drawTachieImage(file: string, bitmap: Bitmap, actor: Game_Actor): void {
        var img: Bitmap = ImageManager.loadTachie(file);
        if (! img.isReady()) {
            console.log('draw' + file)
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
    }
    protected drawOuterBack(actor: Game_Actor, bitmap: Bitmap): void {
        if (! actor.hasOuter()) {
            return;
        }
        var file = actor.baseId + 'out_' + actor.outerId + '_back_' + actor.poseId;
        this.drawTachieFile(file, bitmap, actor);
    }
    protected drawOuterShadow(actor: Game_Actor, bitmap: Bitmap): void {
        if (! actor.hasOuter()) {
            return;
        }
        var file = actor.baseId + 'out_' + actor.outerId + '_shadow_' + actor.poseId;
        this.drawTachieFile(file, bitmap, actor);
    }
    protected drawOuterMain(actor: Game_Actor, bitmap: Bitmap): void {
        if (! actor.hasOuter()) {
            return;
        }
        var file = actor.baseId + 'out_' + actor.outerId + '_main_' + actor.poseId;
        this.drawTachieFile(file, bitmap, actor);
    }
    protected drawOuterFront(actor: Game_Actor, bitmap: Bitmap): void {
        if (! actor.hasOuter()) {
            return;
        }
        var file = actor.baseId + 'out_' + actor.outerId + '_front_' + actor.poseId;
        this.drawTachieFile(file, bitmap, actor);
    }
    protected drawBodyBack(actor: Game_Actor, bitmap: Bitmap): void {
        var file = actor.baseId + 'body_' + actor.poseId;
        this.drawTachieFile(file, bitmap, actor);
    }
    protected drawBodyFront(actor: Game_Actor, bitmap: Bitmap): void {
        var file = actor.baseId + 'face_' + actor.poseId;
        this.drawTachieFile(file, bitmap, actor);
    }
    protected drawInnerBottom(actor: Game_Actor, bitmap: Bitmap): void {
        if (! actor.hasInnerBottom()) {
            return;
        }
        var file = actor.baseId + 'in_' + actor.innerBottomId + '_bottom';
        this.drawTachieFile(file, bitmap, actor);
    }
    protected drawInnerTop(actor: Game_Actor, bitmap: Bitmap): void {
        if (! actor.hasInnerTop()) {
            return;
        }
        var file = actor.baseId + 'in_' + actor.innerTopId + '_top';
        this.drawTachieFile(file, bitmap, actor);
    }
    protected drawHoppe(actor: Game_Actor, bitmap: Bitmap): void {
        if (actor.hoppeId === 0) {
            return;
        }
        var file = actor.baseId + 'hoppe';
        this.drawTachieFile(file, bitmap, actor);
    }
    protected drawFace(actor: Game_Actor, bitmap: Bitmap): void {
        var file = actor.baseId + actor.faceId;
        this.drawTachieFile(file, bitmap, actor);
    }
}

class Window_MessageName extends Window_Base {
    constructor() {
        var width = 180;
        var height = this.windowHeight();
        var x = 30;
        var y = 430;
        console.log(width)
        console.log(height)
        super(x, y, width, height);

        this.padding = 8;
        this.openness = 0;
    }
    windowHeight(): number {
        return this.fittingHeight(1) + 14;
    }
    standardPadding(): number {
        return 0;
    }
    draw(name): void {
        this.width = name.length * 34 + 30;
        this.contents.clear();
        this.drawText(name, 8, 0, 160);
        this.open();
    }
}

class Sprite_WindowBalloon extends Sprite_Base {
    update(): void {
        super.update();
        this.updateBitmap();
    }
    updateBitmap(): void {
        this.bitmap = ImageManager.loadSystem('WindowBaloon1');
    }
}

class _Bitmap extends Bitmap {

}



class Window_TachieMessage extends Window_Message {
    protected _messageNameWindow: Window_MessageName;
    protected _balloonSprite: Sprite_WindowBalloon;
    protected _windowSkilId: number;
    numVisibleRows(): number {
        return 3;
    }
    subWindows(): Array<Window_Base> {
        var ret = super.subWindows();
        ret.push(this._messageNameWindow]);
        return ret;
    }
    createSubWindows(): void {
        super.createSubWindows();
        this._messageNameWindow = new Window_MessageName();
        this._balloonSprite = new Sprite_WindowBalloon();
        this._balloonSprite.x = 300;
        this._balloonSprite.y = -39;
        this.addChild(this._balloonSprite);
    }
    update(): void {
        super.update();
        if (this._windowSkilId !== 1) {
            this._windowSkilId = 1;
            this.windowskin = ImageManager.loadSystem('Window1');
        }
    }
    startMessage(): void {
        super.startMessage();
        this._messageNameWindow.draw('トモコ');
    }
    updatePlacement(): void {
        this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    }
    isAnySubWindowActive(): boolean {
        return false;
    }
    terminateMessage(): void {
        this.close();
        $gameMessage.clear();
    }
}

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
Scene_Map.prototype.createMessageWindow = function() {
    _Scene_Map_createMessageWindow.call(this);
    this._tachieMessageWindow = new Window_TachieMessage();
    this._originalMessageWindow = this._messageWindow;

    this.addWindow(this._tachieMessageWindow);
    this._windowLayer.removeChild(this._originalMessageWindow );
    this._messageWindow = this._tachieMessageWindow;
    this._messageWindow.subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
};

var applyMyMethods = (myClass: any, presetClass: any, applyConstructor?: boolean) => {
    for (var p in myClass.prototype) {
        if (myClass.prototype.hasOwnProperty(p)) {
            if (p === 'constructor' && ! applyConstructor) { continue; }
            Object.defineProperty(presetClass.prototype, p, Object.getOwnPropertyDescriptor(myClass.prototype,p));
            //presetClass.prototype[p] = myClass.prototype[p];
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

}


interface Scene_Map {
    openNameMessage(name: string): void;
    closeNameMessage(): void;
}

interface Game_Picture {
    tachieActorId: number;
    tachieRefreshFlag: boolean;
}
interface Game_Temp {
    getActorBitmapCache(actorId: number): Bitmap;
    getActorBitmapBodyCache(actorId: number): Bitmap;
}
interface Game_Item {
    isOuter(): boolean;
    isInnerTop(): boolean;
    isInnerBottom(): boolean;
    outerId(): string;
    innerTopId(): string;
    innerBottomId(): string;
}

interface Game_Actor {
    readonly poseId: number;
    readonly faceId: string;
    readonly hoppeId: number;
    readonly outerItemId: number;
    readonly innerTopItemId: number;
    readonly innerBottomItemId: number;
    readonly baseId: string;
    readonly outerId: string;
    readonly innerBottomId: string;
    readonly innerTopId: string;
    readonly tachieOffsetX: number;
    readonly tachieOffsetY: number;


    isDirty(): boolean;
    setDirty(): void;
    clearDirty(): void;
    castOffOuter(): void;
    castOffInnerBottom(): void;
    castOffInnerTop(): void;
    isCastOffOuter(): boolean;
    isCastOffInnerTop(): boolean;
    isCastOffInnerBottom(): boolean;
    tachieArrayString(): string;
    hasOuter(): boolean;
    hasInnerBottom(): boolean;
    hasInnerTop(): boolean;
    setFaceId(n: number): void;
    setOuterId(newId: number): void;
    setInnerTopId(newId: number): void;
    setInnerBottomId(newId: number): void;
    setHoppeId(n: number): void;
    setPoseId(n: number): void;
}
interface ImageManager {
    loadTachie(file: string, hue?: number): Bitmap;
}
