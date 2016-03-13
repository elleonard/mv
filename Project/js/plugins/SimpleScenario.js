var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//=============================================================================
// SimpleScenario.js
//=============================================================================
/*:ja
 * @author Sabakan
 *
 * @param autoWordWrap
 * @desc Word Wrap のプラグインの機能の自動改行用の文字列(<wrap> <br>)を自動で埋め込みます。
 * @default false
 *
 * @help
 * Ver0.1
 *
 *
 * イベント一覧(@→実装済み)
 *****************************************************************************
 * 独自コマンド
 *****************************************************************************
    @ n1 n2 n3 ... n99
        立ち絵を表示します。
    ■パラメータ
        face: number
            →表情ID
 *****************************************************************************
 * メッセージ系
 *****************************************************************************
    @ message_h
    @ message
      choice_h
      choice_if
      choice_cancel
      choice_end
      input_num
      choice_item
      scroll_h
      scroll
      scroll_end
 *****************************************************************************
 * ゲーム進行系
 *****************************************************************************
    @ sw
      var
      var_random
      var_item
      var_weapon
      var_armor
      var_actor
      var_enemy
      var_character
      var_party
      var_other
      var_script
    @ self_sw
    @ timer
 *****************************************************************************
 * フロー制御系
 *****************************************************************************
      if_sw
      if_var
      if_self_sw
      if_timer
      if_enemy
      if_character
      if_vehicle
      if_money
      if_item
      if_weapon
      if_armor
      if_button
      if_script
      else
      loop
      loop_end
      loop_break
      event_break
      return
    @ common
      label
      label_jump
      comment
      comment2
 *****************************************************************************
 * パーティ系
 *****************************************************************************
      money
      item
      weapon
      armor
      member
 *****************************************************************************
 * アクター系
 *****************************************************************************
      hp
      mp
      state
    @ all_recovery
    @ exp
    @ level
      capability
      skill
      equip
    @ name
    @ class
    @ nickname
 *****************************************************************************
 * 移動系
 *****************************************************************************
    @ map_move
    @ vehicle_pos
    @ event_pos
    @ scroll_map
    @ route_h
    @ route
    @ vehicle
 *****************************************************************************
 * キャラクター系
 *****************************************************************************
    @ transparent
    @ followers
    @ gather
    @ anime
    @ balloon
    @ erace
 *****************************************************************************
 * 画面効果系
 *****************************************************************************
    @ fadeout
    @ fadein
    @ tone
    @ flash
    @ shake
 *****************************************************************************
 * 時間調整系
 *****************************************************************************
    @ wait
 *****************************************************************************
 * ピクチャと天候系
 *****************************************************************************
    @ picture
    @ picture_move
    @ picture_rotation
    @ picture_tone
    @ picture_erace
    @ weather
 *****************************************************************************
 * 音楽と効果音系
 *****************************************************************************
    @ bgm
    @ fadeout_bgm
    @ save_bgm
    @ resume_bgm
    @ bgs
    @ fadeout_bgs
    @ me
    @ se
 *****************************************************************************
 * シーン制御系
 *****************************************************************************
      battle
      battle_win
      battle_escape
      battle_loss
      battle_end
      shop
      input_name
      menu_open
      save_open
      gameover
      battle_bgm
      battle_end_me
      title_return
 *****************************************************************************
 * システム設定系
 *****************************************************************************
      battle_bgm
      battle_end_me
    @ save_disable
    @ menu_disable
    @ encount_disable
    @ formation_disable
      window_color
      actor_graphic
      vehicle_graphic
 *****************************************************************************
 * ムービー系
 *****************************************************************************
    @ movie
 *****************************************************************************
 * マップ系
 *****************************************************************************
      map_name_disable
      tileset
      battle_background
      parallax
      pos_info
 *****************************************************************************
 * バトル系
 *****************************************************************************
      enemy_hp
      enemy_mp
      enemy_state
      enemy_all_recovery
      enemy_appear
      enemy_trans
      battle_anime
      force
      battle_abort
 *****************************************************************************
 * 上級系
 *****************************************************************************
      script
      script2
      plugin
 *****************************************************************************
 * その他
 *****************************************************************************
      end
 */
