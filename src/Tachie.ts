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

const parameters = PluginManager.parameters('Tachie');
export const offsetX = {};
export const offsetY = {};
export const RIGHT_POS_OFFSET_X = 400;

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
export const DEFAULT_PICTURE_ID1: number = 12;
export const DEFAULT_PICTURE_ID2: number = 11;
const ACTOR_PREFIX: string = '___actor';

export const LEFT_POS = 1;
export const RIGHT_POS = 2;

export const MESSAGE_SKIP_KEY: string = 'control';
export const WINDOW_HIDE_KEY: string = 'shift';

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
            const picture1 = $gameScreen.picture(DEFAULT_PICTURE_ID1);
            const picture2 = $gameScreen.picture(DEFAULT_PICTURE_ID2);
            let commands: Array<RPG.EventCommand> = [];
            if (picture1 && picture1.opacity() > 0) {
                const c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [DEFAULT_PICTURE_ID1,
                                            0, 0, 0, picture1.x(), picture1.y(), 100, 100, 0, 0, 30, false]};
                commands.push(c);
            }
            if (picture2 && picture2.opacity() > 0) {
                const c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [DEFAULT_PICTURE_ID2,
                                            0, 0, 0, picture2.x(), picture2.y(), 100, 100, 0, 0, 20, false]};
                commands.push(c);
            }
            if (commands.length > 0) {
                commands[0]['parameters'][11] = true;
            }
            for (const c of commands) {
                this._list.splice(this._index + 1, 0, c);
            }
            const c2: RPG.EventCommand = {'code': 356, 'indent': this._indent, 'parameters': [`Tachie clear`]};
            this._list.splice(this._index + 1 + commands.length, 0, c2);
            }
            break;
        case 'clear':
            {
            const picture1 = $gameScreen.picture(DEFAULT_PICTURE_ID1);
            const picture2 = $gameScreen.picture(DEFAULT_PICTURE_ID2);
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
            var actorId: number = parseInt(args[1]);
            var x: number = parseInt(args[2] || '0');
            var y: number = parseInt(args[3] || '0');
            var opacity: number = parseInt(args[4] || '255');
            this.tachiePictureCommnad(args[0], actorId, x, y, opacity);
            break;
        case 'face':
        case 'pose':
        case 'hoppe':
        case 'outer':
        case 'innerTop':
        case 'innerBottom':
            {
            const actor = $gameActors.actor(parseInt(args[1]));
            if (! actor) {
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
            const actor = $gameActors.actor(parseInt(args[1]));
            actor.preloadTachie();
            }
            break;
        case 'preloadFaces':
            {
                const actor = $gameActors.actor(parseInt(args[1]));
                args.splice(0, 2);
                actor.preloadFaces(args);
            }
            break;
        default:
            console.error(args[0]);
        }
    }
    tachiePictureCommnad(command: string, actorId: number, x: number, y: number, opacity: number): void {
        switch (command) {
        case 'showLeft':
            $gameTemp.tachieActorId = actorId;
            $gameTemp.tachieActorPos = LEFT_POS;
            if (opacity < 255) {
                const picture = $gameScreen.picture(DEFAULT_PICTURE_ID1);
                if (picture && picture.tachieActorId === actorId) {
                    opacity = 255;
                }
            }
            $gameScreen.showPicture(DEFAULT_PICTURE_ID1, ACTOR_PREFIX + actorId, 0, x, y, 100, 100, opacity, 0);
            if (opacity < 255) {
                var c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [DEFAULT_PICTURE_ID1, 0, 0, 0, x, y, 100, 100, 255, 0, 15, true]};
                this._list.splice(this._index + 1, 0, c);
            }
            break;
        case 'showRight':
            $gameTemp.tachieActorId = actorId;
            $gameTemp.tachieActorPos = RIGHT_POS;
            const picId = DEFAULT_PICTURE_ID2;
            const picture = $gameScreen.picture(picId);
            if (picture && picture.tachieActorId === actorId) {
                opacity = 255;
            }
            const xx = x + RIGHT_POS_OFFSET_X;
            $gameScreen.showPicture(picId, ACTOR_PREFIX + actorId, 0, xx, y, 100, 100, opacity, 0);
            if (opacity < 255) {
                var c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [picId, 0, 0, 0, xx, y, 100, 100, 255, 0, 15, true]};
                this._list.splice(this._index + 1, 0, c);
            }
            break;
        }
    }
    tachieActorCommnad(actor: Game_Actor, command: string, arg2: string): void {
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
            if (! outer.isOuter()) {
                throw new Error('Armor ID ' + outerId + 'はアウターではありません' + JSON.stringify($dataArmors[outerId].meta));
            }
            actor.setOuterItemId(outerId);
            break;
        case 'innerTopItem':
            var innerTopId = parseInt(arg2);
            var innerTop = new Game_Item($dataArmors[innerTopId]);
            if (! innerTop.isInnerTop()) {
                throw new Error('Armor ID ' + innerTopId + 'はインナートップではありません' + JSON.stringify($dataArmors[innerTopId].meta));
            }
            actor.setInnerTopItemId(innerTopId);
            break;
        case 'innerBottomItem':
            var innerBottomId = parseInt(arg2);
            var innerBottom = new Game_Item($dataArmors[innerBottomId]);
            if (! innerBottom.isInnerBottom()) {
                throw new Error('Armor ID ' + innerBottomId + 'はインナーボトムではありません' + JSON.stringify($dataArmors[innerBottomId].meta));
            }
            actor.setInnerBottomItemId(innerBottomId);
            break;
        }
    }
    validateCosId(id: string) {
        var re = /[a-z]/;
        if (! re.exec(id)) {
            throw new Error('コスチュームIDが不正です:' + id);
        }
    }
}

