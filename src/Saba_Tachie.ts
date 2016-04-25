//=============================================================================
// Saba_Tachie.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc 立ち絵を簡単に表示するプラグインです。別途画像が必要です
 *
 * @param disablesTachieActorIdList
 * @desc 立ち絵を使わないアクターの ID のリストです。(カンマ区切り。 1, 2, 3...)無駄な読み込みをしないための設定です。
 * @default 0
 * 
 * @param leftPosX
 * @desc 左側に立つ場合のx座標です
 * @default 0
 *
 * @param rightPosX
 * @desc 右側に立つ場合のx座標です
 * @default 400
 *
 * @param centerPosX
 * @desc 中央に立つ場合のx座標です
 * @default 200
 * 
 * @param posY
 * @desc 全員のy座標です
 * @default 0
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
 * @param messageNumLines
 * @desc テキストの行数です
 * @default 3
 * 
 * @param balloonEnabled
 * @desc ウィンドウに吹き出しをつける場合、trueにします。
 * @default true
 *
 * @param windowColor
 * @desc 各キャラのウィンドウカラーの配列です(0だとデフォルト色)
 * @default 3, 0, 1, 2, 1
 *
 * @param enableFaceLayer
 * @desc actor01_face_1.png などのレイヤーを使う場合 trueにします
 * @default true
 *
 * @param enableBodyLayer
 * @desc actor01_body_1.png などのレイヤーを使う場合 trueにします
 * @default true
 *
 * @param enableHairLayer
 * @desc actor01_hair_1.png などのレイヤーを使う場合 trueにします
 * @default true
 *
 * @param enableOuterBackLayer
 * @desc actor01_out_b_back_1.png などのレイヤーを使う場合 trueにします
 * @default true
 *
 * @param enableOuterMainLayer
 * @desc actor01_out_b_main_1.png などのレイヤーを使う場合 trueにします
 * @default true
 *
 * @param enableOuterFrontLayer
 * @desc actor01_out_b_front_1.png などのレイヤーを使う場合 trueにします
 * @default true
 * 
 * @param useTextureAtlas
 * @desc バラバラの画像でなく、一枚のアトラス画像を使うか？ TexturePackerを使い、actor01.png actor01.json などが必要です
 * @default false
 *
 * @param skipKey
 * @desc メッセージスキップに使うボタンです。tab, shift, control, pageup, pagedown などが使えます。
 * @default control
 *
 * @param windowHideKey
 * @desc ウィンドウ消去に使うボタンです。tab, shift, control, pageup, pagedown などが使えます。
 * @default shift
 *
 * @param autoModeKey
 * @desc オートモードのON/OFFに使うボタンです。tab, shift, control, pageup, pagedown などが使えます。
 * @default 
 *
 * @param autoModeDelayPerChar
 * @desc オートモードで、1文字ごとに増える待機時間です(ミリ秒)
 * @default 110
 *
 * @param autoModeDelayCommon
 * @desc オートモードで、1ページで必ず待つ時間です(ミリ秒)。全体の待機時間は autoModeDelayPerChar * 文字数 + autoModeDelayCommon です
 * @default 2000
 *
 * @param autoModeMarkFrameNum
 * @desc オートモードであることを示すマークのアニメ枚数です
 * @default 18
 * 
 * @param autoModeMarkX
 * @desc オートモードであることを示すマークのx座標です
 * @default 770
 *
 * @param autoModeMarkY
 * @desc オートモードであることを示すマークのy座標です
 * @default 115
 *
 * @param inactiveActorTone
 * @desc 喋っていない方のキャラの Tone です
 * @default -80, -80, -80, 0
 *
 * @param toneChangeDuration
 * @desc 喋っていない方のキャラの Tone を変える時の時間です
 * @default 25
 * 
 * @param nameLeft
 * @desc 名前の表示ウィンドウの左の領域です
 * @default 30
 *
 * @param fontSize
 * @desc メッセージウィンドウのフォントサイズです
 * @default 28
 *
 * @param windowMargin
 * @desc メッセージウィンドウの表示位置の空きです。上、右、下、左の順です
 * @default 0, 0, 0, 0
 *
 * @param windowPadding
 * @desc メッセージウィンドウの文字と枠の空きです。上、右、下、左の順です
 * @default 0, 0, 0, 0
 *
 * @param newLineXWithFace
 * @desc 顔グラを表示している時の、テキストの x 座標です
 * @default 168
 *
 * @param messageFacePos
 * @desc 顔グラの表示位置です。x y の順です
 * @default 0, 0
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
 * @requiredAssets img/system/Tachie_Balloon6
 * @requiredAssets img/system/Tachie_Auto
 * @requiredAssets img/tachie/actor01_01
 * @requiredAssets img/tachie/*
 * 
 * @help
 * Ver
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
 * 　→後ろ髪
 * actor01_hair_<<ポーズID>>.png
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
 * Tachie showLeft  actorId x y opacity  # 立ち絵を左側に表示する
 * Tachie showRight actorId x y opacity  # 立ち絵を右側に表示する
 * Tachie showCenter actorId x y opacity # 立ち絵を中央に表示する
 * Tachie hideLeft                      # 左側の立ち絵を非表示にする
 * Tachie hideRight                     # 右側の立ち絵を非表示にする
 * Tachie hideCenter                    # 中央の立ち絵を非表示にする
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
 * Tachie deactivateAll                   # すべてのキャラを暗くします
 *
 * @license
 * Saba_Tachie licensed under the MIT License.
 */
