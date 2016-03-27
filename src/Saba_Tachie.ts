//=============================================================================
// Saba_Tachie.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc 立ち絵を簡単に表示するプラグインです。別途画像が必要です
 *
 *
 * @param rightPosX
 * @desc 右側に立つ場合のx座標です
 * @default 400
 *
 * @param actor1offset
 * @desc アクター１のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor2offset
 * @desc アクター２のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor3offset
 * @desc アクター３のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor4offset
 * @desc アクター４のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor5offset
 * @desc アクター５のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor6offset
 * @desc アクター６のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor7offset
 * @desc アクター７のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor8offset
 * @desc アクター８のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor9offset
 * @desc アクター９のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param actor10offset
 * @desc アクター10のキャラのx座標，y座標の補正値です
 * @default 0, 0
 *
 * @param balloonEnabled
 * @desc ウィンドウに吹き出しをつける場合、trueにします。
 * @default true
 *
 * @param windowColor
 * @desc 各キャラのウィンドウカラーの配列です(0だとデフォルト色)
 * @default 3, 0, 1, 2, 1
 *
 * @param useTextureAtlas
 * @desc バラバラの画像でなく、一枚のアトラス画像を使うか？ TexturePackerを使い、actor01.png actor01.json などが必要です
 * @default false
 *
 * @param skipKey
 * @desc メッセージスキップに使うボタンです
 * @default control
 *
 * @param windowHideKey
 * @desc ウィンドウ消去に使うボタンです
 * @default shift
 *
 * @requiredAssets img/system/Tachie_Window1
 * @requiredAssets img/system/Tachie_Window2
 * @requiredAssets img/system/Tachie_Window3
 * @requiredAssets img/system/Tachie_Window4
 * @requiredAssets img/system/Tachie_Window5
 * @requiredAssets img/system/Tachie_Window6
 * @requiredAssets img/system/Tachie_Balloon1
 * @requiredAssets img/system/Tachie_Balloon2
 * @requiredAssets img/system/Tachie_Balloon3
 * @requiredAssets img/system/Tachie_Balloon4
 * @requiredAssets img/system/Tachie_Balloon5
 * @requiredAssets img/system/Tachie_Balloon6
 * @requiredAssets img/tachie/actor01_01
 * @requiredAssets img/tachie/*
 * 
 * @help
 * Ver0.14
 *
 * 左側に立つキャラは、pictureId 11 のピクチャで表示しているので、
 * イベントコマンドで pictureId 11 を対象とすることで操作できます。
 *
 * 同様に、右側に立つキャラは、pictureId 12 
 *
 * ■画像の設定方法
 * img/tachie フォルダを使います。
 * ここに、全キャラ分の立ち絵画像を入れてください。
 * ※「未使用ファイルを含まない」には非対応なので、
 * 　手動でコピーしてください。
 *
 * 以下、アクター１の場合の例です。
 * 
 * actor01_<<表情ID>>.png
 * 　→表情
 * actor01_body_<<ポーズID>>.png
 * 　→体
 * actor01_face_<<ポーズID>>.png
 * 　→頭
 * actor01_hoppe.png
 * 　→ほっぺ
 * actor01_in_<<衣装ID>>_bottom.png
 * 　→パンツ
 * actor01_in_<<衣装ID>>_top.png
 * 　→ブラ
 * actor01_out_<<衣装ID>>_front_<<ポーズID>>.png
 * actor01_out_<<衣装ID>>_main_<<ポーズID>>.png
 * actor01_out_<<衣装ID>>_back_<<ポーズID>>.png
 * 　→上着
 *
 * 必要ない場合でも、画像をよみに行ってエラーになる場合があります。
 * その場合、透明な画像を入れておいてください。
 *
 * 
 *
 * プラグインコマンド
 * Tachie showLeft  actorId x y opacity # 立ち絵を左側に表示する
 * Tachie showRight actorId x y opacity # 立ち絵を右側に表示する
 * Tachie hideLeft                      # 左側の立ち絵を非表示にする
 * Tachie hideRight                     # 右側の立ち絵を非表示にする
 * Tachie face      actorId faceId      # アクターの表情を変更する
 * Tachie pose      actorId poseId      # アクターのポーズを変更する
 * Tachie hoppe     actorId hoppeId     # アクターのほっぺを変更する
 * Tachie outer     actorId cosId       # アクターのアウターを変更する
 * Tachie innerTop     actorId cosId    # アクターのブラを変更する
 * Tachie innerBottom  actorId cosId    # アクターのパンツを変更する
 * Tachie preload      actorId          # アクターの現在のコスを事前に読み込んでおく
 * Tachie preloadFaces actorId 1 2 3... # アクターの表情を事前に読み込んでおく
 * Tachie notClose on                   # ウィンドウを閉じないようにする
 * Tachie notClose off                  # ↑を解除する
 * Tachie showName hoge                 # 名前欄に hoge を表示する
 * Tachie hideName                      # 名前欄を非表示にする
 * Tachie clear                         # 立ち絵を全て非表示にする
 * Tachie hideBalloon                   # 一時的に吹き出しを非表示にする
 *
 *
 */
