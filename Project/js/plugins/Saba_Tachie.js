var Saba;
(function (Saba) {
    Saba.applyMyMethods = function (myClass, presetClass, applyConstructor) {
        for (var p in myClass.prototype) {
            if (myClass.prototype.hasOwnProperty(p)) {
                if (p === 'constructor' && !applyConstructor) {
                    continue;
                }
                Object.defineProperty(presetClass.prototype, p, Object.getOwnPropertyDescriptor(myClass.prototype, p));
            }
        }
    };
    Saba.toIntArray = function (list) {
        var ret = [];
        for (var i = 0; i < list.length; i++) {
            ret[i] = parseInt(list[i]);
        }
        return ret;
    };
    Saba.toIntArrayByStr = function (str, minLength) {
        if (minLength === void 0) { minLength = 0; }
        var ret = [];
        for (var i = 0; i < minLength; i++) {
            ret[i] = 0;
        }
        if (!str) {
            return ret;
        }
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) {
            ret[i] = parseInt(list[i]);
            if (isNaN(ret[i])) {
                ret[i] = 0;
            }
        }
        return ret;
    };
    Saba.parseIntValue = function (value, defaultValue) {
        var intNum = parseInt(value);
        if (isNaN(intNum)) {
            return defaultValue;
        }
        else {
            return intNum;
        }
    };
})(Saba || (Saba = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
 * Ver 2016-08-10 21:18:13
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
var Saba;
(function (Saba) {
    var Tachie;
    (function (Tachie) {
        var parameters = PluginManager.parameters('Saba_Tachie');
        Tachie.leftPosX = parseInt(parameters['leftPosX']);
        Tachie.rightPosX = parseInt(parameters['rightPosX']);
        Tachie.centerPosX = parseInt(parameters['centerPosX']);
        Tachie.posY = parseInt(parameters['posY']);
        Tachie.nameLeft = parseInt(parameters['nameLeft']);
        Tachie.fontSize = parseInt(parameters['fontSize']);
        Tachie.newLineXWithFace = parseInt(parameters['newLineXWithFace']);
        Tachie.windowMargin = Saba.toIntArrayByStr(parameters['windowMargin'], 4);
        Tachie.windowPadding = Saba.toIntArrayByStr(parameters['windowPadding'], 4);
        Tachie.inactiveActorTone = Saba.toIntArrayByStr(parameters['inactiveActorTone'], 4);
        Tachie.disabledTachieActorIdList = Saba.toIntArrayByStr(parameters['disablesTachieActorIdList']);
        Tachie.toneChangeDuration = parseInt(parameters['toneChangeDuration']);
        Tachie.windowColors = {};
        Tachie.offsetX = {};
        Tachie.offsetY = {};
        Tachie.messageFacePosStr = parameters['messageFacePos'].split(',');
        Tachie.messageFaceX = parseInt(Tachie.messageFacePosStr[0]);
        Tachie.messageFaceY = parseInt(Tachie.messageFacePosStr[1]);
        for (var i = 1; i <= 10; i++) {
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
        for (var i = 0; i < 99; i++) {
            Tachie.windowColors[i + 1] = 0;
        }
        var colors = parameters['windowColor'].split(',');
        for (var i = 0; i < colors.length; i++) {
            var color = parseInt(colors[i]);
            if (!isNaN(color)) {
                Tachie.windowColors[i + 1] = color;
            }
        }
        Tachie.MESSAGE_NUM_LINES = Saba.parseIntValue(parameters['messageNumLines'], 3);
        Tachie.AUTO_MODE_DELAY_COMMON = Saba.parseIntValue(parameters['autoModeDelayCommon'], 2500);
        Tachie.AUTO_MODE_DELAY_PER_CHAR = Saba.parseIntValue(parameters['autoModeDelayPerChar'], 120);
        Tachie.AUTO_MODE_MARK_TOTAL_FRAME = parseInt(parameters['autoModeMarkFrameNum']);
        Tachie.AUTO_MODE_MARK_X = parseInt(parameters['autoModeMarkX']);
        Tachie.AUTO_MODE_MARK_Y = parseInt(parameters['autoModeMarkY']);
        Tachie.balloonEnabled = parameters['balloonEnabled'] === 'true';
        var enableFaceLayer = parameters['enableFaceLayer'] === 'true';
        var enableBodyLayer = parameters['enableBodyLayer'] === 'true';
        var enableHairLayer = parameters['enableHairLayer'] === 'true';
        var enableOuterBackLayer = parameters['enableOuterBackLayer'] === 'true';
        var enableOuterMainLayer = parameters['enableOuterMainLayer'] === 'true';
        var enableOuterFrontLayer = parameters['enableOuterFrontLayer'] === 'true';
        var useTextureAtlas = parameters['useTextureAtlas'] === 'true';
        Tachie.DEFAULT_PICTURE_ID1 = 11; // 左
        Tachie.DEFAULT_PICTURE_ID2 = 12; // 右
        Tachie.DEFAULT_PICTURE_ID3 = 13; // センター
        Tachie.PICTURES = [Tachie.DEFAULT_PICTURE_ID1, Tachie.DEFAULT_PICTURE_ID2, Tachie.DEFAULT_PICTURE_ID3];
        var ACTOR_PREFIX = '___actor';
        Tachie.LEFT_POS = 1;
        Tachie.RIGHT_POS = 2;
        Tachie.CENTER_POS = 3;
        Tachie.MESSAGE_SKIP_KEY = parameters['skipKey'];
        Tachie.WINDOW_HIDE_KEY = parameters['windowHideKey'];
        Tachie.AUTO_MODE_KEY = parameters['autoModeKey'];
        // ステートのメモ欄で、立ち絵のポーズを指定する時のキーです。
        var TACHIE_POSE_META_KEY = 'tachiePoseId';
        // ステートのメモ欄で、立ち絵の表情を指定する時のキーです。
        var TACHIE_FACE_META_KEY = 'tachieFaceId';
        var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        var _Game_Picture_initTarget = Game_Picture.prototype.initTarget;
        var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
        var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
        var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
        var _Game_Actor_addNewState = Game_Actor.prototype.addNewState;
        var _Game_Actor_clearStates = Game_Actor.prototype.clearStates;
        var _Game_Actor_eraseState = Game_Actor.prototype.eraseState;
        var DataManager_extractSaveContents = DataManager.extractSaveContents;
        DataManager.extractSaveContents = function (contents) {
            DataManager_extractSaveContents.call(this, contents);
            var len = $dataActors.length;
            for (var i = 0; i < len; i++) {
                var actor = $gameActors._data[i];
                if (actor) {
                    actor.setCacheChanged();
                }
            }
        };
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
                    case 'inactiveAll': // 後方互換用
                    case 'deactivateAll':
                        for (var _i = 0, PICTURES_1 = Tachie.PICTURES; _i < PICTURES_1.length; _i++) {
                            var pictureId = PICTURES_1[_i];
                            var picture = $gameScreen.picture[pictureId];
                            if (picture && picture.name() != '') {
                                var c = { 'code': 234, 'indent': this._indent, 'parameters': [pictureId, Tachie.inactiveActorTone, Tachie.toneChangeDuration, false] };
                                this._list.splice(this._index + 1, 0, c);
                            }
                        }
                        break;
                    case 'hideLeft':
                        this.hidePicture(Tachie.DEFAULT_PICTURE_ID1);
                        break;
                    case 'hideRight':
                        this.hidePicture(Tachie.DEFAULT_PICTURE_ID2);
                        break;
                    case 'hideCenter':
                        this.hidePicture(Tachie.DEFAULT_PICTURE_ID3);
                        break;
                    case 'hide':
                        {
                            var commands = [];
                            for (var _a = 0, PICTURES_2 = Tachie.PICTURES; _a < PICTURES_2.length; _a++) {
                                var pictureId = PICTURES_2[_a];
                                var picture = $gameScreen.picture(pictureId);
                                if (picture && picture.opacity() > 0) {
                                    var c = { 'code': 232, 'indent': this._indent, 'parameters': [pictureId,
                                            0, 0, 0, picture.x(), picture.y(), 100, 100, 0, 0, 30, false] };
                                    commands.push(c);
                                }
                            }
                            for (var _b = 0, commands_1 = commands; _b < commands_1.length; _b++) {
                                var c = commands_1[_b];
                                this._list.splice(this._index + 1, 0, c);
                            }
                            var c2 = { 'code': 356, 'indent': this._indent, 'parameters': ["Tachie clear"] };
                            this._list.splice(this._index + 1 + commands.length, 0, c2);
                        }
                        break;
                    case 'clear':
                        for (var _c = 0, PICTURES_3 = Tachie.PICTURES; _c < PICTURES_3.length; _c++) {
                            var pictureId = PICTURES_3[_c];
                            var picture = $gameScreen.picture(pictureId);
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
                        if (!args[1]) {
                            console.error("\u30D7\u30E9\u30B0\u30A4\u30F3\u30B3\u30DE\u30F3\u30C9" + command + "\u306E" + args[0] + "\u306E\u5F15\u6570\u304C\u8DB3\u308A\u307E\u305B\u3093\u3002actorId \u304C\u5FC5\u8981\u3067\u3059");
                            return;
                        }
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
                    case 'acceOn':
                    case 'acceOff':
                        {
                            if (!args[1]) {
                                console.error("\u30D7\u30E9\u30B0\u30A4\u30F3\u30B3\u30DE\u30F3\u30C9" + command + "\u306E" + args[0] + "\u306E\u5F15\u6570\u304C\u8DB3\u308A\u307E\u305B\u3093\u3002actorId \u304C\u5FC5\u8981\u3067\u3059");
                                return;
                            }
                            var actor = $gameActors.actor(parseInt(args[1]));
                            if (!actor) {
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
            _Game_Interpreter.prototype.hidePicture = function (pictureId) {
                var picture = $gameScreen.picture(pictureId);
                var commands = [];
                if (picture && picture.opacity() > 0) {
                    var c_1 = { 'code': 232, 'indent': this._indent, 'parameters': [pictureId,
                            0, 0, 0, picture.x(), picture.y(), 100, 100, 0, 0, 30, true] };
                    commands.push(c_1);
                }
                var c = { 'code': 235, 'indent': this._indent, 'parameters': [pictureId] };
                commands.push(c);
                for (var _i = 0, commands_2 = commands; _i < commands_2.length; _i++) {
                    var c_2 = commands_2[_i];
                    this._list.splice(this._index + 1, 0, c_2);
                }
            };
            _Game_Interpreter.prototype.tachiePictureCommnad = function (command, actorId, x, y, opacity) {
                switch (command) {
                    case 'showLeft':
                        this.showTachiePicture(actorId, Tachie.LEFT_POS, Tachie.DEFAULT_PICTURE_ID1, x, y, opacity);
                        this.deactivateTachiePicture(Tachie.DEFAULT_PICTURE_ID2);
                        this.deactivateTachiePicture(Tachie.DEFAULT_PICTURE_ID3);
                        break;
                    case 'showRight':
                        this.showTachiePicture(actorId, Tachie.RIGHT_POS, Tachie.DEFAULT_PICTURE_ID2, x, y, opacity);
                        this.deactivateTachiePicture(Tachie.DEFAULT_PICTURE_ID1);
                        this.deactivateTachiePicture(Tachie.DEFAULT_PICTURE_ID3);
                        break;
                    case 'showCenter':
                        this.showTachiePicture(actorId, Tachie.CENTER_POS, Tachie.DEFAULT_PICTURE_ID3, x, y, opacity);
                        this.deactivateTachiePicture(Tachie.DEFAULT_PICTURE_ID1);
                        this.deactivateTachiePicture(Tachie.DEFAULT_PICTURE_ID2);
                        break;
                }
            };
            /**
             * 立ち絵を表示します
             * @param {number} actorId   [description]
             * @param {number} posId     [description]
             * @param {number} pictureId [description]
             * @param {number} x         [description]
             * @param {number} y         [description]
             * @param {number} opacity   [description]
             */
            _Game_Interpreter.prototype.showTachiePicture = function (actorId, posId, pictureId, x, y, opacity) {
                $gameTemp.tachieActorId = actorId;
                $gameTemp.tachieActorPos = posId;
                $gameTemp.tachieWindowColorId = Tachie.windowColors[$gameTemp.tachieActorId];
                var lastTone = [0, 0, 0, 0];
                if (opacity < 255) {
                    var picture_1 = $gameScreen.picture(pictureId);
                    if (picture_1 && picture_1.tachieActorId === actorId) {
                        opacity = 255;
                        lastTone = picture_1.tone();
                    }
                }
                var xx = x + this.getPosX(posId);
                var yy = y + Tachie.posY;
                $gameScreen.showPicture(pictureId, ACTOR_PREFIX + actorId, 0, xx, yy, 100, 100, opacity, 0);
                var picture = $gameScreen.picture(pictureId);
                picture.tint(lastTone, 0);
                var c = { 'code': 234, 'indent': this._indent, 'parameters': [pictureId, [0, 0, 0, 0], Tachie.toneChangeDuration, false] };
                this._list.splice(this._index + 1, 0, c);
                if (opacity < 255) {
                    var c = { 'code': 232, 'indent': this._indent, 'parameters': [pictureId, 0, 0, 0, xx, yy, 100, 100, 255, 0, 15, true] };
                    this._list.splice(this._index + 1, 0, c);
                }
            };
            /**
             * 指定の pictureId のピクチャが表示されている場合、暗くします
             */
            _Game_Interpreter.prototype.deactivateTachiePicture = function (pictureId) {
                var leftPicture = $gameScreen.picture(pictureId);
                if (leftPicture && leftPicture.name() != '') {
                    var c = { 'code': 234, 'indent': this._indent, 'parameters': [pictureId, Tachie.inactiveActorTone, Tachie.toneChangeDuration, false] };
                    this._list.splice(this._index + 1, 0, c);
                }
            };
            /**
             * 指定の positionId に対応する x 座標を返します。
             */
            _Game_Interpreter.prototype.getPosX = function (posId) {
                switch (posId) {
                    case Tachie.LEFT_POS: return Tachie.leftPosX;
                    case Tachie.RIGHT_POS: return Tachie.rightPosX;
                    case Tachie.CENTER_POS: return Tachie.centerPosX;
                    default:
                        console.error("posId \u304C\u4E0D\u6B63\u3067\u3059: " + posId);
                }
            };
            _Game_Interpreter.prototype.tachieActorCommnad = function (actor, command, arg2, args) {
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
                    case 'acceOn':
                        actor.addAcce(parseInt(arg2));
                        break;
                    case 'acceOff':
                        actor.removeAcce(parseInt(arg2));
                        break;
                }
            };
            _Game_Interpreter.prototype.validateCosId = function (command, id) {
                var re = /[a-z]/;
                if (!re.exec(id)) {
                    throw new Error("\u30B3\u30B9\u30C1\u30E5\u30FC\u30E0ID\u304C\u4E0D\u6B63\u3067\u3059:" + id + " command: " + command);
                }
            };
            _Game_Interpreter.prototype.command232 = function () {
                var x, y;
                if (this._params[3] === 0) {
                    x = this._params[4];
                    y = this._params[5];
                }
                else {
                    x = $gameVariables.value(this._params[4]);
                    y = $gameVariables.value(this._params[5]);
                }
                var time = this._params[10];
                if (Input.isPressed(Tachie.MESSAGE_SKIP_KEY) && Tachie.PICTURES.indexOf(this._params[0]) > 0) {
                    time = 1;
                }
                $gameScreen.movePicture(this._params[0], this._params[2], x, y, this._params[6], this._params[7], this._params[8], this._params[9], time);
                if (this._params[11]) {
                    this.wait(time);
                }
                return true;
            };
            ;
            return _Game_Interpreter;
        }(Game_Interpreter));
        var _Scene_Map_create = Scene_Map.prototype.create;
        Scene_Map.prototype.create = function () {
            _Scene_Map_create.call(this);
            for (var _i = 0, _a = $gameParty.battleMembers(); _i < _a.length; _i++) {
                var actor = _a[_i];
                actor.preloadTachie();
            }
        };
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
                    if (this._statePoseId) {
                        return this._statePoseId;
                    }
                    return this._poseId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Game_Actor.prototype, "faceId", {
                get: function () {
                    if (this._stateFaceId) {
                        return this._stateFaceId;
                    }
                    if (!this._faceId) {
                        return 0;
                    }
                    return this._faceId;
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
                this._acceList = [];
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
                $gamePlayer.refresh();
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
                if (this.isTachieDisabled()) {
                    return;
                }
                if (useTextureAtlas) {
                    if (PIXI.utils.TextureCache[this.bodyFrontFile() + '.png']) {
                    }
                    else {
                        var file = 'img/tachie/actor' + this.actorId().padZero(2) + '.json';
                        ImageManager.loadSpriteSheet(file);
                    }
                }
                else {
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
            };
            _Game_Actor.prototype.preloadFaces = function (faceIds) {
                if (useTextureAtlas) {
                    return;
                }
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
                if (!enableOuterBackLayer) {
                    return null;
                }
                return this.baseId + 'out_' + this.outerId + '_back_' + this.poseId;
            };
            _Game_Actor.prototype.outerShadowFile = function () {
                if (!this.hasOuter()) {
                    return null;
                }
                return this.baseId + 'out_' + this.outerId + '_shadow_' + this.poseId;
            };
            _Game_Actor.prototype.outerMainFile = function () {
                if (!enableOuterMainLayer) {
                    return null;
                }
                if (!this.hasOuter()) {
                    return null;
                }
                return this.baseId + 'out_' + this.outerId + '_main_' + this.poseId;
            };
            _Game_Actor.prototype.outerFrontFile = function () {
                if (!enableOuterFrontLayer) {
                    return null;
                }
                if (!this.hasOuter()) {
                    return null;
                }
                return this.baseId + 'out_' + this.outerId + '_front_' + this.poseId;
            };
            _Game_Actor.prototype.bodyBackFile = function () {
                if (!enableBodyLayer) {
                    return null;
                }
                return this.baseId + 'body_' + this.poseId;
            };
            _Game_Actor.prototype.bodyFrontFile = function () {
                if (!enableFaceLayer) {
                    return null;
                }
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
            _Game_Actor.prototype.hairFile = function () {
                if (!enableHairLayer) {
                    return null;
                }
                return this.baseId + 'hair_' + this.poseId;
            };
            _Game_Actor.prototype.hoppeFile = function () {
                if (this.hoppeId === 0) {
                    return null;
                }
                return this.baseId + 'hoppe';
            };
            _Game_Actor.prototype.faceFile = function () {
                return this.baseId + this.faceId.padZero(2);
            };
            /**
             * @override
             */
            _Game_Actor.prototype.addNewState = function (stateId) {
                _Game_Actor_addNewState.call(this, stateId);
                this.updatePoseAndFaceByStates();
            };
            /**
             * @override
             */
            _Game_Actor.prototype.clearStates = function () {
                _Game_Actor_clearStates.call(this);
                this.updatePoseAndFaceByStates();
            };
            /**
             * @override
             */
            _Game_Actor.prototype.eraseState = function (stateId) {
                _Game_Actor_eraseState.call(this, stateId);
                this.updatePoseAndFaceByStates();
            };
            _Game_Actor.prototype.updatePoseAndFaceByStates = function () {
                var lastStatePoseId = this._statePoseId;
                var lastStateFaceId = this._stateFaceId;
                this._statePoseId = null;
                this._stateFaceId = null;
                for (var _i = 0, _a = this._states; _i < _a.length; _i++) {
                    var stateId = _a[_i];
                    var state = $dataStates[stateId];
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
            };
            _Game_Actor.prototype.isTachieDisabled = function () {
                return Tachie.disabledTachieActorIdList.indexOf(this.actorId()) >= 0;
            };
            _Game_Actor.prototype.getBackAcceList = function () {
                this._acceList = this._acceList || [];
                var ret = [];
                for (var _i = 0, _a = this._acceList; _i < _a.length; _i++) {
                    var acce = _a[_i];
                    var acceItem = $dataArmors[acce];
                    if (acceItem.meta['backAcce']) {
                        ret.push(parseInt(acceItem.meta['backAcce']));
                    }
                }
                return ret;
            };
            _Game_Actor.prototype.getMiddleAcceList = function () {
                this._acceList = this._acceList || [];
                var ret = [];
                for (var _i = 0, _a = this._acceList; _i < _a.length; _i++) {
                    var acce = _a[_i];
                    var acceItem = $dataArmors[acce];
                    if (acceItem.meta['middleAcce']) {
                        ret.push(parseInt(acceItem.meta['middleAcce']));
                    }
                }
                return ret;
            };
            _Game_Actor.prototype.getFrontAcceList = function () {
                this._acceList = this._acceList || [];
                var ret = [];
                for (var _i = 0, _a = this._acceList; _i < _a.length; _i++) {
                    var acce = _a[_i];
                    var acceItem = $dataArmors[acce];
                    if (acceItem.meta['frontAcce']) {
                        ret.push(parseInt(acceItem.meta['frontAcce']));
                    }
                }
                return ret;
            };
            _Game_Actor.prototype.acceFile = function (id) {
                return this.baseId + 'acce_' + id;
            };
            _Game_Actor.prototype.addAcce = function (id) {
                if (this._acceList.indexOf(id) >= 0) {
                    return;
                }
                this._acceList.push(id);
                this.setCacheChanged();
            };
            _Game_Actor.prototype.removeAcce = function (id) {
                var index = this._acceList.indexOf(id);
                if (index < 0) {
                    return;
                }
                this._acceList.splice(index, 1);
                this.setCacheChanged();
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
        ImageManager.loadTachie = function (filename, hue) {
            return this.loadBitmap('img/tachie/', filename, hue, true);
        };
        ImageManager.loadSpriteSheet = function (file) {
            var loader = new PIXI.loaders.Loader();
            loader.add({ name: '', url: file });
            loader.load(); // ロード開始!
        };
        var _ImageManager_isReady = ImageManager.isReady;
        ImageManager.isReady = function () {
            for (var key in this.cache._inner) {
                var bitmap = this.cache._inner[key].item;
                if (bitmap.isError()) {
                    if (bitmap.url.indexOf('tachie') >= 0) {
                        console.error('Failed to load: ' + bitmap.url);
                        this.cache._inner[key].item = new Bitmap();
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
            _Game_Temp.prototype.getActorBitmapBodyCache = function (actor) {
                this.actorBitmapBodyCache = this.actorBitmapBodyCache || {};
                var actorId = actor.actorId();
                if (actor.temp) {
                    actorId = -1;
                }
                if (!this.actorBitmapBodyCache[actorId]) {
                    this.actorBitmapBodyCache[actorId] = new Bitmap(Graphics.width, Graphics.height);
                }
                return this.actorBitmapBodyCache[actorId];
            };
            _Game_Temp.prototype.getPictureBitmapCache = function (actorId) {
                this.actorBitmapCache = this.actorBitmapCache || {};
                if (!this.actorBitmapCache[actorId]) {
                    this.actorBitmapCache[actorId] = new Bitmap(Graphics.width, Graphics.height);
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
        var TachieDrawerMixin = function () {
            this.drawTachie = function (actorId, bitmap, x, y, rect, faceId, scale, clearByDraw) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (faceId === void 0) { faceId = 0; }
                if (scale === void 0) { scale = 1; }
                if (clearByDraw === void 0) { clearByDraw = false; }
                var actor = $gameActors.actor(actorId);
                if (!actor) {
                    console.error('アクターが存在しないため、描画をしませんでした。actorId:' + actorId);
                    return false;
                }
                return this.drawTachieActor(actor, bitmap, x, y, rect, faceId, scale, clearByDraw);
            };
            this.drawTachieActor = function (actor, bitmap, x, y, rect, faceId, scale, clearByDraw) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (faceId === void 0) { faceId = 0; }
                if (scale === void 0) { scale = 1; }
                if (clearByDraw === void 0) { clearByDraw = false; }
                if (actor.isTachieDisabled()) {
                    return true;
                }
                if (!ImageManager.isReady()) {
                    return false;
                }
                actor.preloadTachie();
                if (!ImageManager.isReady()) {
                    return false;
                }
                var point = this.calcTachieActorPos(actor);
                if (clearByDraw) {
                    bitmap.clear();
                }
                if (!rect) {
                    rect = new Rectangle(0, 0, 0, 0);
                    x += point.x;
                    y += point.y;
                }
                //rect.x += point.x;
                //rect.y += point.y;
                var cache = $gameTemp.getActorBitmapBodyCache(actor);
                actor.clearDirty();
                if (actor.isCacheChanged()) {
                    cache.clear();
                    actor.clearCacheChanged();
                    this.drawTachieHair(actor, cache);
                    this.drawTachieOuterBack(actor, cache);
                    this.drawTachieBodyBack(actor, cache);
                    this.drawTachieBackAcce(actor, cache);
                    this.drawTachieInnerBottom(actor, cache);
                    this.drawTachieInnerTop(actor, cache);
                    this.drawTachieOuterMain(actor, cache);
                    this.drawTachieMiddleAcce(actor, cache);
                    this.drawTachieBodyFront(actor, cache);
                    this.drawTachieOuterFront(actor, cache);
                }
                if (!$gameTemp.tachieTmpBitmap) {
                    $gameTemp.tachieTmpBitmap = new Bitmap(Graphics.width, Graphics.height);
                }
                var tempBitmap = $gameTemp.tachieTmpBitmap;
                this.drawTachieCache(actor, cache, bitmap, x, y, rect, scale);
                tempBitmap.clear();
                this.drawTachieHoppe(actor, tempBitmap);
                this.drawTachieFace(actor, tempBitmap, faceId);
                this.drawTachieFrontAcce(actor, tempBitmap);
                this.drawTachieCache(actor, tempBitmap, bitmap, x, y, rect, scale);
                this.lastDrawnActorId = actor.actorId();
                return true;
            };
            this.calcTachieActorPos = function (actor) {
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
            this.drawTachieCache = function (actor, cache, bitmap, x, y, rect, scale) {
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
            this.drawTachieFile = function (file, bitmap, actor, x, y, rect, scale) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (scale === void 0) { scale = 1; }
                if (!file) {
                    return;
                }
                if (!rect) {
                    rect = Rectangle.emptyRectangle;
                }
                if (useTextureAtlas) {
                    this.drawTachieTextureAtlas(file, bitmap, actor, x, y, rect, scale);
                }
                else {
                    this.drawTachieImage(file, bitmap, actor, x, y, rect, scale);
                }
            };
            this.drawTachieTextureAtlas = function (file, bitmap, actor, x, y, rect, scale) {
                var texture = PIXI.utils.TextureCache[file + '.png'];
                if (!texture) {
                    return;
                }
                var img = texture.baseTexture.source;
                var frame = texture.frame;
                var sx = frame.x;
                var sy = frame.y;
                var trim = texture.trim;
                var crop = texture.trim;
                var ww = crop.width / scale;
                var w = crop.width;
                var hh = crop.height / scale;
                var h = crop.height;
                var dx = (trim.x + rect.x);
                var dy = (trim.y + rect.y);
                bitmap.context.drawImage(img, sx, sy, ww, hh, dx + x, dy + y, w, h);
            };
            this.drawTachieImage = function (file, bitmap, actor, x, y, rect, scale) {
                var img = ImageManager.loadTachie(file);
                if (!img.isReady()) {
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
            this.drawTachieHair = function (actor, bitmap) {
                this.drawTachieFile(actor.hairFile(), bitmap, actor);
            };
            this.drawTachieOuterBack = function (actor, bitmap) {
                this.drawTachieFile(actor.outerBackFile(), bitmap, actor);
            };
            this.drawTachieOuterShadow = function (actor, bitmap) {
                this.drawTachieFile(actor.outerShadowFile(), bitmap, actor);
            };
            this.drawTachieOuterMain = function (actor, bitmap) {
                this.drawTachieFile(actor.outerMainFile(), bitmap, actor);
            };
            this.drawTachieOuterFront = function (actor, bitmap) {
                this.drawTachieFile(actor.outerFrontFile(), bitmap, actor);
            };
            this.drawTachieBodyBack = function (actor, bitmap) {
                this.drawTachieFile(actor.bodyBackFile(), bitmap, actor);
            };
            this.drawTachieBodyFront = function (actor, bitmap) {
                this.drawTachieFile(actor.bodyFrontFile(), bitmap, actor);
            };
            this.drawTachieInnerBottom = function (actor, bitmap) {
                this.drawTachieFile(actor.innerBottomFile(), bitmap, actor);
            };
            this.drawTachieInnerTop = function (actor, bitmap) {
                this.drawTachieFile(actor.innerTopFile(), bitmap, actor);
            };
            this.drawTachieHoppe = function (actor, bitmap) {
                this.drawTachieFile(actor.hoppeFile(), bitmap, actor);
            };
            this.drawTachieBackAcce = function (actor, bitmap) {
                for (var _i = 0, _a = actor.getBackAcceList(); _i < _a.length; _i++) {
                    var acceId = _a[_i];
                    this.drawTachieFile(actor.acceFile(acceId), bitmap, actor);
                }
            };
            this.drawTachieMiddleAcce = function (actor, bitmap) {
                for (var _i = 0, _a = actor.getMiddleAcceList(); _i < _a.length; _i++) {
                    var acceId = _a[_i];
                    this.drawTachieFile(actor.acceFile(acceId), bitmap, actor);
                }
            };
            this.drawTachieFrontAcce = function (actor, bitmap) {
                for (var _i = 0, _a = actor.getFrontAcceList(); _i < _a.length; _i++) {
                    var acceId = _a[_i];
                    this.drawTachieFile(actor.acceFile(acceId), bitmap, actor);
                }
            };
            this.drawTachieFace = function (actor, bitmap, faceId) {
                if (faceId === 0) {
                    faceId = actor.faceId;
                }
                var file = actor.baseId + faceId.padZero(2);
                this.drawTachieFile(file, bitmap, actor);
            };
        };
        TachieDrawerMixin.call(Sprite.prototype);
        TachieDrawerMixin.call(Window_Base.prototype);
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
                    if (actor.isDirty() || this._dirty) {
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
                if (this.lastDrawnActorId !== actorId) {
                    this.bitmap.clear();
                }
                var success = this.drawTachie(actorId, this.bitmap, 0, 0, null, 0, 1, true);
                this._dirty = !success;
            };
            return _Sprite_Picture;
        }(Sprite_Picture));
        var Window_MessageName = (function (_super) {
            __extends(Window_MessageName, _super);
            function Window_MessageName(windowHeight) {
                var width = 220;
                var height = _super.prototype.fittingHeight.call(this, 1) + 14;
                var x = Tachie.nameLeft;
                var y = Graphics.boxHeight - windowHeight - Tachie.windowMargin[0] - Tachie.windowMargin[2] - height;
                this.windowHeight = windowHeight;
                _super.call(this, x, y, width, height);
                this.padding = 8;
                this.openness = 0;
            }
            Window_MessageName.prototype.standardPadding = function () {
                return 0;
            };
            Window_MessageName.prototype.update = function () {
                _super.prototype.update.call(this);
                if ($gameTemp.sabaWaitForMovieMode > 0) {
                    this.visible = false;
                    return;
                }
                if ($gameMessage.positionType() !== 2) {
                    this.visible = false;
                    return;
                }
                this.x = Tachie.nameLeft;
                this.y = Graphics.boxHeight - this.windowHeight - Tachie.windowMargin[0] - Tachie.windowMargin[2] - this.height;
            };
            Window_MessageName.prototype.draw = function (name) {
                if (!name) {
                    this.visible = false;
                    return;
                }
                this.width = this.convertEscapeCharacters(name).length * this.standardFontSize() + 40;
                this.contents.clear();
                this.drawTextEx(name, 10, 0);
                this.open();
                this.visible = true;
            };
            return Window_MessageName;
        }(Window_Base));
        Tachie.Window_MessageName = Window_MessageName;
        var Sprite_MessageMode = (function (_super) {
            __extends(Sprite_MessageMode, _super);
            function Sprite_MessageMode(messageWindow) {
                _super.call(this);
                this._messageWindow = messageWindow;
                this._frameIndex = 1;
                this._wait = 0;
            }
            Sprite_MessageMode.prototype.update = function () {
                _super.prototype.update.call(this);
                if (!$gameTemp.isAutoMode || !this._messageWindow.isGalMode()) {
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
                if (this._frameIndex > Tachie.AUTO_MODE_MARK_TOTAL_FRAME) {
                    this._frameIndex = 1;
                }
                this._wait = 4;
            };
            return Sprite_MessageMode;
        }(Sprite_Base));
        var Sprite_WindowBalloon = (function (_super) {
            __extends(Sprite_WindowBalloon, _super);
            function Sprite_WindowBalloon(messageWindow) {
                _super.call(this);
                this._messageWindow = messageWindow;
            }
            Sprite_WindowBalloon.prototype.update = function () {
                _super.prototype.update.call(this);
                this.updatePosition();
            };
            Sprite_WindowBalloon.prototype.showBalloon = function () {
                if (!$gameTemp.tachieName) {
                    this.hide();
                    return;
                }
                if ($gameTemp.hideBalloon) {
                    this.hide();
                    return;
                }
                if ($gameMessage.positionType() !== 2) {
                    this.hide();
                    return;
                }
                if ($gameMessage.background() !== 0) {
                    this.hide();
                    return;
                }
                this.show();
                this.updateBitmap();
            };
            Sprite_WindowBalloon.prototype.hide = function () {
                this._hiding = true;
                this.visible = false;
            };
            Sprite_WindowBalloon.prototype.show = function () {
                this._hiding = false;
                this.visible = true;
            };
            Sprite_WindowBalloon.prototype.updateBitmap = function () {
                if (!Tachie.balloonEnabled) {
                    this.hide();
                    return;
                }
                if (!$gameTemp.tachieName) {
                    this.hide();
                    return;
                }
                if ($gameTemp.hideBalloon) {
                    this.hide();
                    return;
                }
                if (this._windowColorId === $gameTemp.tachieWindowColorId) {
                    return;
                }
                if ($gameTemp.tachieWindowColorId > 0) {
                    if (!this._messageWindow.isOpen()) {
                        this.hide();
                        return;
                    }
                    this._windowColorId = $gameTemp.tachieWindowColorId;
                    var color_1 = this._windowColorId;
                    if (color_1 > 0) {
                        this.bitmap = ImageManager.loadSystem('Tachie_Balloon' + color_1);
                    }
                    else {
                        this.bitmap = ImageManager.loadSystem('Tachie_Balloon');
                    }
                    this.show();
                }
                else {
                    this.hide();
                    this._windowColorId = 0;
                    this.bitmap = ImageManager.loadSystem('Tachie_Balloon');
                }
            };
            Sprite_WindowBalloon.prototype.updatePosition = function () {
                if ($gameTemp.tachieActorPos === Tachie.LEFT_POS) {
                    this.scale.x = 1;
                    this.x = (Graphics.boxWidth - Tachie.windowMargin[1] - Tachie.windowMargin[3]) / 2 - 140;
                }
                else if ($gameTemp.tachieActorPos === Tachie.RIGHT_POS) {
                    this.scale.x = -1;
                    this.x = (Graphics.boxWidth - Tachie.windowMargin[1] - Tachie.windowMargin[3]) / 2 + 140;
                }
                else if ($gameTemp.tachieActorPos === Tachie.CENTER_POS) {
                    this.scale.x = 1;
                    this.x = (Graphics.boxWidth - Tachie.windowMargin[1] - Tachie.windowMargin[3]) / 2 + 40;
                }
            };
            return Sprite_WindowBalloon;
        }(Sprite_Base));
        var Window_TachieMessage = (function (_super) {
            __extends(Window_TachieMessage, _super);
            function Window_TachieMessage() {
                this._autoModeCurrentWait = 0; // オートモード時、現在待機したフレーム数
                this._autoModeNeedWait = -1; // オートモードで次のメッセージに進むために必要なフレーム数
                this._galMode = true;
                _super.call(this);
            }
            Window_TachieMessage.prototype.windowWidth = function () {
                if (this._galMode) {
                    return Graphics.boxWidth - Tachie.windowMargin[1] - Tachie.windowMargin[3];
                }
                else {
                    return _super.prototype.windowWidth.call(this);
                }
            };
            ;
            Window_TachieMessage.prototype.numVisibleRows = function () {
                if (this._galMode) {
                    return Tachie.MESSAGE_NUM_LINES;
                }
                else {
                    return _super.prototype.numVisibleRows.call(this);
                }
            };
            Window_TachieMessage.prototype.fittingHeight = function (numLines) {
                if (this._galMode) {
                    return numLines * this.lineHeight() + this.standardPadding() * 2 + Tachie.windowPadding[0] + Tachie.windowPadding[2];
                }
                else {
                    return _super.prototype.fittingHeight.call(this, numLines);
                }
            };
            Window_TachieMessage.prototype._refreshContents = function () {
                if (this._galMode) {
                    this._windowContentsSprite.move(this.padding + 6, 0);
                }
                else {
                    _super.prototype._refreshContents.call(this);
                }
            };
            ;
            Window_TachieMessage.prototype.contentsHeight = function () {
                if (this._galMode) {
                    return this.windowHeight() - this.standardPadding() * 2 + 20;
                }
                else {
                    return _super.prototype.contentsHeight.call(this);
                }
            };
            Window_TachieMessage.prototype._updateContents = function () {
                if (this._galMode) {
                    var w = this._width - this._padding * 2;
                    var h = this._height - 0 * 2;
                    if (w > 0 && h > 0) {
                        this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
                        this._windowContentsSprite.visible = this.isOpen();
                    }
                    else {
                        this._windowContentsSprite.visible = false;
                    }
                }
                else {
                    return _super.prototype._updateContents.call(this);
                }
            };
            Window_TachieMessage.prototype.subWindows = function () {
                var ret = _super.prototype.subWindows.call(this);
                ret.push(this._messageNameWindow);
                return ret;
            };
            Window_TachieMessage.prototype.createSubWindows = function () {
                _super.prototype.createSubWindows.call(this);
                this._messageNameWindow = new Window_MessageName(this.windowHeight());
                this._balloonSprite = new Sprite_WindowBalloon(this);
                this._balloonSprite.y = -39;
                this.addChild(this._balloonSprite);
                this._modeSprite = new Sprite_MessageMode(this);
                this._modeSprite.x = Tachie.AUTO_MODE_MARK_X;
                this._modeSprite.y = Tachie.AUTO_MODE_MARK_Y;
                this.addChild(this._modeSprite);
            };
            Window_TachieMessage.prototype.update = function () {
                _super.prototype.update.call(this);
                this._updateAutoMode();
                this.updateWindowVisibility();
                if (!this._galMode) {
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
                        }
                        else {
                            this.windowskin = ImageManager.loadSystem('Window');
                        }
                    }
                    else {
                        this.clearWindowSkin();
                    }
                }
                if (this.isClosing() && this.openness < 240) {
                    this._balloonSprite.visible = false;
                    this._messageNameWindow.close();
                }
                else if (this.openness >= 255) {
                    this._balloonSprite.showBalloon();
                }
                if (!$gameTemp.tachieAvairable && !$gameMessage.isBusy() && this.isOpen()) {
                    this.close();
                }
                this.updateMessageSkip();
            };
            Window_TachieMessage.prototype.clearWindowSkin = function () {
                this._windowSkinId = 0;
                this.windowskin = ImageManager.loadSystem('Window');
                $gameTemp.tachieWindowColorId = 0;
            };
            Window_TachieMessage.prototype.updateMessageSkip = function () {
                if ($gameMessage.isChoice()) {
                    return;
                }
                if ($gameMessage.isNumberInput()) {
                    return;
                }
                if ($gameMessage.isItemChoice()) {
                    return;
                }
                if (Input.isPressed(Tachie.MESSAGE_SKIP_KEY) && !this._skipDisabled) {
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
                if (!$gameTemp.tachieName) {
                    this._messageNameWindow.visible = false;
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
                    else {
                        this._messageNameWindow.visible = false;
                    }
                    for (var _b = 0, _c = this.subWindows(); _b < _c.length; _b++) {
                        var window_2 = _c[_b];
                        window_2.visible = true;
                    }
                }
            };
            Window_TachieMessage.prototype.isTriggered = function () {
                if ($gameTemp.isAutoMode && this._autoModeCurrentWait == this._autoModeNeedWait) {
                    // オートモードで一定時間経過した
                    return true;
                }
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
                this._calcAutoModelWait();
                if (!this._galMode) {
                    return;
                }
                if (Saba.BackLog) {
                    Saba.BackLog.$gameBackLog.addLog($gameTemp.tachieName, $gameMessage.allText());
                }
                this._textState.y = this.standardPadding() + Tachie.windowPadding[0];
                this._balloonSprite.showBalloon();
                this._messageNameWindow.draw($gameTemp.tachieName);
            };
            Window_TachieMessage.prototype._calcAutoModelWait = function () {
                this._autoModeCurrentWait = 0;
                this._autoModeNeedWait = $gameMessage.calcAutoModeFrames();
            };
            Window_TachieMessage.prototype._updateAutoMode = function () {
                if (!this.visible) {
                    return;
                }
                if ($gameTemp.isAutoMode) {
                    this._autoModeCurrentWait++;
                }
                if (Input.isTriggered(Tachie.AUTO_MODE_KEY)) {
                    $gameTemp.isAutoMode = !$gameTemp.isAutoMode;
                }
            };
            Window_TachieMessage.prototype.updatePlacement = function () {
                if (this._galMode) {
                    this.x = Tachie.windowMargin[3];
                    this.y = this._positionType * (Graphics.boxHeight - this.height) / 2 - Tachie.windowMargin[2];
                }
                else {
                    _super.prototype.updatePlacement.call(this);
                }
            };
            Window_TachieMessage.prototype.terminateMessage = function () {
                $gameMessage.clear();
                if ($gameTemp.tachieAvairable) {
                    return;
                }
                this.close();
            };
            Window_TachieMessage.prototype.textAreaWidth = function () {
                if (this._galMode) {
                    return this.contentsWidth() + 20 - Tachie.windowPadding[1];
                }
                else {
                    return _super.prototype.textAreaWidth.call(this);
                }
            };
            Window_TachieMessage.prototype.standardFontSize = function () {
                if (this._galMode) {
                    return Tachie.fontSize;
                }
                else {
                    return _super.prototype.standardFontSize.call(this);
                }
            };
            Window_TachieMessage.prototype.lineHeight = function () {
                if (this._galMode) {
                    return this.standardFontSize() + 8;
                }
                else {
                    return _super.prototype.lineHeight.call(this);
                }
            };
            Window_TachieMessage.prototype.newLineX = function () {
                if (this._galMode) {
                    var x = this.isShowFace() ? Tachie.newLineXWithFace : 0;
                    return x + Tachie.windowPadding[3];
                }
                else {
                    return _super.prototype.newLineX.call(this);
                }
            };
            Window_TachieMessage.prototype.isShowFace = function () {
                if ($gameMessage.faceName() !== '') {
                    return true;
                }
                return Tachie.showTachieActorFace && $gameTemp.tachieActorId > 0;
            };
            Window_TachieMessage.prototype.drawMessageFace = function () {
                if (Tachie.showTachieActorFace && $gameTemp.tachieActorId > 0) {
                    var actor = $gameActors.actor($gameTemp.tachieActorId);
                    this.drawActorFace(actor, Tachie.messageFaceX, Tachie.messageFaceY, null, null, 0, 0, actor.faceId);
                }
                else {
                    this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), Tachie.messageFaceX, Tachie.messageFaceY);
                }
            };
            Window_TachieMessage.prototype.updateBackground = function () {
                this.refreshWindow();
                _super.prototype.updateBackground.call(this);
            };
            Window_TachieMessage.prototype.refreshWindow = function () {
                if (this._galMode) {
                    if ($gameMessage.background() !== 0 || $gameMessage.positionType() !== 2) {
                        this.clearWindowSkin();
                        this._galMode = false;
                        this.refreshWindowRect();
                    }
                }
                else {
                    if ($gameMessage.background() === 0 && $gameMessage.positionType() === 2) {
                        this._galMode = true;
                        this.refreshWindowRect();
                    }
                }
            };
            Window_TachieMessage.prototype.refreshWindowRect = function () {
                this.move(0, 0, this.windowWidth(), this.windowHeight());
                this.createContents();
                this.updatePlacement();
                this._refreshContents();
            };
            Window_TachieMessage.prototype.isGalMode = function () {
                return this._galMode;
            };
            Window_TachieMessage.prototype.convertEscapeCharacters = function (text) {
                this._skipDisabled = false;
                text = _super.prototype.convertEscapeCharacters.call(this, text);
                if (!!text.match(/\<wait\>/i)) {
                    this._skipDisabled = true;
                }
                text = text.replace(/\<wait\>/gi, '');
                return text;
            };
            Window_TachieMessage.prototype.newPage = function (textState) {
                _super.prototype.newPage.call(this, textState);
                textState.y = this.standardPadding() + Tachie.windowPadding[0];
            };
            ;
            return Window_TachieMessage;
        }(Window_Message));
        Tachie.Window_TachieMessage = Window_TachieMessage;
        Game_Message.prototype.calcAutoModeFrames = function () {
            if (this._choices.length > 0) {
                return -1;
            }
            var textCount = 0;
            for (var _i = 0, _a = this._texts; _i < _a.length; _i++) {
                var line = _a[_i];
                textCount += line.length;
            }
            return Math.floor((textCount * Tachie.AUTO_MODE_DELAY_PER_CHAR + Tachie.AUTO_MODE_DELAY_COMMON) / (1000 / 60));
        };
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
        var Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
        Scene_Boot.prototype.loadSystemImages = function () {
            Scene_Boot_loadSystemImages.call(this);
            for (var i_1 in Tachie.windowColors) {
                var color_2 = Tachie.windowColors[i_1];
                if (color_2 > 0) {
                    ImageManager.loadSystem('Tachie_Window' + color_2);
                }
            }
            if (Tachie.AUTO_MODE_KEY && Tachie.AUTO_MODE_KEY.length > 0) {
                for (var i = 0; i < Tachie.AUTO_MODE_MARK_TOTAL_FRAME; i++) {
                    ImageManager.loadSystem('Tachie_Auto_' + (i + 1));
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
    })(Tachie = Saba.Tachie || (Saba.Tachie = {}));
})(Saba || (Saba = {}));