module Saba {
export module Tachie {

const parameters = PluginManager.parameters('Saba_Tachie');
export var leftPosX = parseInt(parameters['leftPosX']);
export var rightPosX = parseInt(parameters['rightPosX']);
export var centerPosX = parseInt(parameters['centerPosX']);
export var posY = parseInt(parameters['posY']);
export var nameLeft = parseInt(parameters['nameLeft']);
export var fontSize = parseInt(parameters['fontSize']);
export var newLineXWithFace = parseInt(parameters['newLineXWithFace']);
export var windowMargin = Saba.toIntArrayByStr(parameters['windowMargin'], 4);
export var windowPadding = Saba.toIntArrayByStr(parameters['windowPadding'], 4);
export var inactiveActorTone = Saba.toIntArrayByStr(parameters['inactiveActorTone'], 4);
export var disabledTachieActorIdList = Saba.toIntArrayByStr(parameters['disablesTachieActorIdList']);
export var toneChangeDuration = parseInt(parameters['toneChangeDuration']);
export var windowColors: {[actorId: number]: number} = {};
export var offsetX = {};
export var offsetY = {};

export var messageFacePosStr = parameters['messageFacePos'].split(',');
export var messageFaceX = parseInt(messageFacePosStr[0]);
export var messageFaceY = parseInt(messageFacePosStr[1]);

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
var colors = parameters['windowColor'].split(',');
for (let i = 0; i < colors.length; i++) {
    var color = parseInt(colors[i]);
    if (! isNaN(color)) {
        windowColors[i + 1] = color;
    }
}

export var MESSAGE_NUM_LINES = parseIntValue(parameters['messageNumLines'], 3);
export var AUTO_MODE_DELAY_COMMON = parseIntValue(parameters['autoModeDelayCommon'], 2500);
export var AUTO_MODE_DELAY_PER_CHAR = parseIntValue(parameters['autoModeDelayPerChar'], 120);
export var AUTO_MODE_MARK_TOTAL_FRAME = parseInt(parameters['autoModeMarkFrameNum']);
export var AUTO_MODE_MARK_X = parseInt(parameters['autoModeMarkX']);
export var AUTO_MODE_MARK_Y = parseInt(parameters['autoModeMarkY']);
export var balloonEnabled = parameters['balloonEnabled'] === 'true';
const enableFaceLayer = parameters['enableFaceLayer'] === 'true';
const enableBodyLayer = parameters['enableBodyLayer'] === 'true';
const enableHairLayer = parameters['enableHairLayer'] === 'true';
const enableOuterBackLayer = parameters['enableOuterBackLayer'] === 'true';
const enableOuterMainLayer = parameters['enableOuterMainLayer'] === 'true';
const enableOuterFrontLayer = parameters['enableOuterFrontLayer'] === 'true';
const useTextureAtlas = parameters['useTextureAtlas'] === 'true';
export const DEFAULT_PICTURE_ID1: number = 11;  // 左
export const DEFAULT_PICTURE_ID2: number = 12;  // 右
export const DEFAULT_PICTURE_ID3: number = 13;  // センター
export const PICTURES = [DEFAULT_PICTURE_ID1, DEFAULT_PICTURE_ID2, DEFAULT_PICTURE_ID3];
const ACTOR_PREFIX: string = '___actor';

export const LEFT_POS = 1;
export const RIGHT_POS = 2;
export const CENTER_POS = 3;

export const MESSAGE_SKIP_KEY: string = parameters['skipKey'];
export const WINDOW_HIDE_KEY: string = parameters['windowHideKey'];
export const AUTO_MODE_KEY: string = parameters['autoModeKey'];

// ステートのメモ欄で、立ち絵のポーズを指定する時のキーです。
const TACHIE_POSE_META_KEY = 'tachiePoseId';
// ステートのメモ欄で、立ち絵の表情を指定する時のキーです。
const TACHIE_FACE_META_KEY = 'tachieFaceId';

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
var _Game_Picture_initTarget = Game_Picture.prototype.initTarget;
var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
var _Game_Actor_addNewState = Game_Actor.prototype.addNewState;
var _Game_Actor_clearStates = Game_Actor.prototype.clearStates;
var _Game_Actor_eraseState = Game_Actor.prototype.eraseState;

var DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    DataManager_extractSaveContents.call(this, contents);
    for (let actor of $gameParty.members()) {
        actor.setCacheChanged();
    }
}

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
            $gameTemp.tachieWindowColorId = 0;
            $gameTemp.tachieActorId = 0;
            break;
        case 'windowColor':
            $gameTemp.tachieWindowColorId = parseInt(args[1]);
            break;
        case 'inactiveAll':     // 後方互換用
        case 'deactivateAll':
            for (let pictureId of PICTURES) {
                const picture = $gameScreen.picture[pictureId];
                if (picture && picture.name() != '') {
                    let c: RPG.EventCommand = {'code': 234, 'indent': this._indent, 'parameters': [pictureId, inactiveActorTone, toneChangeDuration, false]};
                    this._list.splice(this._index + 1, 0, c);
                }
            }
            break;
        case 'hideLeft':
            this.hidePicture(DEFAULT_PICTURE_ID1);
            break;
        case 'hideRight':
            this.hidePicture(DEFAULT_PICTURE_ID2);
            break;
        case 'hideCenter':
            this.hidePicture(DEFAULT_PICTURE_ID3);
            break;
        case 'hide':
            {
            let commands: Array<RPG.EventCommand> = [];
            for (let pictureId of PICTURES) {
                const picture = $gameScreen.picture(pictureId);
                if (picture && picture.opacity() > 0) {
                    const c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [pictureId,
                                                0, 0, 0, picture.x(), picture.y(), 100, 100, 0, 0, 30, false]};
                    commands.push(c);
                }
            }
            for (const c of commands) {
                this._list.splice(this._index + 1, 0, c);
            }
            const c2: RPG.EventCommand = {'code': 356, 'indent': this._indent, 'parameters': [`Tachie clear`]};
            this._list.splice(this._index + 1 + commands.length, 0, c2);
            }
            break;
        case 'clear':
            for (let pictureId of PICTURES) {
                const picture = $gameScreen.picture(pictureId);
                if (picture) {
                    picture.erase();
                }
            }
            break;
        case 'showLeft':
        case 'showRight':
        case 'showCenter':
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
    hidePicture(pictureId: number): void {
        const picture = $gameScreen.picture(pictureId);
        let commands: Array<RPG.EventCommand> = [];
        if (picture && picture.opacity() > 0) {
            const c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [pictureId,
                                        0, 0, 0, picture.x(), picture.y(), 100, 100, 0, 0, 30, true]};
            commands.push(c);
        }
        const c: RPG.EventCommand = {'code': 235, 'indent': this._indent, 'parameters': [pictureId]};
        commands.push(c);
        for (const c of commands) {
            this._list.splice(this._index + 1, 0, c);
        }
    }
    tachiePictureCommnad(command: string, actorId: number, x: number, y: number, opacity: number): void {
        switch (command) {
        case 'showLeft':
            this.showTachiePicture(actorId, LEFT_POS, DEFAULT_PICTURE_ID1, x, y, opacity);
            this.deactivateTachiePicture(DEFAULT_PICTURE_ID2);
            this.deactivateTachiePicture(DEFAULT_PICTURE_ID3);
            break;
        case 'showRight':
            this.showTachiePicture(actorId, RIGHT_POS, DEFAULT_PICTURE_ID2, x, y, opacity);
            this.deactivateTachiePicture(DEFAULT_PICTURE_ID1);
            this.deactivateTachiePicture(DEFAULT_PICTURE_ID3);
            break;
        case 'showCenter':
            this.showTachiePicture(actorId, CENTER_POS, DEFAULT_PICTURE_ID3, x, y, opacity);
            this.deactivateTachiePicture(DEFAULT_PICTURE_ID1);
            this.deactivateTachiePicture(DEFAULT_PICTURE_ID2);
            break;
        }
    }
    /**
     * 立ち絵を表示します
     * @param {number} actorId   [description]
     * @param {number} posId     [description]
     * @param {number} pictureId [description]
     * @param {number} x         [description]
     * @param {number} y         [description]
     * @param {number} opacity   [description]
     */
    showTachiePicture(actorId: number, posId: number, pictureId: number, x: number, y: number, opacity: number): void {
        $gameTemp.tachieActorId = actorId;
        $gameTemp.tachieActorPos = posId;
        $gameTemp.tachieWindowColorId = windowColors[$gameTemp.tachieActorId];
        var lastTone = [0, 0, 0, 0];
        if (opacity < 255) {
            const picture = $gameScreen.picture(pictureId);
            if (picture && picture.tachieActorId === actorId) {
                opacity = 255;
                lastTone = picture.tone();
            }
        }
        const xx = x + this.getPosX(posId);
        const yy = y + posY;
        $gameScreen.showPicture(pictureId, ACTOR_PREFIX + actorId, 0, xx, yy, 100, 100, opacity, 0);
        const picture = $gameScreen.picture(pictureId);
        picture.tint(lastTone, 0);
        
        var c: RPG.EventCommand = {'code': 234, 'indent': this._indent, 'parameters': [pictureId, [0, 0, 0, 0], toneChangeDuration, false]};
        this._list.splice(this._index + 1, 0, c);
        
        if (opacity < 255) {
            var c: RPG.EventCommand = {'code': 232, 'indent': this._indent, 'parameters': [pictureId, 0, 0, 0, xx, yy, 100, 100, 255, 0, 15, true]};
            this._list.splice(this._index + 1, 0, c);
        }
    }
    /**
     * 指定の pictureId のピクチャが表示されている場合、暗くします
     */
    deactivateTachiePicture(pictureId: number): void {
        const leftPicture = $gameScreen.picture(pictureId);
        if (leftPicture && leftPicture.name() != '') {
            var c: RPG.EventCommand = {'code': 234, 'indent': this._indent, 'parameters': [pictureId, inactiveActorTone, toneChangeDuration, false]};
            this._list.splice(this._index + 1, 0, c);
        }
    }
    /**
     * 指定の positionId に対応する x 座標を返します。
     */
    getPosX(posId: number): number {
        switch (posId) {
            case LEFT_POS: return leftPosX;
            case RIGHT_POS: return rightPosX;
            case CENTER_POS: return centerPosX;
            default:
                console.error('posId が不正です:' + posId);
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

var _Scene_Map_create = Scene_Map.prototype.create;
Scene_Map.prototype.create = function() {
    _Scene_Map_create.call(this);
    for (let actor of $gameParty.battleMembers()) {
        actor.preloadTachie();
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
    
    protected _statePoseId: number;
    protected _stateFaceId: number;

    get baseId(): string {
        return 'actor' + this.actorId().padZero(2) + '_';
    }
    get poseId(): number {
        if (this._statePoseId) {
            return this._statePoseId;
        }
        return this._poseId;
    }
    get faceId(): number {
        if (this._stateFaceId) {
            return this._stateFaceId;
        }
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
        $gamePlayer.refresh();
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
        if (this.isTachieDisabled()) {
            return;
        }
        if (useTextureAtlas) {
            if (PIXI.TextureCache[this.bodyFrontFile() + '.png']) {
                // すでに読み込み済み
            } else {
                var file = 'img/tachie/actor' + this.actorId().padZero(2) + '.json';
                ImageManager.loadSpriteSheet(file);
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
            this.doPreloadTachie(this.hairFile());
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
        if (! enableOuterBackLayer) {
            return null;
        }
        return this.baseId + 'out_' + this.outerId + '_back_' + this.poseId;
    }
    outerShadowFile(): string {
        if (! this.hasOuter()) {
            return null;
        }
        return this.baseId + 'out_' + this.outerId + '_shadow_' + this.poseId;
    }
    outerMainFile(): string {
        if (! enableOuterMainLayer) {
            return null;
        }
        if (! this.hasOuter()) {
            return null;
        }
        return this.baseId + 'out_' + this.outerId + '_main_' + this.poseId;
    }
    outerFrontFile(): string {
        if (! enableOuterFrontLayer) {
            return null;
        }
        if (! this.hasOuter()) {
            return null;
        }
        return this.baseId + 'out_' + this.outerId + '_front_' + this.poseId;
    }
    bodyBackFile(): string {
        if (! enableBodyLayer) {
            return null;
        }
        return this.baseId + 'body_' + this.poseId;
    }
    bodyFrontFile(): string {
        if (! enableFaceLayer) {
            return null;
        }
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
    hairFile(): string {
        if (! enableHairLayer) {
            return null;
        }
        return this.baseId + 'hair_' + this.poseId;
    }
    hoppeFile(): string {
        if (this.hoppeId === 0) {
            return null;
        }
        return this.baseId + 'hoppe';
    }
    faceFile(): string {
        return this.baseId + this.faceId.padZero(2);
    }
    /**
     * @override
     */
    addNewState(stateId: number): void {
        _Game_Actor_addNewState.call(this, stateId);
        this.updatePoseAndFaceByStates();
    }
    /**
     * @override
     */
    clearStates(): void {
        _Game_Actor_clearStates.call(this);
        this.updatePoseAndFaceByStates();
    }
    /**
     * @override
     */
    eraseState(stateId: number): void {
        _Game_Actor_eraseState.call(this, stateId);
        this.updatePoseAndFaceByStates();
    }
    updatePoseAndFaceByStates(): void {
        var lastStatePoseId = this._statePoseId;
        var lastStateFaceId = this._stateFaceId;
        this._statePoseId = null;
        this._stateFaceId = null;
        for (let stateId of this._states) {
            var state:RPG.State = $dataStates[stateId];
            if (state.meta[TACHIE_POSE_META_KEY]) {
                this._statePoseId = parseInt(state.meta[TACHIE_POSE_META_KEY]);
            }
            if (state.meta[TACHIE_FACE_META_KEY]) {
                this._stateFaceId = parseInt(state.meta[TACHIE_FACE_META_KEY]);
            }
        }
        if (this._statePoseId != lastStatePoseId) {
            this.setDirty();
            this.setCacheChanged();
        }
        if (this._stateFaceId != lastStateFaceId) {
            this.setDirty();
        }
    }
    isTachieDisabled(): boolean {
        return disabledTachieActorIdList.indexOf(this.actorId()) >= 0;
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
    if (this._spriteSheetLoaders && this._spriteSheetLoaders.length > 0) {
        // スプライトシートを読み込み中
        return false;
    }
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
ImageManager.loadTachie = function(filename: string, hue?: number) {
    return this.loadBitmap('img/tachie/', filename, hue, true);
};
ImageManager.loadSpriteSheet = function(file: string) {
    var loader = new PIXI.SpriteSheetLoader(file, false);
    this._spriteSheetLoaders = this._spriteSheetLoaders || [];
    this._spriteSheetLoaders.push(loader);
    
    loader.on('loaded', () => {
        var index = this._spriteSheetLoaders.indexOf(loader);
        this._spriteSheetLoaders.splice(index, 1);
    })
    loader.on('error', () => {
        var index = this._spriteSheetLoaders.indexOf(loader);
        this._spriteSheetLoaders.splice(index, 1);
    })
    loader.load();
    
};
const _PIXI_SpriteSheetLoader_load = PIXI.SpriteSheetLoader.prototype.load;
PIXI.SpriteSheetLoader.prototype.load = function () {
    var scope = this;
    var jsonLoader = new PIXI.JsonLoader(this.url, this.crossorigin);
    jsonLoader.on('loaded', function (event) {
        scope.json = event.data.content.json;
        scope.onLoaded();
    });
    jsonLoader.on('error', function (event) {
        scope.emit('error', {
            content: scope
        });
    });
    jsonLoader.load();
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
    this.drawTachie = function(actorId: number, bitmap: Bitmap, x = 0, y = 0, rect: Rectangle, faceId = 0, scale = 1, clearByDraw = false): boolean {
        var actor = $gameActors.actor(actorId);
        if (! actor) {
            console.error('アクターが存在しないため、描画をしませんでした。actorId:' + actorId);
            return false;
        }
        if (! ImageManager.isReady()) {
            return false;
        }
        actor.preloadTachie();
        if (! ImageManager.isReady()) {
            return false;
        }
        var point = this.calcTachieActorPos(actor);
        if (clearByDraw) {
            bitmap.clear();
        }
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
            this.drawTachieHair(actor, cache);
            this.drawTachieOuterBack(actor, cache);
            this.drawTachieBodyBack(actor, cache);
            this.drawTachieInnerBottom(actor, cache);
            this.drawTachieInnerTop(actor, cache);
            this.drawTachieOuterMain(actor, cache);
            this.drawTachieBodyFront(actor, cache);
            this.drawTachieOuterFront(actor, cache);
            //console.log('createCache:' + actor.actorId());
        }
        if (! $gameTemp.tachieTmpBitmap) {
            $gameTemp.tachieTmpBitmap = new Bitmap(Graphics.width, Graphics.height)
        }
        var tempBitmap = $gameTemp.tachieTmpBitmap;
        this.drawTachieCache(actor, cache, bitmap, x, y, rect, scale);
        tempBitmap.clear();
        this.drawTachieHoppe(actor, tempBitmap);
        this.drawTachieFace(actor, tempBitmap, faceId);
        this.drawTachieCache(actor, tempBitmap, bitmap, x, y, rect, scale);
        this.lastDrawnActorId = actor.actorId();
        return true;
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
    this.drawTachieCache = function(actor: Game_Actor, cache: Bitmap, bitmap: Bitmap, x: number, y: number, rect: Rectangle, scale: number): void {
        var xx = -rect.x < 0 ? 0 : -rect.x;
        var yy = -rect.y < 0 ? 0 : -rect.y;
        var ww = rect.width / scale; 
        var w = rect.width;
        if (w <= 0 || w + xx > cache.width) {
            w = cache.width - xx;
            ww = w / scale;
        }
        if (xx + ww > cache.width) {
            var xScale = (cache.width - xx) * 1.0 / ww;
            ww = cache.width - xx;
            w *= xScale;
        }
        var hh = rect.height / scale;
        var h = rect.height;
        if (h <= 0 || h + yy > cache.height) {
            h = cache.height - yy;
            hh = h / scale;
        }
        if (yy + hh > cache.height) {
            var yScale = (cache.height - yy) * 1.0 / hh;
            hh = cache.height - yy;
            h *= yScale;
        }
        bitmap.blt(cache, xx, yy, ww, hh, x, y, w, h);
    };
    this.drawTachieFile = function(file: string, bitmap: Bitmap, actor: Game_Actor, x = 0, y = 0, rect: Rectangle, scale = 1): void {
        if (! file) {
            return;
        }
        if (! rect) {
            rect = Rectangle.emptyRectangle;
        }
        if (useTextureAtlas) {
            this.drawTachieTextureAtlas(file, bitmap, actor, x, y, rect, scale);
        } else {
            this.drawTachieImage(file, bitmap, actor, x, y, rect, scale);
        }
    };
    this.drawTachieTextureAtlas = function(file: string, bitmap: Bitmap, actor: Game_Actor, x: number, y: number, rect: Rectangle, scale: number): void {
        var texture = PIXI.TextureCache[file + '.png'];
        if (! texture) {
            return;
        }
        var img = texture.baseTexture.source;
        var frame = texture.frame;
        var sx = frame.x;
        var sy = frame.y;
        var trim = texture.trim;
        var crop = texture.crop;
        var ww = crop.width / scale;
        var w = crop.width;
        var hh = crop.height / scale;
        var h = crop.height;
        var dx = (trim.x + rect.x);
        var dy = (trim.y + rect.y) ;
        
        bitmap.context.drawImage(img, sx, sy, ww, hh, dx + x, dy + y, w, h);
    };
    this.drawTachieImage = function(file: string, bitmap: Bitmap, actor: Game_Actor, x: number, y: number, rect: Rectangle, scale: number): void {
        var img: Bitmap = ImageManager.loadTachie(file);
        if (! img.isReady()) {
            console.log('draw' + file);
            actor.setDirty();
            return;
        }
        var xx = -rect.x < 0 ? 0 : -rect.x;
        var yy = -rect.y < 0 ? 0 : -rect.y;
        var ww = rect.width / scale; 
        var w = rect.width; 
        if (w <= 0 || w + xx > img.width) {
            w = img.width - xx;
            ww = w;
        }
        if (xx + ww > img.width) {
            var xScale = (img.width - xx) * 1.0 / ww;
            ww = img.width - xx;
            w *= xScale;
        }
        var hh = rect.height / scale;
        var h = rect.height;
        if (h <= 0 || h + yy > img.height) {
            h = img.height - yy;
            hh = h;
        }
        if (yy + hh > img.height) {
            var yScale = (img.height - yy) * 1.0 / hh;
            hh = img.height - yy;
            h *= yScale;
        }
        bitmap.blt(img, xx, yy, ww, hh, x, y, w, h);
    };
    this.drawTachieHair = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.hairFile(), bitmap, actor);
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
    this.drawTachieHoppe = function(actor: Game_Actor, bitmap: Bitmap): void {
        this.drawTachieFile(actor.hoppeFile(), bitmap, actor);
    };
    this.drawTachieFace = function(actor: Game_Actor, bitmap: Bitmap, faceId: number): void {
        if (faceId === 0) {
            faceId = actor.faceId;
        }
        var file = actor.baseId + faceId.padZero(2);
        this.drawTachieFile(file, bitmap, actor);
    };

};

TachieDrawerMixin.call(Sprite.prototype);
TachieDrawerMixin.call(Window_Base.prototype);
 
class _Sprite_Picture extends Sprite_Picture {
    _dirty: boolean;
    updateBitmap(): void {
        _Sprite_Picture_updateBitmap.call(this);
        var picture = this.picture();
        if (picture && picture.tachieActorId !== 0) {
            var actorId = picture.tachieActorId;
            var actor = $gameActors.actor(actorId);
            if (actor.isDirty() || this._dirty) {
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
        if (this.lastDrawnActorId !== actorId) {
            this.bitmap.clear();
        }
        var success = this.drawTachie(actorId, this.bitmap, 0, 0, null, 0, 1, true);
        this._dirty = ! success;
    }
}



class Window_MessageName extends Window_Base {
    windowHeight: number;
    constructor(windowHeight) {
        var width = 180;
        var height = super.fittingHeight(1) + 14;
        var x = nameLeft;
        var y = Graphics.boxHeight - windowHeight - windowMargin[0] - windowMargin[2] - height;
        this.windowHeight = windowHeight;
        super(x, y, width, height);
        
        this.padding = 8;
        this.openness = 0;
    }
    standardPadding(): number {
        return 0;
    }
    update(): void {
        super.update();
        if ($gameTemp.sabaWaitForMovieMode > 0) {
            this.visible = false;
            return;
        }
        if ($gameMessage.positionType() !== 2) {
            this.visible = false;
            return;
        }
        this.x = nameLeft;
        this.y = Graphics.boxHeight - this.windowHeight - windowMargin[0] - windowMargin[2] - this.height;
    }
    draw(name): void {
        if (! name) {
            this.visible = false;
            return;
        }
        this.width = this.convertEscapeCharacters(name).length * this.standardFontSize() + 40;
        this.contents.clear();
        this.drawTextEx(name, 10, 0);
        this.open();
        this.visible = true;
    }
}

class Sprite_MessageMode extends Sprite_Base {
    protected _messageWindow: Window_TachieMessage;
    _frameIndex: number;
    _wait: number;
    constructor(messageWindow: Window_TachieMessage) {
        super();
        this._messageWindow = messageWindow;
        this._frameIndex = 1;
        this._wait = 0;
    }
    update(): void {
        super.update();
        if (! $gameTemp.isAutoMode || ! this._messageWindow.isGalMode()) {
            this.visible = false;
            return;
        }
        this.visible = true;
        if (this._wait != 0) {
            this._wait--;
            return;
        }
        var img = ImageManager.loadSystem('Tachie_Auto_' + this._frameIndex);
        this.bitmap = img;
        
        this._frameIndex++;
        if (this._frameIndex > AUTO_MODE_MARK_TOTAL_FRAME) {
            this._frameIndex = 1;
        }
        this._wait = 4;
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
        if ($gameMessage.positionType() !== 2) {
            this.visible = false;
            return;
        }
        if ($gameMessage.background() !== 0) {
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
        if (this._windowAcrotId === $gameTemp.tachieWindowColorId) {
            return;
        }
        if ($gameTemp.tachieWindowColorId > 0) {
            if (! this._messageWindow.isOpen()) {
                this.visible = false;
                return;
            }
            this._windowAcrotId = $gameTemp.tachieWindowColorId;
            const color = this._windowAcrotId;
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
            this.x = (Graphics.boxWidth - windowMargin[1] - windowMargin[3]) / 2 - 140;
        } else if ($gameTemp.tachieActorPos === RIGHT_POS) {
            this.scale.x = -1;
            this.x = (Graphics.boxWidth - windowMargin[1] - windowMargin[3]) / 2 + 140;
        } else if ($gameTemp.tachieActorPos === CENTER_POS) {
            this.scale.x = 1;
            this.x = (Graphics.boxWidth - windowMargin[1] - windowMargin[3]) / 2 + 40;
        }
    }
}


export class Window_TachieMessage extends Window_Message {
    protected _messageNameWindow: Window_MessageName;
    protected _balloonSprite: Sprite_WindowBalloon;
    protected _modeSprite: Sprite_MessageMode;
    protected _windowSkinId: number;
    protected _triggered: boolean;
    protected _windowHide: boolean;
    protected _galMode: boolean;
    protected _autoModeCurrentWait: number = 0; // オートモード時、現在待機したフレーム数
    protected _autoModeNeedWait: number = -1;     // オートモードで次のメッセージに進むために必要なフレーム数
    constructor() {
        this._galMode = true;
        super();
    }
    windowWidth(): number {
        if (this._galMode) {
            return Graphics.boxWidth - windowMargin[1] - windowMargin[3];
        } else {
            return super.windowWidth();
        }
    };
    numVisibleRows(): number {
        if (this._galMode) {
            return MESSAGE_NUM_LINES;
        } else {
            return super.numVisibleRows();
        }
    }
    fittingHeight(numLines): number {
        if (this._galMode) {
            return numLines * this.lineHeight() + this.standardPadding() * 2 + windowPadding[0] + windowPadding[2];
        } else {
            return super.fittingHeight(numLines);
        }
    }
    _refreshContents(): void {
        if (this._galMode) {
            this._windowContentsSprite.move(this.padding + 6, 0);
        } else {
            super._refreshContents();
        }
    };
    contentsHeight() {
        if (this._galMode) {
            return this.windowHeight() - this.standardPadding() * 2 + 20;
        } else {
            return super.contentsHeight();
        }
    }
    _updateContents(): void {
        if (this._galMode) {
            var w = this._width - this._padding * 2;
            var h = this._height - 0 * 2;
            if (w > 0 && h > 0) {
                this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
                this._windowContentsSprite.visible = this.isOpen();
            } else {
                this._windowContentsSprite.visible = false;
            }
        } else {
            return super._updateContents();
        }
    }
    subWindows(): Array<Window_Base> {
        var ret = super.subWindows();
        ret.push(this._messageNameWindow);
        return ret;
    }
    createSubWindows(): void {
        super.createSubWindows();
        this._messageNameWindow = new Window_MessageName(this.windowHeight());
        this._balloonSprite = new Sprite_WindowBalloon(this);
        this._balloonSprite.y = -39;
        this.addChild(this._balloonSprite);
        
        this._modeSprite = new Sprite_MessageMode(this);
        this._modeSprite.x = AUTO_MODE_MARK_X;
        this._modeSprite.y = AUTO_MODE_MARK_Y;
        this.addChild(this._modeSprite);
        
    }
    update(): void {
        super.update();
        this._updateAutoMode();
        if (! this._galMode) {
            this.updateMessageSkip();
            return;
        }
        if ($gameTemp.sabaWaitForMovieMode > 0) {
            this.close();
            return;
        }
        if (this._windowSkinId !== $gameTemp.tachieWindowColorId) {
            if ($gameTemp.tachieWindowColorId > 0) {
                this._windowSkinId = $gameTemp.tachieWindowColorId;
                var color = this._windowSkinId;
                if (color > 0) {
                    this.windowskin = ImageManager.loadSystem('Tachie_Window' + color);
                } else {
                    this.windowskin = ImageManager.loadSystem('Window');
                }
            } else {
                this.clearWindowSkin();
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
    clearWindowSkin(): void {
        this._windowSkinId = 0;
        this.windowskin = ImageManager.loadSystem('Window');
        $gameTemp.tachieWindowColorId = 0;
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
            if (! this._textState) {
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
        if ($gameTemp.isAutoMode && this._autoModeCurrentWait == this._autoModeNeedWait) {
            // オートモードで一定時間経過した
            return true;
        }
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
        this._calcAutoModelWait();
        if (! this._galMode) {
            return;
        }
        if (BackLog) {
            BackLog.$gameBackLog.addLog($gameTemp.tachieName, $gameMessage.allText());
        }
        this._textState.y = this.standardPadding() + windowPadding[0];
        this._balloonSprite.showBalloon();
        this._messageNameWindow.draw($gameTemp.tachieName);
    }
    _calcAutoModelWait(): void {
        this._autoModeCurrentWait = 0;
        this._autoModeNeedWait = $gameMessage.calcAutoModeFrames();
    }
    _updateAutoMode(): void {
        if (! this.visible) {
            return;
        }
        if ($gameTemp.isAutoMode) {
            this._autoModeCurrentWait++;
        }
        if (Input.isTriggered(AUTO_MODE_KEY)) {
            $gameTemp.isAutoMode = ! $gameTemp.isAutoMode;
        }
    }
    updatePlacement(): void {
        if (this._galMode) {
            this.x = windowMargin[3];
            this.y = this._positionType * (Graphics.boxHeight - this.height) / 2 - windowMargin[2];
        } else {
            super.updatePlacement();
        }
    }
    terminateMessage(): void {
        $gameMessage.clear();
        if ($gameTemp.tachieAvairable) {
            return;
        }
        this.close();
    }
    textAreaWidth(): number {
        if (this._galMode) {
            return this.contentsWidth() + 20 - windowPadding[1];
        } else {
            return super.textAreaWidth();
        }
    }
    standardFontSize() {
        if (this._galMode) {
            return fontSize;
        } else {
            return super.standardFontSize();
        }
    }
    lineHeight() {
        if (this._galMode) {
            return this.standardFontSize() + 8;
        } else {
            return super.lineHeight();
        }
    }
    newLineX() {
        if (this._galMode) {
            var x =  this.isShowFace() ? newLineXWithFace : 0;
            return x + windowPadding[3];
        } else {
            return super.newLineX();
        }
    }
    isShowFace(): boolean {
        if ($gameMessage.faceName() !== '') {
            return true;
        }
        return showTachieActorFace && $gameTemp.tachieActorId > 0;
    }
    drawMessageFace(): void {
        if (showTachieActorFace && $gameTemp.tachieActorId > 0) {
            var actor = $gameActors.actor($gameTemp.tachieActorId);
            this.drawActorFace(actor, messageFaceX, messageFaceY, null, null, 0, 0, actor.faceId);
        } else {
            this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), messageFaceX, messageFaceY);
        }
    }
    updateBackground(): void {
        this.refreshWindow();
        super.updateBackground();
    }
    refreshWindow(): void {
        if (this._galMode) {
            if ($gameMessage.background() !== 0 || $gameMessage.positionType() !== 2) {
                this.clearWindowSkin();
                this._galMode = false;
                this.refreshWindowRect();
            }
        } else {
            if ($gameMessage.background() === 0 && $gameMessage.positionType() === 2) {
                this._galMode = true;
                this.refreshWindowRect();
            }
        }
    }
    refreshWindowRect(): void {
        this.move(0, 0, this.windowWidth(), this.windowHeight());
        this.createContents();
        this.updatePlacement();
        this._refreshContents();
    }
    isGalMode(): boolean {
        return this._galMode;
    }
}

Game_Message.prototype.calcAutoModeFrames = function() {
    if (this._choices.length > 0) {
        return -1;
    }
    let textCount = 0;
    for (let line of this._texts) {
        textCount += line.length;
    }
    return Math.floor((textCount * AUTO_MODE_DELAY_PER_CHAR + AUTO_MODE_DELAY_COMMON) / (1000 / 60));
};

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
        const color = windowColors[i];
        if (color > 0) {
            ImageManager.loadSystem('Tachie_Window' + color);
        }
    }
    if (AUTO_MODE_KEY && AUTO_MODE_KEY.length > 0) {
        for (var i = 0; i < AUTO_MODE_MARK_TOTAL_FRAME; i++) {
            ImageManager.loadSystem('Tachie_Auto_' + (i+ 1));
        }
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
interface Game_Message {
    calcAutoModeFrames(): number;   // オートモードで次の文に進むまでの待ち時間を計算します
}
interface Game_Picture {
    tachieActorId: number;
    tachieRefreshFlag: boolean;
}
interface Game_Temp {
    getPictureBitmapCache(actorId: number): Bitmap;
    getActorBitmapBodyCache(actorId: number): Bitmap;
    tachieTmpBitmap: Bitmap;
    tachieName: string;
    tachieActorId: number;
    tachieActorPos: number;
    tachieAvairable: boolean;   // これが true の時はメッセージウィンドウを閉じません
    hideBalloon: boolean;   // これが true の時は吹き出しを表示しません
    isAutoMode: boolean;
    tachieWindowColorId: number;
    sabaWaitForMovieMode: number;
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
    hairFile(): string;
    hoppeFile(): string;
    faceFile(): string;
    isTachieDisabled(): boolean;
    preloadFaces(faceIds: Array<string>): void;
}
interface ImageManagerStatic {
    loadTachie(file: string, hue?: number): Bitmap;
    loadSpriteSheet(file: string): void;
}
interface Window_Base {
    drawTachie(actorId: number, bitmap: Bitmap, x?: number, y?: number, rect?: Rectangle, faceId?: number, scale?: number, clearByDraw?: boolean): void;
}
interface Sprite {
    lastDrawnActorId: number;   // 最後に描画に成功したアクターID
    drawTachie(actorId: number, bitmap: Bitmap, x?: number, y?: number, rect?: Rectangle, faceId?: number, scale?: number, clearByDraw?: boolean): void;
}