module Saba {
export module Tachie {

const parameters = PluginManager.parameters('Saba_Tachie');
const rightPosX = parseInt(parameters['rightPosX']);
export const windowColors: {[actorId: number]: number} = {};
export const offsetX = {};
export const offsetY = {};

for (let i = 1; i <= 10; i++) {
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

for (let i = 0; i < 99; i++) {
    windowColors[i + 1] = 0;
}
var colors = String(parameters['windowColor']).split(',');
for (let i = 0; i < colors.length; i++) {
    var color = parseInt(colors[i]);
    if (! isNaN(color)) {
        windowColors[i + 1] = color;
    }
}

const balloonEnabled = parameters['balloonEnabled'] === 'true';

var useTextureAtlas = parameters['useTextureAtlas'] === 'true';
export const DEFAULT_PICTURE_ID1: number = 11;
export const DEFAULT_PICTURE_ID2: number = 12;
const ACTOR_PREFIX: string = '___actor';

export const LEFT_POS = 1;
export const RIGHT_POS = 2;

export const MESSAGE_SKIP_KEY: string = parameters['skipKey'];
export const WINDOW_HIDE_KEY: string = parameters['windowHideKey'];

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
        case 'hideBalloon':
            $gameTemp.hideBalloon = true;
            break;
        case 'preloadPicture':
            ImageManager.loadPicture(args[1]);
            break;
        case 'clearWindowColor':
            $gameTemp.tachieActorId = 0;
            break;
        case 'windowColor':
            $gameTemp.tachieActorId = parseInt(args[1]);
            break;
        case 'hideLeft':
        {
            const picture1 = $gameScreen.picture(DEFAULT_PICTURE_ID1);
            let commands: Array<RPG.EventCommand> = [];
            if (picture1 && picture1.opacity() > 0) {
                const c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [DEFAULT_PICTURE_ID1,
                                            0, 0, 0, picture1.x(), picture1.y(), 100, 100, 0, 0, 30, true]};
                commands.push(c);
            }
            const c: RPG.EventCommand = {'code': 235, 'indent': this._indent, 'parameters': [DEFAULT_PICTURE_ID1]};
            commands.push(c);
            for (const c of commands) {
                this._list.splice(this._index + 1, 0, c);
            }
            break;
        }
        case 'hideRight':
        {
            const picture2 = $gameScreen.picture(DEFAULT_PICTURE_ID2);
            let commands: Array<RPG.EventCommand> = [];
            if (picture2 && picture2.opacity() > 0) {
                const c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [DEFAULT_PICTURE_ID1,
                                            0, 0, 0, picture2.x(), picture2.y(), 100, 100, 0, 0, 30, true]};
                commands.push(c);
            }
            const c: RPG.EventCommand = {'code': 235, 'indent': this._indent, 'parameters': [DEFAULT_PICTURE_ID2]};
            commands.push(c);
            for (const c of commands) {
                this._list.splice(this._index + 1, 0, c);
            }
            break;
        }
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
            $gameTemp.hideBalloon = false;
            ImageManager.isReady();
            if (! args[1]) {
                console.error(`プラグインコマンド${command}の${args[0]}の引数が足りません。actorId が必要です`);
                return;
            }
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
            if (! args[1]) {
                console.error(`プラグインコマンド${command}の${args[0]}の引数が足りません。actorId が必要です`);
                return;
            }
            const actor = $gameActors.actor(parseInt(args[1]));
            if (! actor) {
                throw new Error('立ち絵コマンド: ' + args[0] + ' の' + args[1] + 'のアクターが存在しません');
            }
            if (args[2] == null) {
                throw new Error('立ち絵コマンド: ' + args[0] + ' の第二引数が存在しません');
            }
            this.tachieActorCommnad(actor, args[0], args[2], args);
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
            const xx = x + rightPosX;
            $gameScreen.showPicture(picId, ACTOR_PREFIX + actorId, 0, xx, y, 100, 100, opacity, 0);
            if (opacity < 255) {
                var c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [picId, 0, 0, 0, xx, y, 100, 100, 255, 0, 15, true]};
                this._list.splice(this._index + 1, 0, c);
            }
            break;
        }
    }
    tachieActorCommnad(actor: Game_Actor, command: string, arg2: string, args): void {
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
            this.validateCosId(args, arg2);
            actor.setOuterId(arg2);
            break;
        case 'innerTop':
            this.validateCosId(args, arg2);
            actor.setInnerTopId(arg2);
            break;
        case 'innerBottom':
            this.validateCosId(args, arg2);
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
    validateCosId(command: any, id: string) {
        var re = /[a-z]/;
        if (! re.exec(id)) {
            throw new Error('コスチュームIDが不正です:' + id + ' command:' + command);
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
    get faceId(): number {
        if (! this._faceId) {
            return 0;
        }
        return this._faceId;
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
        if (useTextureAtlas) {
            if (PIXI.TextureCache[this.bodyFrontFile() + '.png']) {
                // すでに読み込み済み
            } else {
                new PIXI.SpriteSheetLoader('img/tachie/actor' + this.actorId().padZero(2) + '.json', false).load();
            }
        } else {
            this.doPreloadTachie(this.outerBackFile());
            //this.doPreloadTachie(this.outerShadowFile());
            this.doPreloadTachie(this.outerMainFile());
            this.doPreloadTachie(this.outerFrontFile());
            this.doPreloadTachie(this.bodyBackFile());
            this.doPreloadTachie(this.bodyFrontFile());
            this.doPreloadTachie(this.innerBottomFile());
            this.doPreloadTachie(this.innerTopFile());
            this.doPreloadTachie(this.hoppeFile());
            this.doPreloadTachie(this.faceFile());
        }
    }
    preloadFaces(faceIds: Array<string>): void {
        if (useTextureAtlas) {
            return;
        }
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
            this.actorBitmapBodyCache[actorId] = new Bitmap(Graphics.width, Graphics.height);
        }
        return this.actorBitmapBodyCache[actorId];
    }
    getPictureBitmapCache(actorId: number): Bitmap {
        this.actorBitmapCache = this.actorBitmapCache || {};
        if (! this.actorBitmapCache[actorId]) {
            this.actorBitmapCache[actorId] = new Bitmap(Graphics.width, Graphics.height);
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

var TachieDrawerMixin = function() {
    this.drawTachie = function(actorId: number, bitmap: Bitmap, x = 0, y = 0, rect: Rectangle, faceId = 0): void {
        var actor = $gameActors.actor(actorId);
        var point = this.calcTachieActorPos(actor);
        if (! rect) {
            rect = new Rectangle(0, 0, 0, 0);
            x += point.x;
            y += point.y;
        }
        //rect.x += point.x;
        //rect.y += point.y;
        var cache = $gameTemp.getActorBitmapBodyCache(actor.actorId());
        actor.clearDirty();
        if (actor.isCacheChanged()) {
            cache.clear();
            actor.clearCacheChanged();
            this.drawTachieOuterBack(actor, cache);
            this.drawTachieBodyBack(actor, cache);
            this.drawTachieInnerBottom(actor, cache);
            this.drawTachieInnerTop(actor, cache);
            this.drawTachieOuterMain(actor, cache);
            this.drawTachieBodyFront(actor, cache);
            this.drawTachieOuterFront(actor, cache);
            console.log('createCache:' + actor.actorId());
        }
        
        this.drawTachieCache(actor, cache, bitmap, x, y, rect);
        this.drawTachieHoppe(actor, bitmap, x, y, rect);
        this.drawTachieFace(actor, bitmap, x, y, rect, faceId);
    };
    this.calcTachieActorPos = function(actor: Game_Actor): Point {
        var dx = actor.tachieOffsetX;
        var dy = actor.tachieOffsetY;
        if (isNaN(dx)) {
            dx = 0;
        }
        if (isNaN(dy)) {
            dy = 0;
        }
        return new Point(dx, dy);
    };
    this.drawTachieCache = function(actor: Game_Actor, cache: Bitmap, bitmap: Bitmap, x: number, y: number, rect: Rectangle): void {
        var xx = -rect.x < 0 ? 0 : -rect.x;
        var yy = -rect.y < 0 ? 0 : -rect.y;
        var w = rect.width;
        if (w <= 0 || w + xx > cache.width) {
            w = cache.width - xx;
        }
        var h = rect.height;
        if (h <= 0 || h + yy > cache.height) {
            h = cache.height - yy;
        }
        bitmap.blt(cache, xx, yy, w, h, x, y);
        //this.bitmap._context.putImageData(cache._context.getImageData(0, 0, cache.width, cache.height), 0, 0);
    };
    this.drawTachieFile = function(file: string, bitmap: Bitmap, actor: Game_Actor, x = 0, y = 0, rect: Rectangle): void {
        if (! file) {
            return;
        }
        if (! rect) {
            rect = Rectangle.emptyRectangle;
        }
        if (useTextureAtlas) {
            this.drawTachieTextureAtlas(file, bitmap, actor, x, y, rect);
        } else {
            this.drawTachieImage(file, bitmap, actor, x, y, rect);
        }
    };
    this.drawTachieTextureAtlas = function(file: string, bitmap: Bitmap, actor: Game_Actor, x: number, y: number, rect: Rectangle): void {
        var texture = PIXI.TextureCache[file + '.png'];
        if (! texture) {
            return;
        }
        var img = texture.baseTexture.source;
        var frame = texture.frame;
        var trim = texture.trim;
        var crop = texture.crop;
        var w = crop.width;
        if (w < rect.width) {
            w = rect.width;
        }
        var h = crop.height;
        if (h < rect.height) {
            h = rect.height;
        }
        var dx = trim.x + actor.tachieOffsetX + x;
        var dy = trim.y + actor.tachieOffsetY + y;
        bitmap.context.drawImage(img, frame.x + rect.x, frame.y + rect.y, crop.width, crop.height, dx, dy, w, h);
    };
    this.drawTachieImage = function(file: string, bitmap: Bitmap, actor: Game_Actor, x: number, y: number, rect: Rectangle): void {
        var img: Bitmap = ImageManager.loadTachie(file);
        if (! img.isReady()) {
            console.log('draw' + file);
            actor.setDirty();
            return;
        }
        var xx = -rect.x < 0 ? 0 : -rect.x;
        var yy = -rect.y < 0 ? 0 : -rect.y;
        var w = rect.width;
        if (w <= 0 || w + xx > img.width) {
            w = img.width - xx;
        }
        var h = rect.height;
        if (h <= 0 || h + yy > img.height) {
            h = img.height - yy;
        }
        bitmap.blt(img, xx, yy, w, h, x, y);
    };
    this.drawTachieOuterBack = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.outerBackFile(), bitmap, actor);
    };
    this.drawTachieOuterShadow = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.outerShadowFile(), bitmap, actor);
    };
    this.drawTachieOuterMain = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.outerMainFile(), bitmap, actor);
    };
    this.drawTachieOuterFront = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.outerFrontFile(), bitmap, actor);
    };
    this.drawTachieBodyBack = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.bodyBackFile(), bitmap, actor);
    };
    this.drawTachieBodyFront = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.bodyFrontFile(), bitmap, actor);
    };
    this.drawTachieInnerBottom = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.innerBottomFile(), bitmap, actor);
    };
    this.drawTachieInnerTop = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.innerTopFile(), bitmap, actor);
    };
    this.drawTachieHoppe = function(actor: Game_Actor, bitmap: Bitmap, x: number, y: number, rect: Rectangle): void {
        this.drawTachieFile(actor.hoppeFile(), bitmap, actor, x, y, rect);
    };
    this.drawTachieFace = function(actor: Game_Actor, bitmap: Bitmap, x: number, y: number, rect: Rectangle, faceId: number): void {
        if (faceId === 0) {
            faceId = actor.faceId;
        }
        var file = actor.baseId + faceId.padZero(2);
        this.drawTachieFile(file, bitmap, actor, x, y, rect);
    };

};


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
        //var bitmap = $gameTemp.getPictureBitmapCache($gameScreen.getPictureId(picture));
        this.bitmap.clear();
        this.drawTachie(actorId, this.bitmap);
    }
}

