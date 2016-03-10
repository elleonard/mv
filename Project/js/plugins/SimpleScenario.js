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
 */
var SimpleScenario;
(function (SimpleScenario) {
    var _this = this;
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
    // F7
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
        _DataManager_checkError.call(_this);
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
                            scenario[name_1] = self.convert(text_1);
                        }
                        continue;
                    }
                    var index = file.indexOf('.txt');
                    if (index === -1) {
                        continue;
                    }
                    var name_2 = file.substr(0, index);
                    var text = fs.readFileSync(SCENARIO_PATH + file, 'utf8');
                    scenario[name_2] = self.convert(text);
                }
                console.log(scenario);
                fs.writeFileSync(DATA_PATH + 'Scenario.json', JSON.stringify(scenario));
                DataManager.loadDataFile('$dataScenraio', SCENARIO_FILE_NAME);
            });
        };
        Scenario_Converter.prototype.convert = function (text) {
            this.indent = 0;
            var list = [];
            var lines = text.split('\n');
            var blocks = [];
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                line = this.removeWS(line);
                var block = new Block();
                if (line.length === 0) {
                    continue;
                }
                if (line.indexOf('//') === 0) {
                    continue;
                }
                if (line.indexOf('@') === 0) {
                    block.header = line;
                    var offset = 1;
                    while (i + offset < lines.length && lines[i + offset].indexOf('@') === -1 && lines[i + offset].length > 0) {
                        block.pushMsg(this.removeWS(lines[i + offset]));
                        offset++;
                    }
                    i += offset - 1;
                }
                else {
                    block.header = '@message';
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
                this.convertCommand(list, block);
            }
            return list;
        };
        /**
         * ホワイトスペースを削除します。
         */
        Scenario_Converter.prototype.removeWS = function (line) {
            return line.replace(/^\s+/g, '');
        };
        Scenario_Converter.prototype.convertCommand = function (list, block) {
            var headerList = block.header.split(' ');
            var command = headerList[0].substr(1);
            var header = this.convertHeader(headerList);
            var context = new Context(list, header, block.data);
            this.lastCommand = command;
            try {
                this['convertCommand_' + command](context);
            }
            catch (e) {
                console.error(command + 'のコマンドが存在しません');
                throw e;
            }
        };
        Scenario_Converter.prototype.convertHeader = function (headerList) {
            var result = {};
            for (var i = 1; i < headerList.length; i++) {
                var text = headerList[i];
                var data = text.split('=');
                result[data[0]] = data[1];
            }
            return result;
        };
        Scenario_Converter.prototype.convertCommand_start = function (context) {
            this.appearLeft = false;
            this.appearRight = false;
        };
        Scenario_Converter.prototype.convertCommand_end = function (context) {
            var id1 = Tachie.DEFAULT_PICTURE_ID1;
            var id2 = Tachie.DEFAULT_PICTURE_ID2;
            var x = 0;
            var y = 0;
            var scale = 100;
            var ox = Tachie.RIGHT_POS_OFFSET_X;
            context.push({ 'code': 232, 'indent': this.indent, 'parameters': [id1, 0, 0, 0, x, y, scale, scale, 0, 0, 15, false] });
            context.push({ 'code': 232, 'indent': this.indent, 'parameters': [id2, 0, 0, 0, x + ox, y, scale, scale, 0, 0, 15, true] });
            this.appearLeft = false;
            this.appearRight = false;
        };
        Scenario_Converter.prototype.convertCommand_n1 = function (context) {
            this.convertCommand_nx(context, 1);
        };
        Scenario_Converter.prototype.convertCommand_n2 = function (context) {
            this.convertCommand_nx(context, 2);
        };
        ;
        Scenario_Converter.prototype.convertCommand_n3 = function (context) {
            this.convertCommand_nx(context, 3);
        };
        ;
        Scenario_Converter.prototype.convertCommand_n4 = function (context) {
            this.convertCommand_nx(context, 4);
        };
        ;
        Scenario_Converter.prototype.convertCommand_n5 = function (context) {
            this.convertCommand_nx(context, 5);
        };
        ;
        Scenario_Converter.prototype.convertCommand_nx = function (context, actorId) {
            var pos = 1;
            if (context.header['pos']) {
                pos = parseInt(context.header['pos']);
            }
            var face = 1;
            if (context.header['face']) {
                face = parseInt(context.header['face']);
            }
            var pose = 1;
            if (context.header['pose']) {
                pose = parseInt(context.header['pose']);
            }
            var hoppe = 0;
            if (context.header['hoppe']) {
                hoppe = parseInt(context.header['hoppe']);
            }
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie hoppe " + actorId + " " + hoppe)] });
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie pose " + actorId + " " + pose)] });
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie face " + actorId + " " + face)] });
            var name = '\\N[' + actorId + ']';
            if (context.header['name']) {
                name = context.header['name'];
            }
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie showName " + name)] });
            var x = 0;
            var y = 0;
            var scale = 100;
            if (pos === Tachie.LEFT_POS) {
                var id1 = Tachie.DEFAULT_PICTURE_ID1;
                if (!this.appearLeft) {
                    context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie showLeft " + actorId + " " + x + " " + y + " 100")] });
                    this.appearLeft = true;
                    context.push({ 'code': 232, 'indent': this.indent, 'parameters': [id1, 0, 0, 0, x, y, scale, scale, 255, 0, 15, true] });
                }
                else {
                    context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie showLeft " + actorId + " " + x + " " + y + " 255")] });
                }
            }
            else {
                var id2 = Tachie.DEFAULT_PICTURE_ID2;
                if (!this.appearRight) {
                    context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie showRight " + actorId + " " + x + " " + y + " 100")] });
                    this.appearRight = true;
                    var ox = Tachie.RIGHT_POS_OFFSET_X;
                    context.push({ 'code': 232, 'indent': this.indent, 'parameters': [id2, 0, 0, 0, x + ox, y, scale, scale, 255, 0, 15, true] });
                }
                else {
                    context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie showRight " + actorId + " " + x + " " + y + " 255")] });
                }
            }
            context.push({ 'code': 356, 'indent': this.indent, 'parameters': ['MessageName open ' + $gameActors.actor(actorId).name()] });
            this.convertCommand_message(context);
        };
        Scenario_Converter.prototype.convertCommand_message = function (context) {
            context.push({ 'code': 101, 'indent': this.indent, 'parameters': ['', 0, 0, 2] });
            for (var _i = 0, _a = context.data; _i < _a.length; _i++) {
                var msg = _a[_i];
                context.push({ 'code': 401, 'indent': this.indent, 'parameters': [msg] });
            }
        };
        Scenario_Converter.prototype.convertCommand_cos1 = function (context) {
            this.convertCommand_cosx(context, 1);
        };
        Scenario_Converter.prototype.convertCommand_cos2 = function (context) {
            this.convertCommand_cosx(context, 2);
        };
        Scenario_Converter.prototype.convertCommand_cos3 = function (context) {
            this.convertCommand_cosx(context, 3);
        };
        Scenario_Converter.prototype.convertCommand_cos4 = function (context) {
            this.convertCommand_cosx(context, 4);
        };
        Scenario_Converter.prototype.convertCommand_cos5 = function (context) {
            this.convertCommand_cosx(context, 5);
        };
        Scenario_Converter.prototype.convertCommand_cosx = function (context, actorId) {
            var types = ['outer', 'innerTop', 'innerBottom'];
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var type = types_1[_i];
                if (context.header[type]) {
                    var outer = context.header[type];
                    context.push({ 'code': 356, 'indent': this.indent, 'parameters': [("Tachie " + type + " " + actorId + " " + outer)] });
                }
            }
        };
        return Scenario_Converter;
    }());
    var Block = (function () {
        function Block() {
            this.data = [];
        }
        Block.prototype.pushMsg = function (line) {
            if (AUTO_WARD_WRAP) {
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
        function Context(list, header, data) {
            this.list = list;
            this.header = header;
            this.data = data;
        }
        Context.prototype.push = function (command) {
            this.list.push(command);
        };
        return Context;
    }());
    Saba.applyMyMethods(_Game_Interpreter, Game_Interpreter);
    Saba.applyMyMethods(_Scene_Map, Scene_Map);
})(SimpleScenario || (SimpleScenario = {}));