var SimpleScenario;
(function (SimpleScenario) {
    var parameters = PluginManager.parameters('SimpleScenario');
    var AUTO_WARD_WRAP = parameters['autoWordWrap'] === 'true';
    if (Utils.isNwjs()) {
        var fs = require('fs');
        var path = require('path');
    }
    var SCENARIO_FILE_NAME = 'Scenario.json';
    var SCENARIO_PATH = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/../scenario/');
    var DATA_PATH = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/');
    DataManager.loadDataFile('$dataScenraio', SCENARIO_FILE_NAME);
    // 変換ボタン。F7
    Input.keyMapper[118] = 'debug2';
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    var _Scene_Map_update = Scene_Map.prototype.update;
    var _Game_Interpreter = (function (_super) {
        __extends(_Game_Interpreter, _super);
        function _Game_Interpreter() {
            _super.apply(this, arguments);
        }
        _Game_Interpreter.prototype.pluginCommand = function (command, args) {
            _Game_Interpreter_pluginCommand.call(this, command, args);
            if (command === 'Scenario' || command === 'scenario') {
                var id = args[0];
                var list = $dataScenraio[id];
                if (!list) {
                    throw new Error('id:' + id + ' のデータが見つかりません');
                }
                console.log(list);
                this.setupChild(list, this._eventId);
            }
        };
        return _Game_Interpreter;
    }(Game_Interpreter));
    var _Scene_Map = (function (_super) {
        __extends(_Scene_Map, _super);
        function _Scene_Map() {
            _super.apply(this, arguments);
        }
        _Scene_Map.prototype.update = function () {
            _Scene_Map_update.call(this);
            this.updateConvertScenario();
        };
        _Scene_Map.prototype.updateConvertScenario = function () {
            if (Input.isTriggered('debug2') && $gameTemp.isPlaytest()) {
                SoundManager.playSave();
                var converter = new Scenario_Converter();
                converter.convertAll();
            }
        };
        return _Scene_Map;
    }(Scene_Map));
    var _DataManager_checkError = DataManager.checkError;
    DataManager.checkError = function () {
        if (DataManager._errorUrl && DataManager._errorUrl.indexOf(SCENARIO_FILE_NAME) >= 0) {
            console.error('Failed to load: ' + DataManager._errorUrl);
            DataManager._errorUrl = null;
        }
        _DataManager_checkError.call(this);
    };
    /**
     * シナリオテキストをMVで使えるJSON形式に変換するクラスです
     */
    var Scenario_Converter = (function () {
        function Scenario_Converter() {
        }
        /**
         * 全てのシナリオを変換します。
         */
        Scenario_Converter.prototype.convertAll = function () {
            var self = this;
            var scenario = {};
            fs.readdir(SCENARIO_PATH, function (err, files) {
                if (err) {
                    console.error(err.message);
                    return;
                }
                console.log(files);
                if (!files) {
                    return;
                }
                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                    var file = files_1[_i];
                    console.log(file);
                    var filePath = path.resolve(SCENARIO_PATH, file);
                    var stat = fs.statSync(filePath);
                    if (stat.isDirectory()) {
                        var files2 = fs.readdirSync(filePath);
                        for (var _a = 0, files2_1 = files2; _a < files2_1.length; _a++) {
                            var file2 = files2_1[_a];
                            var index_1 = file2.indexOf('.txt');
                            if (index_1 === -1) {
                                continue;
                            }
                            var name_1 = file2.substr(0, index_1);
                            var text_1 = fs.readFileSync(filePath + '/' + file2, 'utf8');
                            scenario[name_1] = self.convert(file2, text_1);
                        }
                        continue;
                    }
                    var index = file.indexOf('.txt');
                    if (index === -1) {
                        continue;
                    }
                    var name_2 = file.substr(0, index);
                    var text = fs.readFileSync(SCENARIO_PATH + file, 'utf8');
                    scenario[name_2] = self.convert(file, text);
                }
                console.log(scenario);
                fs.writeFileSync(DATA_PATH + 'Scenario.json', JSON.stringify(scenario));
                DataManager.loadDataFile('$dataScenraio', SCENARIO_FILE_NAME);
            });
        };
        Scenario_Converter.prototype.convert = function (file, text) {
            this.indent = 0;
            var list = [];
            var lines = text.split('\n');
            var blocks = [];
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                line = this.removeWS(line);
                var block = new Block(i + 1);
                if (line.length === 0) {
                    continue;
                }
                if (line.indexOf('//') === 0) {
                    continue;
                }
                if (line.indexOf('@') === 0) {
                    block.header = line;
                    var offset = 1;
                    while (i + offset < lines.length && (lines[i + offset].indexOf('@') === -1 || lines[i + offset].indexOf('@route') !== -1) && lines[i + offset].length > 0) {
                        block.pushMsg(this.removeWS(lines[i + offset]));
                        offset++;
                    }
                    i += offset - 1;
                }
                else {
                    block.header = '@messages';
                    var offset = 0;
                    while (i + offset < lines.length && lines[i + offset].indexOf('@') === -1 && lines[i + offset].length > 0) {
                        block.pushMsg(this.removeWS(lines[i + offset]));
                        offset++;
                    }
                    i += offset - 1;
                }
                blocks.push(block);
            }
            for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
                var block = blocks_1[_i];
                this.convertCommand(file, list, block);
            }
            return list;
        };
        /**
         * ホワイトスペースを削除します。
         */
        Scenario_Converter.prototype.removeWS = function (line) {
            var ret = line.replace(/^\s+/g, '');
            if (ret === '_') {
                return '';
            }
            else {
                return ret;
            }
        };
        /**
         * コマンドを変換します。
         */
        Scenario_Converter.prototype.convertCommand = function (file, list, block) {
            var headerList = block.header.split(' ');
            var command = headerList[0].substr(1);
            var header = this.parseHeader(headerList);
            var context = new Context(file, block.lineNumber, command, list, header, block.data);
            var n = /n(\d+)/.exec(command);
            var cos = /cos(\d+)/.exec(command);
            try {
                this.validate(context);
                if (n) {
                    this['convertCommand_n'](parseInt(n[1]), context);
                }
                else if (cos) {
                    this['convertCommand_cos'](parseInt(cos[1]), context);
                }
                else {
                    this['convertCommand_' + command](context);
                }
            }
            catch (e) {
                console.error(command + 'のコマンドでエラーが発生しました');
                console.log(e);
                console.log(e.stack);
                throw e;
            }
        };
        /**
         * コマンドのパラメータが正しいかどうかを検証します。
         * @param {Context} context [description]
         */
        Scenario_Converter.prototype.validate = function (context) {
            var validaor = SimpleScenario.validates[context.command];
            if (!validaor) {
                console.error(context.command + 'のコマンドの Validator が存在しません');
                return;
            }
            for (var paramName in validaor) {
                if (!validaor.hasOwnProperty(paramName)) {
                    continue;
                }
                var vv = validaor[paramName];
                if (!vv) {
                    console.error(context.command + " " + paramName + " \u306EValidator \u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
                    continue;
                }
                if (Array.isArray(vv)) {
                    var validatorList = vv;
                    for (var _i = 0, validatorList_1 = validatorList; _i < validatorList_1.length; _i++) {
                        var v = validatorList_1[_i];
                        if (!v) {
                            console.error(context.command + " " + paramName + " \u306EValidator \u304C\u5B58\u5728\u3057\u307E\u305B\u3093");
                            continue;
                        }
                        v.validate(context, paramName, context.header[paramName]);
                    }
                }
                else {
                    vv.validate(context, paramName, context.header[paramName]);
                }
            }
        };
        /**
         * ヘッダをパースします。
         */
        Scenario_Converter.prototype.parseHeader = function (headerList) {
            var result = {};
            for (var i = 1; i < headerList.length; i++) {
                var text = headerList[i];
                var data = text.split('=');
                result[data[0]] = data[1];
            }
            return new Header(result);
        };
        Scenario_Converter.prototype.convertCommand_start = function (context) {
            this.defaultPosMap = {};
        };
        Scenario_Converter.prototype.convertCommand_end = function (context) {
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': ["Tachie notClose off"] });
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': ["Tachie hide"] });
        };
        Scenario_Converter.prototype.convertCommand_default_pos = function (context) {
            var actorId = parseInt(context.header['actor']);
            var pos = context.header['pos'] === 'right' ? 2 : 1;
            this.defaultPosMap[actorId] = pos;
        };
        Scenario_Converter.prototype.convertCommand_not_close = function (context) {
            var flag = context.header['flag'];
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie notClose " + flag)] });
        };
        Scenario_Converter.prototype.convertCommand_n = function (actorId, context) {
            var pos = this.defaultPosMap[actorId] || 1;
            if (context.header['pos']) {
                pos = parseInt(context.header['pos']);
            }
            if (context.header['face']) {
                var face = parseInt(context.header['face']);
                context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie face " + actorId + " " + face)] });
            }
            if (context.header['pose']) {
                var pose = parseInt(context.header['pose']);
                context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie pose " + actorId + " " + pose)] });
            }
            if (context.header['hoppe']) {
                var hoppe = parseInt(context.header['hoppe']);
                context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie hoppe " + actorId + " " + hoppe)] });
            }
            var name = '\\N[' + actorId + ']';
            if (context.header['name']) {
                name = context.header['name'];
            }
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie showName " + name)] });
            var x = 0;
            var y = 0;
            if (pos === Tachie.LEFT_POS) {
                context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie showLeft " + actorId + " " + x + " " + y + " 100")] });
            }
            else {
                context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie showRight " + actorId + " " + x + " " + y + " 100")] });
            }
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': ['MessageName open ' + $gameActors.actor(actorId).name()] });
            this.convertCommand_messages(context);
        };
        Scenario_Converter.prototype.convertCommand_messages = function (context) {
            context.push({ 'code': 101, 'indent': this.indent, 'parameters': ['', 0, 0, 2] });
            for (var _i = 0, _a = context.data; _i < _a.length; _i++) {
                var msg = _a[_i];
                context.push({ 'code': 401, 'indent': this.indent, 'parameters': [msg] });
            }
        };
        Scenario_Converter.prototype.convertCommand_cos = function (actorId, context) {
            var types = ['outer', 'innerTop', 'innerBottom'];
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var type = types_1[_i];
                if (context.header[type]) {
                    var outer = context.header[type];
                    context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie " + type + " " + actorId + " " + outer)] });
                }
            }
        };
        Scenario_Converter.prototype.convertCommand_message_h = function (context) {
            var actor = context.header['actor'] || '';
            var index = context.headerInt('index', 0);
            var back = context.headerInt('back', 0);
            var pos = context.headerInt('pos', 2);
            context.push({ 'code': 101, 'indent': this.indent, 'parameters': [actor, index, back, pos] });
            for (var _i = 0, _a = context.data; _i < _a.length; _i++) {
                var msg = _a[_i];
                context.push({ 'code': 401, 'indent': this.indent, 'parameters': [msg] });
            }
        };
        Scenario_Converter.prototype.convertCommand_message = function (context) {
            var value = context.header['value'];
            context.push({ 'code': 401, 'indent': this.indent, 'parameters': [value] });
        };
        Scenario_Converter.prototype.convertCommand_common = function (context) {
            var id = context.headerInt('id');
            context.push({ 'code': 117, 'indent': this.indent, 'parameters': [id] });
        };
        Scenario_Converter.prototype.convertCommand_sw = function (context) {
            var id = context.headerInt('id');
            var end = context.headerInt('end', id);
            var flag = context.headerStr('flag') === 'on' ? 0 : 1;
            context.push({ 'code': 121, 'indent': this.indent, 'parameters': [id, end, flag] });
        };
        Scenario_Converter.prototype.convertCommand_var = function (context) {
            var id = context.headerInt('id');
            var end = context.headerInt('end', id);
            var op = context.headerStr('op');
            context.push({ 'code': 122, 'indent': this.indent, 'parameters': [id, end, op, 0] });
        };
        Scenario_Converter.prototype.convertCommand_self_sw = function (context) {
            var id = context.headerInt('id');
            var flag = context.headerStr('flag') === 'on' ? 0 : 1;
            context.push({ 'code': 123, 'indent': this.indent, 'parameters': [id, flag] });
        };
        Scenario_Converter.prototype.convertCommand_timer = function (context) {
            var flag = context.headerStr('flag') === 'on' ? 0 : 1;
            var time = context.headerInt('time');
            context.push({ 'code': 124, 'indent': this.indent, 'parameters': [flag, time] });
        };
        Scenario_Converter.prototype.convertCommand_save_disable = function (context) {
            var flag = context.headerBool('flag', true) ? 0 : 1;
            context.push({ 'code': 134, 'indent': this.indent, 'parameters': [flag] });
        };
        Scenario_Converter.prototype.convertCommand_menu_disable = function (context) {
            var flag = context.headerBool('flag', true) ? 0 : 1;
            context.push({ 'code': 135, 'indent': this.indent, 'parameters': [flag] });
        };
        Scenario_Converter.prototype.convertCommand_encount_disable = function (context) {
            var flag = context.headerBool('flag', true) ? 0 : 1;
            context.push({ 'code': 136, 'indent': this.indent, 'parameters': [flag] });
        };
        Scenario_Converter.prototype.convertCommand_formation_disable = function (context) {
            var flag = context.headerBool('flag', true) ? 0 : 1;
            context.push({ 'code': 137, 'indent': this.indent, 'parameters': [flag] });
        };
        Scenario_Converter.prototype.convertCommand_map_move = function (context) {
            var direction;
            switch (context.headerStr('direction')) {
                case '2':
                case 'down':
                    direction = 2;
                    break;
                case '4':
                case 'left':
                    direction = 4;
                    break;
                case '6':
                case 'right':
                    direction = 6;
                    break;
                case '8':
                case 'up':
                    direction = 8;
            }
            var fade;
            switch (context.headerStr('fade')) {
                case '1':
                case 'white':
                    fade = 1;
                    break;
                case '2':
                case 'none':
                    fade = 2;
                    break;
                default:
                    fade = 0;
            }
            var type = context.headerStr('type', 'const') === 'const' ? 0 : 1;
            var map = context.headerInt('map');
            var x = context.headerInt('x');
            var y = context.headerInt('y');
            context.push({ 'code': 201, 'indent': this.indent, 'parameters': [type, map, x, y, direction, fade] });
        };
        Scenario_Converter.prototype.convertCommand_vehicle_pos = function (context) {
            var vehicle = context.headerInt('vehicle');
            var type = context.headerStr('type', 'const') === 'const' ? 0 : 1;
            var map = context.headerInt('map');
            var x = context.headerInt('x');
            var y = context.headerInt('y');
            context.push({ 'code': 202, 'indent': this.indent, 'parameters': [vehicle, type, map, x, y] });
        };
        Scenario_Converter.prototype.convertCommand_event_pos = function (context) {
            var id = context.headerInt('id');
            var type;
            if (context.headerStr('type') === 'var') {
                type = 1;
            }
            else if (context.headerStr('type') === 'var') {
                type = 2;
            }
            else {
                type = 0;
            }
            var x = context.headerInt('x');
            var y = context.headerInt('y');
            var direction;
            switch (context.headerStr('direction')) {
                case '2':
                case 'down':
                    direction = 2;
                    break;
                case '4':
                case 'left':
                    direction = 4;
                    break;
                case '6':
                case 'right':
                    direction = 6;
                    break;
                case '8':
                case 'up':
                    direction = 8;
                    break;
                default:
                    direction = 0;
                    break;
            }
            context.push({ 'code': 203, 'indent': this.indent, 'parameters': [id, type, x, y, direction] });
        };
        Scenario_Converter.prototype.convertCommand_scroll_map = function (context) {
            var direction;
            switch (context.headerStr('direction')) {
                case '2':
                case 'down':
                    direction = 2;
                    break;
                case '4':
                case 'left':
                    direction = 4;
                    break;
                case '6':
                case 'right':
                    direction = 6;
                    break;
                case '8':
                case 'up':
                    direction = 8;
                    break;
            }
            var num = context.headerInt('num');
            var speed = context.headerInt('speed', 4);
            context.push({ 'code': 204, 'indent': this.indent, 'parameters': [direction, num, speed] });
        };
        Scenario_Converter.prototype.convertCommand_route_h = function (context) {
            var event = context.headerInt('event');
            var repeat = context.headerBool('repeat', false);
            var skip = context.headerBool('skip', false);
            var wait = context.headerBool('wait', true);
            if (context.data.length === 0) {
                context.error('移動ルートが設定されていません。');
                return;
            }
            var list = [];
            for (var _i = 0, _a = context.data; _i < _a.length; _i++) {
                var line = _a[_i];
                list.push(this.convertCommand_route(context, line));
            }
            var routes = { repeat: repeat, skippable: skip, wait: wait, list: list };
            context.push({ 'code': 205, 'indent': this.indent, 'parameters': [event, routes] });
        };
        Scenario_Converter.prototype.convertCommand_route = function (context, line) {
            var headerList = line.split(' ');
            var header = this.parseHeader(headerList);
            var type = header.headerStr('type');
            var parameters = [];
            var code = parseInt(type);
            if (isNaN(code)) {
                switch (type) {
                    case 'down':
                        code = 1;
                        break;
                    case 'left':
                        code = 2;
                        break;
                    case 'right':
                        code = 3;
                        break;
                    case 'up':
                        code = 4;
                        break;
                    case 'dl':
                        code = 5;
                        break;
                    case 'dr':
                        code = 6;
                        break;
                    case 'ul':
                        code = 7;
                        break;
                    case 'ur':
                        code = 8;
                        break;
                    case 'random':
                        code = 9;
                        break;
                    case 'toward':
                        code = 10;
                        break;
                    case 'away':
                        code = 11;
                        break;
                    case 'foward':
                        code = 12;
                        break;
                    case 'backward':
                        code = 13;
                        break;
                    case 'jump':
                        code = 14;
                        new SimpleScenario.NumericValidator(-100, 100).validate(context, 'x', header['x']);
                        new SimpleScenario.NumericValidator(-100, 100).validate(context, 'y', header['y']);
                        parameters.push(header.headerInt('x', 0));
                        parameters.push(header.headerInt('y', 0));
                        break;
                    case 'wait':
                        code = 15;
                        new SimpleScenario.NumericValidator(1, 999).validate(context, 'time', header['time']);
                        parameters.push(header.headerInt('time', 60));
                        break;
                    case 'turn_down':
                        code = 16;
                        break;
                    case 'turn_left':
                        code = 17;
                        break;
                    case 'turn_right':
                        code = 18;
                        break;
                    case 'turn_up':
                        code = 19;
                        break;
                    case 'turn_90_r':
                        code = 20;
                        break;
                    case 'turn_90_l':
                        code = 21;
                        break;
                    case 'turn_180':
                        code = 22;
                        break;
                    case 'turn_90_rl':
                    case 'turn_90_lr':
                        code = 23;
                        break;
                    case 'turn_random':
                        code = 24;
                        break;
                    case 'turn_toward':
                        code = 25;
                        break;
                    case 'turn_away':
                        code = 26;
                        break;
                    case 'switch_on':
                    case 'sw_on':
                        code = 27;
                        new SimpleScenario.NotEmptyValidator().validate(context, 'id', header['id']);
                        new SimpleScenario.NumericValidator(1).validate(context, 'id', header['id']);
                        parameters.push(header.headerInt('id'));
                        break;
                    case 'switch_off':
                    case 'sw_off':
                        code = 28;
                        new SimpleScenario.NotEmptyValidator().validate(context, 'id', header['id']);
                        new SimpleScenario.NumericValidator(1).validate(context, 'id', header['id']);
                        parameters.push(header.headerInt('id'));
                        break;
                    case 'change_speed':
                        code = 29;
                        new SimpleScenario.NumericValidator(1, 6).validate(context, 'speed', header['speed']);
                        parameters.push(header.headerInt('speed', 3));
                        break;
                    case 'change_freq':
                        code = 30;
                        new SimpleScenario.NumericValidator(1, 5).validate(context, 'freq', header['freq']);
                        parameters.push(header.headerInt('freq', 3));
                        break;
                    case 'walk_anime_on':
                        code = 31;
                        break;
                    case 'walk_anime_off':
                        code = 32;
                        break;
                    case 'step_anime_on':
                        code = 33;
                        break;
                    case 'step_anime_off':
                        code = 34;
                        break;
                    case 'dir_fix_on':
                        code = 35;
                        break;
                    case 'dir_fix_off':
                        code = 36;
                        break;
                    case 'through_on':
                        code = 37;
                        break;
                    case 'through_off':
                        code = 38;
                        break;
                    case 'transparent_on':
                        code = 39;
                        break;
                    case 'transparent_off':
                        code = 40;
                        break;
                    case 'change_graphic':
                        code = 41;
                        new SimpleScenario.NotEmptyValidator().validate(context, 'file', header['file']);
                        new SimpleScenario.NotEmptyValidator().validate(context, 'index', header['index']);
                        new SimpleScenario.NumericValidator(0, 7).validate(context, 'index', header['index']);
                        parameters.push(header.headerStr('file'));
                        parameters.push(header.headerInt('index'));
                        break;
                    case 'change_opacity':
                        code = 42;
                        new SimpleScenario.NumericValidator(0, 255).validate(context, 'opacity', header['opacity']);
                        parameters.push(header.headerInt('opacity', 255));
                        break;
                    case 'change_blend':
                        code = 43;
                        new SimpleScenario.NumericValidator(0, 2).validate(context, 'blend', header['blend']);
                        parameters.push(header.headerInt('blend', 0));
                        break;
                    case 'play_se':
                        code = 44;
                        new SimpleScenario.NumericValidator(0, 100).validate(context, 'volume', header['volume']);
                        new SimpleScenario.NumericValidator(50, 150).validate(context, 'pitch', header['pitch']);
                        new SimpleScenario.NumericValidator(-100, 100).validate(context, 'pan', header['pan']);
                        var file = header.headerStr('file', '');
                        var volume = header.headerInt('volume', 100);
                        var pitch = header.headerInt('pitch', 100);
                        var pan = header.headerInt('pitch', 0);
                        parameters.push({ file: file, volume: volume, pitch: pitch, pan: pan });
                        break;
                    case 'script':
                        code = 45;
                        new SimpleScenario.NotEmptyValidator().validate(context, 'script', header['script']);
                        var script = header['script'];
                        script = script.replace(/<!!>/g, '=');
                        script = script.replace(/<ii>/g, ' ');
                        parameters.push(script);
                        break;
                    default:
                        context.error('存在しない移動コマンドです。' + type);
                        break;
                }
            }
            return { code: code, indent: null };
        };
        Scenario_Converter.prototype.convertCommand_vehicle = function (context) {
            context.push({ 'code': 206, 'indent': this.indent, 'parameters': [] });
        };
        Scenario_Converter.prototype.convertCommand_transparent = function (context) {
            var flag = context.headerBool('flag', true) ? 0 : 1;
            context.push({ 'code': 211, 'indent': this.indent, 'parameters': [flag] });
        };
        Scenario_Converter.prototype.convertCommand_anime = function (context) {
            var target = context.headerInt('target');
            var balloon = context.headerInt('balloon');
            var wait = context.headerBool('wait', false);
            context.push({ 'code': 212, 'indent': this.indent, 'parameters': [target, balloon, wait] });
        };
        Scenario_Converter.prototype.convertCommand_balloon = function (context) {
            var target = context.headerInt('target');
            var balloon = context.headerInt('balloon');
            var wait = context.headerBool('wait', false);
            context.push({ 'code': 213, 'indent': this.indent, 'parameters': [target, balloon, wait] });
        };
        Scenario_Converter.prototype.convertCommand_erace = function (context) {
            context.push({ 'code': 214, 'indent': this.indent, 'parameters': [] });
        };
        Scenario_Converter.prototype.convertCommand_followers = function (context) {
            var flag = context.headerBool('flag', true) ? 0 : 1;
            context.push({ 'code': 216, 'indent': this.indent, 'parameters': [flag] });
        };
        Scenario_Converter.prototype.convertCommand_gather = function (context) {
            context.push({ 'code': 217, 'indent': this.indent, 'parameters': [] });
        };
        Scenario_Converter.prototype.convertCommand_fadeout = function (context) {
            context.push({ 'code': 221, 'indent': this.indent, 'parameters': [] });
        };
        Scenario_Converter.prototype.convertCommand_fadein = function (context) {
            context.push({ 'code': 222, 'indent': this.indent, 'parameters': [] });
        };
        Scenario_Converter.prototype.convertCommand_tone = function (context) {
            var tone = context.headerTone();
            var time = context.headerInt('time', 60);
            var wait = context.headerBool('wait', true);
            context.push({ 'code': 223, 'indent': this.indent, 'parameters': [tone, time, wait] });
        };
        Scenario_Converter.prototype.convertCommand_flash = function (context) {
            var red = context.headerInt('red', 255);
            var green = context.headerInt('green', 255);
            var blue = context.headerInt('blue', 255);
            var strength = context.headerInt('strength', 170);
            var color = [red, green, blue, strength];
            var time = context.headerInt('time', 60);
            var wait = context.headerBool('wait', true);
            context.push({ 'code': 224, 'indent': this.indent, 'parameters': [color, time, wait] });
        };
        Scenario_Converter.prototype.convertCommand_shake = function (context) {
            var strength = context.headerInt('strength', 5);
            var speed = context.headerInt('speed', 5);
            var time = context.headerInt('time', 60);
            var wait = context.headerBool('wait', true);
            context.push({ 'code': 225, 'indent': this.indent, 'parameters': [strength, speed, time, wait] });
        };
        Scenario_Converter.prototype.convertCommand_wait = function (context) {
            var time = context.headerInt('time', 60);
            context.push({ 'code': 230, 'indent': this.indent, 'parameters': [time] });
        };
        Scenario_Converter.prototype.convertCommand_picture = function (context) {
            var layer = context.headerInt('layer');
            var file = context.header['file'];
            var origin = context.header['origin'] === 'center' ? 1 : 0;
            var type = context.header['type'] === 'var' ? 1 : 0;
            var x = context.headerInt('x', 0);
            var y = context.headerInt('y', 0);
            var zoomX = context.headerInt('zoom_x', 100);
            var zoomy = context.headerInt('zoom_y', 100);
            var opacity = context.headerInt('transparent', 255);
            var blend = context.headerInt('blend', 0);
            context.push({ 'code': 231, 'indent': this.indent, 'parameters': [layer, file, origin, type, x, y, zoomX, zoomy, opacity, blend] });
        };
        Scenario_Converter.prototype.convertCommand_picture_move = function (context) {
            var layer = context.headerInt('layer');
            var origin = context.headerInt('origin', 0);
            var type = context.header['type'] === 'var' ? 1 : 0;
            var x = context.headerInt('x', 0);
            var y = context.headerInt('y', 0);
            var zoomX = context.headerInt('zoom_x', 100);
            var zoomy = context.headerInt('zoom_y', 100);
            var opacity = context.headerInt('transparent', 255);
            var blend = context.headerInt('blend', 0);
            var time = context.headerInt('time', 0);
            var wait = context.headerBool('wait', true);
            context.push({ 'code': 232, 'indent': this.indent, 'parameters': [layer, origin, type, x, y, zoomX, zoomy, opacity, blend, time, wait] });
        };
        Scenario_Converter.prototype.convertCommand_picture_rotation = function (context) {
            var layer = context.headerInt('layer');
            var speed = context.headerInt('speed', 5);
            context.push({ 'code': 233, 'indent': this.indent, 'parameters': [layer, speed] });
        };
        Scenario_Converter.prototype.convertCommand_picture_tone = function (context) {
            var layer = context.headerInt('layer');
            var tone = context.headerTone();
            var time = context.headerInt('time', 60);
            var wait = context.headerBool('wait', true);
            context.push({ 'code': 234, 'indent': this.indent, 'parameters': [layer, tone, time, wait] });
        };
        Scenario_Converter.prototype.convertCommand_picture_erace = function (context) {
            var layer = context.headerInt('layer');
            context.push({ 'code': 235, 'indent': this.indent, 'parameters': [layer] });
        };
        Scenario_Converter.prototype.convertCommand_picture_weather = function (context) {
            var weather = context.headerStr('weather', 'none');
            var strength = context.headerInt('strength', 5);
            var time = context.headerInt('time', 60);
            var wait = context.headerBool('wait', true);
            context.push({ 'code': 236, 'indent': this.indent, 'parameters': [weather, strength, time, wait] });
        };
        Scenario_Converter.prototype.convertCommand_bgm = function (context) {
            var name = context.headerStr('file');
            var volume = context.headerInt('volume', 100);
            var pitch = context.headerInt('pitch', 100);
            var pan = context.headerInt('pan', 100);
            var bgm = { name: name, volume: volume, pitch: pitch, pan: pan };
            context.push({ 'code': 241, 'indent': this.indent, 'parameters': [bgm] });
        };
        Scenario_Converter.prototype.convertCommand_fadeout_bgm = function (context) {
            var time = context.headerInt('time', 10);
            context.push({ 'code': 242, 'indent': this.indent, 'parameters': [time] });
        };
        Scenario_Converter.prototype.convertCommand_save_bgm = function (context) {
            context.push({ 'code': 243, 'indent': this.indent, 'parameters': [] });
        };
        Scenario_Converter.prototype.convertCommand_resume_bgm = function (context) {
            context.push({ 'code': 244, 'indent': this.indent, 'parameters': [] });
        };
        Scenario_Converter.prototype.convertCommand_bgs = function (context) {
            var name = context.headerStr('file');
            var volume = context.headerInt('volume', 100);
            var pitch = context.headerInt('pitch', 100);
            var pan = context.headerInt('pan', 100);
            var bgs = { name: name, volume: volume, pitch: pitch, pan: pan };
            context.push({ 'code': 245, 'indent': this.indent, 'parameters': [bgs] });
        };
        Scenario_Converter.prototype.convertCommand_fadeout_bgs = function (context) {
            var time = context.headerInt('time', 10);
            context.push({ 'code': 246, 'indent': this.indent, 'parameters': [time] });
        };
        Scenario_Converter.prototype.convertCommand_me = function (context) {
            var name = context.headerStr('file');
            var volume = context.headerInt('volume', 100);
            var pitch = context.headerInt('pitch', 100);
            var pan = context.headerInt('pan', 100);
            var me = { name: name, volume: volume, pitch: pitch, pan: pan };
            context.push({ 'code': 249, 'indent': this.indent, 'parameters': [me] });
        };
        Scenario_Converter.prototype.convertCommand_se = function (context) {
            var name = context.headerStr('file');
            var volume = context.headerInt('volume', 100);
            var pitch = context.headerInt('pitch', 100);
            var pan = context.headerInt('pan', 100);
            var se = { name: name, volume: volume, pitch: pitch, pan: pan };
            context.push({ 'code': 250, 'indent': this.indent, 'parameters': [se] });
        };
        Scenario_Converter.prototype.convertCommand_stop_se = function (context) {
            context.push({ 'code': 251, 'indent': this.indent, 'parameters': [] });
        };
        Scenario_Converter.prototype.convertCommand_stop_movie = function (context) {
            var file = context.headerStr('file');
            context.push({ 'code': 261, 'indent': this.indent, 'parameters': [file] });
        };
        Scenario_Converter.prototype.convertCommand_all_recovery = function (context) {
            var params = context.headerVar('actor');
            context.push({ 'code': 314, 'indent': this.indent, 'parameters': [params[0], params[1]] });
        };
        Scenario_Converter.prototype.convertCommand_exp = function (context) {
            var actor = context.headerVar('actor');
            var value = context.headerOperateVar('value');
            var message = context.headerBool('message', false);
            context.push({ 'code': 315, 'indent': this.indent, 'parameters': [actor[0], actor[1], value[0], value[1], value[2], message] });
        };
        Scenario_Converter.prototype.convertCommand_level = function (context) {
            var actor = context.headerVar('actor');
            var value = context.headerOperateVar('value');
            var message = context.headerBool('message', false);
            context.push({ 'code': 316, 'indent': this.indent, 'parameters': [actor[0], actor[1], value[0], value[1], value[2], message] });
        };
        Scenario_Converter.prototype.convertCommand_name = function (context) {
            var actor = context.headerInt('actor');
            var value = context.headerStr('value');
            context.push({ 'code': 320, 'indent': this.indent, 'parameters': [actor, value] });
        };
        Scenario_Converter.prototype.convertCommand_class = function (context) {
            var actor = context.headerInt('actor');
            var value = context.headerInt('value');
            var keep_exp = context.headerBool('keep_exp', false);
            context.push({ 'code': 321, 'indent': this.indent, 'parameters': [actor, value, keep_exp] });
        };
        Scenario_Converter.prototype.convertCommand_nickname = function (context) {
            var actor = context.headerInt('actor');
            var value = context.headerInt('value');
            context.push({ 'code': 323, 'indent': this.indent, 'parameters': [actor, value] });
        };
        return Scenario_Converter;
    }());
    var Block = (function () {
        function Block(lineNumber) {
            this.lineNumber = lineNumber;
            this.data = [];
        }
        Block.prototype.pushMsg = function (line) {
            if (AUTO_WARD_WRAP && line.indexOf('@') === -1) {
                if (this.data.length === 0) {
                    this.data.push('<wrap>' + line);
                }
                else {
                    this.data.push('<br>' + line);
                }
            }
            else {
                this.data.push(line);
            }
        };
        return Block;
    }());
    var Context = (function () {
        function Context(file, lineNumber, command, list, _header, data) {
            this.file = file;
            this.lineNumber = lineNumber;
            this.command = command;
            this.list = list;
            this._header = _header;
            this.data = data;
        }
        Context.prototype.push = function (command) {
            this.list.push(command);
        };
        Object.defineProperty(Context.prototype, "header", {
            get: function () {
                return this._header.header;
            },
            enumerable: true,
            configurable: true
        });
        Context.prototype.headerInt = function (id, defaultValue) {
            if (defaultValue === void 0) { defaultValue = 0; }
            return this._header.headerInt(id, defaultValue);
        };
        Context.prototype.headerStr = function (id, defaultValue) {
            if (defaultValue === void 0) { defaultValue = ''; }
            return this._header.headerStr(id, defaultValue);
        };
        Context.prototype.headerBool = function (id, defaultValue) {
            if (defaultValue === void 0) { defaultValue = false; }
            return this._header.headerBool(id, defaultValue);
        };
        Context.prototype.headerTone = function () {
            return this._header.headerTone();
        };
        Context.prototype.headerVar = function (id) {
            return this._header.headerVar(id);
        };
        Context.prototype.headerOperateVar = function (id) {
            return this._header.headerOperateVar(id);
        };
        Context.prototype.error = function (msg) {
            console.error("file: " + this.file + " line: " + this.lineNumber + " command: " + this.command + " " + msg);
        };
        return Context;
    }());
    SimpleScenario.Context = Context;
    var Header = (function () {
        function Header(header) {
            this.header = header;
        }
        Header.prototype.headerInt = function (id, defaultValue) {
            if (defaultValue === void 0) { defaultValue = 0; }
            var value = this.header[id];
            if (!value) {
                return defaultValue;
            }
            var valueInt = parseInt(value);
            if (isNaN(valueInt)) {
                return defaultValue;
            }
            return valueInt;
        };
        Header.prototype.headerStr = function (id, defaultValue) {
            if (defaultValue === void 0) { defaultValue = ''; }
            var value = this.header[id];
            if (!value) {
                return defaultValue;
            }
            return value;
        };
        Header.prototype.headerBool = function (id, defaultValue) {
            if (defaultValue === void 0) { defaultValue = false; }
            var value = this.header[id];
            if (value === 'true') {
                return true;
            }
            if (value === 'false') {
                return false;
            }
            return defaultValue;
        };
        Header.prototype.headerTone = function () {
            var red = this.headerInt('red', 0);
            var green = this.headerInt('green', 0);
            var blue = this.headerInt('blue', 0);
            var gray = this.headerInt('gray', 0);
            var tone = [red, green, blue, gray];
            return tone;
        };
        Header.prototype.headerVar = function (id) {
            var value = this.header[id];
            var reg = /^[+]{0,1}(var\.){0,1}(\d+)$/;
            var ret = reg.exec(value);
            var paramId = parseInt(ret[2]);
            if (ret[1] === undefined) {
                return [0, paramId];
            }
            else {
                return [1, paramId];
            }
        };
        Header.prototype.headerOperateVar = function (id) {
            var value = this.header[id];
            var reg = /^([-]{0,1})(var\.){0,1}(\d+)$/;
            var ret = reg.exec(value);
            var operation = ret[1] === '-' ? 1 : 0;
            var paramId = parseInt(ret[3]);
            if (ret[2] === undefined) {
                return [operation, 0, paramId];
            }
            else {
                return [operation, 1, paramId];
            }
        };
        return Header;
    }());
    Saba.applyMyMethods(_Game_Interpreter, Game_Interpreter);
    Saba.applyMyMethods(_Scene_Map, Scene_Map);
})(SimpleScenario || (SimpleScenario = {}));