TachieDrawerMixin.call(Sprite_Picture.prototype)    
TachieDrawerMixin.call(Window_Base.prototype)    
 

class Window_MessageName extends Window_Base {
    constructor() {
        var width = 180;
        var height = super.fittingHeight(1) + 14;
        var x = 30;
        var y = Graphics.boxHeight - 193;
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
        this.visible = true;
    }
}

class Sprite_WindowBalloon extends Sprite_Base {
    protected _windowAcrotId: number;
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
    showBalloon(): void {
        if (! $gameTemp.tachieName) {
            this.visible = false;
            return;
        }
        if ($gameTemp.hideBalloon) {
            this.visible = false;
            return;
        }
        this.visible = true;
    }
    updateBitmap(): void {
        if (! balloonEnabled) {
            this.visible = false;
            return;
        }
        if (! $gameTemp.tachieName) {
            this.visible = false;
            return;
        }
        if ($gameTemp.hideBalloon) {
            this.visible = false;
            return;
        }
        if (this._windowAcrotId === $gameTemp.tachieActorId) {
            return;
        }
        if ($gameTemp.tachieActorId > 0) {
            if (! this._messageWindow.isOpen()) {
                this.visible = false;
                return;
            }
            this._windowAcrotId = $gameTemp.tachieActorId;
            const color = windowColors[this._windowAcrotId];
            if (color > 0) {
                this.bitmap = ImageManager.loadSystem('Tachie_Balloon' + color);
            } else {
                this.bitmap = ImageManager.loadSystem('Tachie_Balloon');
            }
            this.visible = true;
        } else {
            this.visible = false;
            this._windowAcrotId = 0;
        }
    }
    updatePosition(): void {
        if ($gameTemp.tachieActorPos === LEFT_POS) {
            this.scale.x = 1;
            this.x = Graphics.boxWidth / 2 - 140;
        } else if ($gameTemp.tachieActorPos === RIGHT_POS) {
            this.scale.x = -1;
            this.x = Graphics.boxWidth / 2 + 140;
        }
    }
}