Game_Interpreter.prototype.setup = function(list, eventId) {
    this.clear();
    this._mapId = $gameMap.mapId();
    this._eventId = eventId || 0;
    this._list = [];
    for (const c of list) {
        this._list.push(c);
    }
};

ImageManager.loadTachie = function(filename: string, hue?: number) {
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
    protected _cacheChanged: boolean;

    protected _outerId: string;
    protected _innerTopId: string;
    protected _innerBottomId: string;
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
    }
    get innerBottomId(): string {
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
    }
    get innerTopId(): string {
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
    get tachieOffsetY(): number {
        return offsetY[this.actorId()] || 0;
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
        this.setCacheChanged();
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
    isCacheChanged(): boolean {
        return this._cacheChanged;
    }
    setCacheChanged(): void {
        this._cacheChanged = true;
        this.setDirty();
    }
    clearCacheChanged(): void {
        this._cacheChanged = false;
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
        this.setCacheChanged();
    }
    castOffInnerTop(): void {
        if (this._castOffInnerTop) {
            return;
        }
        this._castOffInnerTop = true;
        this.setCacheChanged();
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
        this.setCacheChanged();
    }
    setOuterId(newId: string): void {
        if (this._outerId === newId) {
            return;
        }
        this._outerId = newId;
        this.setCacheChanged();
    }
    setOuterItemId(newId: number): void {
        if (this._outerItemId === newId) {
            return;
        }
        this._outerItemId = newId;
        this.setCacheChanged();
    }
    setInnerBottomId(newId: string): void {
        if (this._innerBottomId === newId) {
            return;
        }
        this._innerBottomId = newId;
        this.setCacheChanged();
    }
    setInnerBottomItemId(newId: number): void {
        if (this._innerBottomItemId === newId) {
            return;
        }
        this._innerBottomItemId = newId;
        this.setCacheChanged();
    }
    setInnerTopId(newId: string): void {
        if (this._innerTopId === newId) {
            return;
        }
        this._innerTopId = newId;
        this.setCacheChanged();
    }
    setInnerTopItemId(newId: number): void {
        if (this._innerTopItemId === newId) {
            return;
        }
        this._innerTopItemId = newId;
        this.setCacheChanged();
    }
    preloadTachie(): void {
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
    }
    preloadFaces(faceIds: Array<string>): void {
        for (const faceId of faceIds) {
            this.doPreloadTachie(this.baseId + faceId.padZero(2));
        }
    }
    doPreloadTachie(file: string): void {
        if (! file) {
            return;
        }
        ImageManager.loadTachie(file);
    }
    outerBackFile(): string {
        return this.baseId + 'out_' + this.outerId + '_back_' + this.poseId;
    }
    outerShadowFile(): string {
        if (! this.hasOuter()) {
            return null;
        }
        return this.baseId + 'out_' + this.outerId + '_shadow_' + this.poseId;
    }
    outerMainFile(): string {
        if (! this.hasOuter()) {
            return null;
        }
        return this.baseId + 'out_' + this.outerId + '_main_' + this.poseId;
    }
    outerFrontFile(): string {
        if (! this.hasOuter()) {
            return null;
        }
        return this.baseId + 'out_' + this.outerId + '_front_' + this.poseId;
    }
    bodyBackFile(): string {
        return this.baseId + 'body_' + this.poseId;
    }
    bodyFrontFile(): string {
        return this.baseId + 'face_' + this.poseId;
    }
    innerBottomFile(): string {
        if (! this.hasInnerBottom()) {
            return null;
        }
        return this.baseId + 'in_' + this.innerBottomId + '_bottom';
    }
    innerTopFile(): string {
        if (! this.hasInnerTop()) {
            return null;
        }
        return this.baseId + 'in_' + this.innerTopId + '_top';
    }
    hoppeFile(): string {
        if (this.hoppeId === 0) {
            return null;
        }
        return this.baseId + 'hoppe';
    }
    faceFile(): string {
        return this.baseId + this.faceId;
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

const _ImageManager_isReady = ImageManager.isReady;
ImageManager.isReady = function() {
    for (var key in this._cache) {
        var bitmap = this._cache[key];
        if (bitmap.isError()) {
            if (bitmap.url.indexOf('tachie') >= 0) {
                console.error('Failed to load: ' + bitmap.url);
                this._cache[key] = new Bitmap();
                continue;
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
        return this.actorBitmapBodyCache[actorId];
    }
    getPictureBitmapCache(actorId: number): Bitmap {
        this.actorBitmapCache = this.actorBitmapCache || {};
        if (! this.actorBitmapCache[actorId]) {
            this.actorBitmapCache[actorId] = new Bitmap(Graphics.width / 2 + 100, Graphics.height);
        }
        return this.actorBitmapCache[actorId];
    }
}



class _Game_Screen extends Game_Screen {
    showActorPicture(actorId: number, pictureId: number, x: number, y: number): void {
        var name = ACTOR_PREFIX + actorId;
        this.showPicture(pictureId, name, 0, x, y, 1, 1, 1, 0);
    }
    getPictureId(picture: Game_Picture): number {
        for (var i = 0; i < this._pictures.length; i++) {
            if (this._pictures[i] === picture) {
                return i;
            }
        }
        console.error('picture not found.' + picture);
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
            this.bitmap = $gameTemp.getPictureBitmapCache($gameScreen.getPictureId(picture));
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
        var bitmap = $gameTemp.getPictureBitmapCache($gameScreen.getPictureId(picture));
        this.drawActorImage(actor, bitmap);
    }
    drawActorImage(actor: Game_Actor, bitmap: Bitmap): void {
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
    }
    protected drawCache(cache: Bitmap): void {
        this.bitmap.blt(cache, 0, 0, cache.width, cache.height, 0, 0);
        //this.bitmap._context.putImageData(cache._context.getImageData(0, 0, cache.width, cache.height), 0, 0);
    }
    protected drawTachieFile(file: string, bitmap: Bitmap, actor: Game_Actor): void {
        if (! file) {
            return;
        }
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
        bitmap.context.drawImage(img, rect.x, rect.y, crop.width, crop.height, dx, dy, crop.width, crop.height);
    }
    protected drawTachieImage(file: string, bitmap: Bitmap, actor: Game_Actor): void {
        var img: Bitmap = ImageManager.loadTachie(file);
        if (! img.isReady()) {
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
    }
    protected drawOuterBack(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.outerBackFile(), bitmap, actor);
    }
    protected drawOuterShadow(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.outerShadowFile(), bitmap, actor);
    }
    protected drawOuterMain(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.outerMainFile(), bitmap, actor);
    }
    protected drawOuterFront(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.outerFrontFile(), bitmap, actor);
    }
    protected drawBodyBack(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.bodyBackFile(), bitmap, actor);
    }
    protected drawBodyFront(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.bodyFrontFile(), bitmap, actor);
    }
    protected drawInnerBottom(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.innerBottomFile(), bitmap, actor);
    }
    protected drawInnerTop(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.innerTopFile(), bitmap, actor);
    }
    protected drawHoppe(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.hoppeFile(), bitmap, actor);
    }
    protected drawFace(actor: Game_Actor, bitmap: Bitmap): void {
        var file = actor.baseId + actor.faceId;
        this.drawTachieFile(file, bitmap, actor);
    }
}