export class Window_TachieMessage extends Window_Message {
    protected _messageNameWindow: Window_MessageName;
    protected _balloonSprite: Sprite_WindowBalloon;
    protected _windowSkinId: number;
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
        if (this._windowSkinId !== $gameTemp.tachieActorId) {
            if ($gameTemp.tachieActorId > 0) {
                this._windowSkinId = $gameTemp.tachieActorId;
                var color = windowColors[this._windowSkinId];
                if (color > 0) {
                    this.windowskin = ImageManager.loadSystem('Tachie_Window' + color);
                } else {
                    this.windowskin = ImageManager.loadSystem('Window');
                }
            } else {
                this._windowSkinId = 0;
                this.windowskin = ImageManager.loadSystem('Window');
                $gameTemp.tachieActorId = 0;
            }
        }
        if (this.isClosing() && this.openness < 240) {
            this._balloonSprite.visible = false;
            this._messageNameWindow.close();
        } else if (this.openness >= 255) {
            this._balloonSprite.showBalloon();
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
        if (BackLog) {
            BackLog.$gameBackLog.addLog($gameTemp.tachieName, $gameMessage.allText());
        }
        this._textState.y = this.standardPadding();
        this._balloonSprite.showBalloon();
        this._messageNameWindow.draw($gameTemp.tachieName);
    }
    updatePlacement(): void {
        this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    }
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


const Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
Scene_Boot.prototype.loadSystemImages = function() {
    Scene_Boot_loadSystemImages.call(this);
    for (const i in windowColors) {
        const colot = windowColors[i];
        ImageManager.loadSystem('Tachie_Window' + color);
    }
};


Saba.applyMyMethods(_Game_Interpreter, Game_Interpreter);
Saba.applyMyMethods(_Sprite_Picture, Sprite_Picture);
Saba.applyMyMethods(_Game_Item, Game_Item);
Saba.applyMyMethods(_Game_Actor, Game_Actor);
Saba.applyMyMethods(_Game_Screen, Game_Screen);
Saba.applyMyMethods(_Game_Picture, Game_Picture);
Saba.applyMyMethods(_Game_Temp, Game_Temp);

}}


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
    hideBalloon: boolean;   // これが true の時は吹き出しを表示しません
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
    faceId: number;
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
interface ImageManagerStatic {
    loadTachie(file: string, hue?: number): Bitmap;
}
interface Window_Base {
    drawTachie(actorId: number, bitmap: Bitmap, x?: number, y?: number, rect?: Rectangle, faceId?: number): void;
}
interface Sprite_Picture {
    drawTachie(actorId: number, bitmap: Bitmap, x?: number, y?: number, rect?: Rectangle, faceId?: number): void;
}