class Window_MessageName extends Window_Base {
    constructor() {
        var width = 180;
        var height = super.fittingHeight(1) + 14;
        var x = 30;
        var y = 430;
        super(x, y, width, height);

        this.padding = 8;
        this.openness = 0;
    }
    standardPadding(): number {
        return 0;
    }
    draw(name): void {
        if (! name) {
            this.visible = false;
            return;
        }
        this.width = this.convertEscapeCharacters(name).length * 28 + 40;
        this.contents.clear();
        this.drawTextEx(name, 10, 0);
        this.open();
    }
}

class Sprite_WindowBalloon extends Sprite_Base {
    protected _balloonColorId: number;
    protected _windowSkinId: number;
    protected _messageWindow: Window_TachieMessage;
    constructor(messageWindow: Window_TachieMessage) {
        super();
        this._messageWindow = messageWindow;
    }
    update(): void {
        super.update();
        this.updateBitmap();
        this.updatePosition();
    }
    updateBitmap(): void {
        if (this._balloonColorId === $gameTemp.tachieActorId) {
            return;
        }
        if ($gameTemp.tachieActorId > 0) {
            if (! this._messageWindow.isOpen()) {
                this.visible = false;
                return;
            }
            this._windowSkinId = $gameTemp.tachieActorId;
            this.bitmap = ImageManager.loadSystem('WindowBaloon' + $gameTemp.tachieActorId);
            this.visible = true;
        } else {
            this.visible = false;
            this._windowSkinId = 0;
        }
    }
    updatePosition(): void {
        if ($gameTemp.tachieActorPos === LEFT_POS) {
            this.scale.x = 1;
            this.x = 300;
        } else if ($gameTemp.tachieActorPos === RIGHT_POS) {
            this.scale.x = -1;
            this.x = 500;
        }
    }
}


class Window_TachieMessage extends Window_Message {
    protected _messageNameWindow: Window_MessageName;
    protected _balloonSprite: Sprite_WindowBalloon;
    protected _windowSkilId: number;
    protected _triggered: boolean;
    protected _windowHide: boolean;
    constructor() {
        super();
    }
    contentsHeight() {
        return this.height ;
    };
    numVisibleRows(): number {
        return 3;
    }
    _refreshContents(): void {
        this._windowContentsSprite.move(this.padding + 6, 0);
    };
    _updateContents(): void {
        var w = this._width - this._padding * 2;
        var h = this._height - 0 * 2;
        if (w > 0 && h > 0) {
            this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
            this._windowContentsSprite.visible = this.isOpen();
        } else {
            this._windowContentsSprite.visible = false;
        }
    }
    subWindows(): Array<Window_Base> {
        var ret = super.subWindows();
        ret.push(this._messageNameWindow);
        return ret;
    }
    createSubWindows(): void {
        super.createSubWindows();
        this._messageNameWindow = new Window_MessageName();
        this._balloonSprite = new Sprite_WindowBalloon(this);
        this._balloonSprite.y = -39;
        this.addChild(this._balloonSprite);
    }
    update(): void {
        super.update();
        if (this._windowSkilId !== $gameTemp.tachieActorId) {
            if ($gameTemp.tachieActorId > 0) {
                this._windowSkilId = $gameTemp.tachieActorId;
                this.windowskin = ImageManager.loadSystem('Window' + $gameTemp.tachieActorId);
            } else {
                this._windowSkilId = 0;
                this.windowskin = ImageManager.loadSystem('Window');
                $gameTemp.tachieActorId = 0;
            }
        }
        if (this.isClosing() && this.openness < 240) {
            this._balloonSprite.visible = false;
            this._messageNameWindow.close();
        } else if (this.openness >= 255) {
            this._balloonSprite.visible = true;
        }
        if (! $gameTemp.tachieAvairable && ! $gameMessage.isBusy() && this.isOpen()) {
            this.close();
        }
        this.updateMessageSkip();
        this.updateWindowVisibility();
    }
    updateMessageSkip(): void {
        if (Input.isPressed(MESSAGE_SKIP_KEY)) {
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
    }
    updateWindowVisibility(): void {
        if (Input.isTriggered(WINDOW_HIDE_KEY)) {
            this.changeWindowVisibility();
        } else if (this._windowHide && Input.isTriggered('ok')) {
            this.changeWindowVisibility();
        }
    }
    changeWindowVisibility(): void {
        this._windowHide = ! this._windowHide;
        if (this._windowHide && this.visible) {
            this.visible = false;
            this._messageNameWindow.visible = false;
            for (const window of this.subWindows()) {
                window.visible = false;
            }
        } else {
            this.visible = true;
            if ($gameTemp.tachieName) {
                this._messageNameWindow.visible = true;
            }
            for (const window of this.subWindows()) {
                window.visible = true;
            }
        }
    }
    isTriggered(): boolean {
        const ret = super.isTriggered() || this._triggered;
        this._triggered = false;
        return ret;
    }
    open(): void {
        super.open();
        this._messageNameWindow.close();
    }
    startMessage(): void {
        super.startMessage();
        this._textState.y = this.standardPadding();
        this._balloonSprite.visible = true;
        this._messageNameWindow.draw($gameTemp.tachieName);
    }
    updatePlacement(): void {
        this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    }
    /*isAnySubWindowActive(): boolean {
        return false;
    }*/
    terminateMessage(): void {
        $gameMessage.clear();
        if ($gameTemp.tachieAvairable) {
            return;
        }
        this.close();
    }
    textAreaWidth(): number {
        return this.contentsWidth() + 20;
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


Saba.applyMyMethods(_Game_Interpreter, Game_Interpreter);
Saba.applyMyMethods(_Sprite_Picture, Sprite_Picture);
Saba.applyMyMethods(_Game_Item, Game_Item);
Saba.applyMyMethods(_Game_Actor, Game_Actor);
Saba.applyMyMethods(_Game_Screen, Game_Screen);
Saba.applyMyMethods(_Game_Picture, Game_Picture);
Saba.applyMyMethods(_Game_Temp, Game_Temp);

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
    getPictureBitmapCache(actorId: number): Bitmap;
    getActorBitmapBodyCache(actorId: number): Bitmap;
    tachieName: string;
    tachieActorId: number;
    tachieActorPos: number;
    tachieAvairable: boolean;   // これが true の時はメッセージウィンドウを閉じません
}
interface Game_Item {
    isOuter(): boolean;
    isInnerTop(): boolean;
    isInnerBottom(): boolean;
    outerId(): string;
    innerTopId(): string;
    innerBottomId(): string;
}

interface Game_Screen {
    showActorPicture(actorId: number, pictureId: number, x: number, y: number): void;
    getPictureId(picture: Game_Picture): number;
}
interface Game_Actor {
    /** [read-only]  */
    poseId: number;
    /** [read-only]  */
    faceId: string;
    /** [read-only]  */
    hoppeId: number;
    /** [read-only]  */
    outerItemId: number;
    /** [read-only]  */
    innerTopItemId: number;
    /** [read-only]  */
    innerBottomItemId: number;
    /** [read-only]  */
    baseId: string;
    /** [read-only]  */
    outerId: string;
    /** [read-only]  */
    innerBottomId: string;
    /** [read-only]  */
    innerTopId: string;
    /** [read-only]  */
    tachieOffsetX: number;
    /** [read-only]  */
    tachieOffsetY: number;


    isDirty(): boolean;
    setDirty(): void;
    clearDirty(): void;
    isCacheChanged(): boolean;
    setCacheChanged(): void;
    clearCacheChanged(): void;
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
    setOuterId(newId: string): void;
    setInnerTopId(newId: string): void;
    setInnerBottomId(newId: string): void;
    setOuterItemId(newId: number): void;
    setInnerTopItemId(newId: number): void;
    setInnerBottomItemId(newId: number): void;
    setHoppeId(n: number): void;
    setPoseId(n: number): void;
    preloadTachie(): void;
    outerBackFile(): string;
    outerShadowFile(): string;
    outerMainFile(): string;
    outerFrontFile(): string;
    bodyBackFile(): string;
    bodyFrontFile(): string;
    innerBottomFile(): string;
    innerTopFile(): string;
    hoppeFile(): string;
    faceFile(): string;
    preloadFaces(faceIds: Array<string>): void;
}
interface ImageManager {
    loadTachie(file: string, hue?: number): Bitmap;
}
