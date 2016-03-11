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
module SimpleScenario {

const parameters = PluginManager.parameters('SimpleScenario');
const AUTO_WARD_WRAP = parameters['autoWordWrap'] === 'true';

if (Utils.isNwjs()) {
    var fs = require('fs');
    var path = require('path');
}

const SCENARIO_FILE_NAME = 'Scenario.json';
const SCENARIO_PATH = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/../scenario/');
const DATA_PATH = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/');

DataManager.loadDataFile('$dataScenraio', SCENARIO_FILE_NAME);

declare var $dataScenraio: {[id: string]: Array<RPG.EventCommand>};

// 変換ボタン。F7
Input.keyMapper[118] = 'debug2';

/**
 * それぞれのコマンドに必須なパラメータの定義
 */
const REQUIED_PARAMS: {[command: string]: Array<string>} = {
    'not_close': ['flag'],
    'default_pos': ['actor', 'pos'],
};

const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
const _Scene_Map_update = Scene_Map.prototype.update;

class _Game_Interpreter extends Game_Interpreter {
    pluginCommand(command: string, args: string[]) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Scenario' || command === 'scenario') {
            const id = args[0];
            const list = $dataScenraio[id];
            if (! list) {
                throw new Error('id:' + id + ' のデータが見つかりません');
            }
            this.setupChild(list, this._eventId);
        }
    }
}

class _Scene_Map extends Scene_Map {
    update(): void {
        _Scene_Map_update.call(this);
        this.updateConvertScenario();
    }
    protected updateConvertScenario(): void {
        if (Input.isTriggered('debug2') && $gameTemp.isPlaytest()) {
            SoundManager.playSave();
            var converter = new Scenario_Converter();
            converter.convertAll();
        }
    }
}

const _DataManager_checkError = DataManager.checkError;
DataManager.checkError = function() {
    if (DataManager._errorUrl && DataManager._errorUrl.indexOf(SCENARIO_FILE_NAME) >= 0) {
        console.error('Failed to load: ' + DataManager._errorUrl);
        DataManager._errorUrl = null;
    }
    _DataManager_checkError.call(this);
};

/**
 * シナリオテキストをMVで使えるJSON形式に変換するクラスです
 */
class Scenario_Converter {
    indent: number;         // 現在のインデント
    defaultPosMap: {[actorId: number]: number};   // アクターごとのデフォルト立ち位置
    /**
     * 全てのシナリオを変換します。
     */
    convertAll(): void {
        const self = this;

        const scenario: {[name: string]: Array<RPG.EventCommand>} = {};
        fs.readdir(SCENARIO_PATH, function (err, files) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(files);
            if (! files) {
                return;
            }
            for (const file of files) {
                console.log(file);
                const filePath = path.resolve(SCENARIO_PATH, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    const files2 = fs.readdirSync(filePath);
                    for (const file2 of files2) {
                        const index = file2.indexOf('.txt');
                        if (index === -1) {
                            continue;
                        }
                        const name = file2.substr(0, index);
                        const text = fs.readFileSync(filePath + '/' + file2, 'utf8');
                        scenario[name] = self.convert(text);
                    }
                    continue;
                }
                const index = file.indexOf('.txt');
                if (index === -1) {
                    continue;
                }
                const name = file.substr(0, index);
                const text = fs.readFileSync(SCENARIO_PATH +  file, 'utf8');
                scenario[name] = self.convert(text);
            }
            console.log(scenario);
            fs.writeFileSync(DATA_PATH + 'Scenario.json', JSON.stringify(scenario));
            DataManager.loadDataFile('$dataScenraio', SCENARIO_FILE_NAME);
        });
    }
    protected convert(text): Array<RPG.EventCommand> {
        this.indent = 0;

        const list = [];

        const lines = text.split('\n');
        const blocks: Array<Block> = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            line = this.removeWS(line);
            const block: Block = new Block();
            if (line.length === 0) {
                continue;
            }
            if (line.indexOf('//') === 0) {
                continue;
            }

            if (line.indexOf('@') === 0) {
                block.header = line;
                let offset = 1;
                while (i + offset < lines.length && lines[i + offset].indexOf('@') === -1 && lines[i + offset].length > 0) {
                    block.pushMsg(this.removeWS(lines[i + offset]));
                    offset++;
                }
                i += offset - 1;
            } else {
                block.header = '@message';
                let offset = 0;
                while (i + offset < lines.length && lines[i + offset].indexOf('@') === -1 && lines[i + offset].length > 0) {
                    block.pushMsg(this.removeWS(lines[i + offset]));
                    offset++;
                }
                i += offset - 1;
            }
            blocks.push(block);
        }

        for (const block of blocks) {
            this.convertCommand(list, block);
        }
        return list;
    }
    /**
     * ホワイトスペースを削除します。
     */
    protected removeWS(line: string): string {
        return line.replace(/^\s+/g, '');
    }
    /**
     * コマンドを変換します。
     * @param {Array<RPG.EventCommand>} list  [description]
     * @param {Block}                   block [description]
     */
    protected convertCommand(list: Array<RPG.EventCommand>, block: Block): void {
        const headerList = block.header.split(' ');
        const command = headerList[0].substr(1);
        const header = this.parseHeader(headerList);
        var context = new Context(command, list, header, block.data);
        try {
            this['convertCommand_' + command](context);
        } catch (e) {
            console.error(command + 'のコマンドが存在しません');
            throw e;
        }
    }
    /**
     * コマンドのパラメータが正しいかどうかを検証します。
     * @param {Context} context [description]
     */
    protected validate(context: Context): void {
        const requiredParams = REQUIED_PARAMS[context.command];
        if (! requiredParams) {
            return;
        }
        for (const param of requiredParams) {
            if (! context.header[param]) {
                console.error(`${context.command}に必須パラメータ ${param} が存在しません`);
            }
        }
    }
    /**
     * ヘッダをパースします。
     */
    protected parseHeader(headerList): {[key: string]: string} {
        var result = {};
        for (var i = 1; i < headerList.length; i++) {
            var text = headerList[i];
            var data = text.split('=');
            result[data[0]] = data[1];
        }
        return result;
    }
    protected convertCommand_start(context: Context): void {
        this.defaultPosMap = {};
    }
    protected convertCommand_end(context: Context): void {
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie notClose off`]});
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hide`]});
    }
    protected convertCommand_default_pos(context: Context): void {
        var actorId = parseInt(context.header['actor']);
        var pos = context.header['pos'] === 'right' ? 2 : 1;
        this.defaultPosMap[actorId] = pos;
    }
    protected convertCommand_not_close(context: Context): void {
        var flag = context.header['flag'];
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie notClose ${flag}`]});
    }
    protected convertCommand_n1(context: Context): void {
        this.convertCommand_nx(context, 1);
    }
    protected convertCommand_n2(context: Context): void {
        this.convertCommand_nx(context, 2);
    };
    protected convertCommand_n3(context: Context): void {
        this.convertCommand_nx(context, 3);
    };
    protected convertCommand_n4(context: Context): void {
        this.convertCommand_nx(context, 4);
    };
    protected convertCommand_n5(context: Context): void {
        this.convertCommand_nx(context, 5);
    };
    protected convertCommand_nx(context: Context, actorId: number): void {

        let pos = this.defaultPosMap[actorId] || 1;
        if (context.header['pos']) {
            pos = parseInt(context.header['pos']);
        }

        if (context.header['face']) {
            const face = parseInt(context.header['face']);
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie face ${actorId} ${face}`]});
        }

        if (context.header['pose']) {
            const pose = parseInt(context.header['pose']);
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie pose ${actorId} ${pose}`]});
        }

        if (context.header['hoppe']) {
            const hoppe = parseInt(context.header['hoppe']);
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hoppe ${actorId} ${hoppe}`]});
        }


        let name = '\\N[' + actorId + ']';
        if (context.header['name']) {
            name = context.header['name'];
        }
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie showName ${name}`]});

        const x = 0;
        const y = 0;
        if (pos === Tachie.LEFT_POS) {
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie showLeft ${actorId} ${x} ${y} 100`]});
        } else {
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie showRight ${actorId} ${x} ${y} 100`]});
        }
        context.push({'code': 356, 'indent': this.indent, 'parameters': ['MessageName open ' + $gameActors.actor(actorId).name()]});
        this.convertCommand_message(context);
    }
    protected convertCommand_message(context: Context) {
        context.push({'code': 101, 'indent': this.indent, 'parameters': ['', 0, 0, 2]});
        for (const msg of context.data) {
            context.push({'code': 401, 'indent': this.indent, 'parameters': [msg]});
        }
    }
    protected convertCommand_cos1(context: Context): void {
        this.convertCommand_cosx(context, 1);
    }
    protected convertCommand_cos2(context: Context): void  {
        this.convertCommand_cosx(context, 2);
    }
    protected convertCommand_cos3(context: Context): void  {
        this.convertCommand_cosx(context, 3);
    }
    protected convertCommand_cos4(context: Context): void  {
        this.convertCommand_cosx(context, 4);
    }
    protected convertCommand_cos5(context: Context): void  {
        this.convertCommand_cosx(context, 5);
    }
    protected convertCommand_cosx(context: Context, actorId: number): void  {
        var types = ['outer', 'innerTop', 'innerBottom'];

        for (const type of types) {
            if (context.header[type]) {
                const outer: string = context.header[type];
                context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie ${type} ${actorId} ${outer}`]});
            }
        }
    }
    protected convertCommand_picture(context: Context): void  {
        const layer = context.headerInt('layer');
        const file = context.header['file'];
        const origin = context.headerInt('origin', 0);
        const type = context.header['type'] === 'var' ? 1 : 0;
        const x = context.headerInt('x', 0);
        const y = context.headerInt('y', 0);
        const zoomX = context.headerInt('zoom_x', 100);
        const zoomy = context.headerInt('zoom_y', 100);
        const opacity = context.headerInt('transparent', 255);
        const blend = context.headerInt('blend', 0);
        context.push({'code': 231, 'indent': this.indent, 'parameters': [layer, file, origin, type, x, y, zoomX, zoomy, opacity, blend]});
    }

}

class Block {
    header: string;
    data: Array<string> = [];
    pushMsg(line: string) {
        if (AUTO_WARD_WRAP) {
            if (this.data.length === 0) {
                this.data.push('<wrap>' + line);
            } else {
                this.data.push('<br>' + line);
            }
        } else {
            this.data.push(line);
        }
    }
}
class Context {
    command: string;
    list: Array<RPG.EventCommand>;
    header: {[key: string]: string};
    data: Array<string>;
    constructor(command: string, list: Array<RPG.EventCommand>, header: {[key: string]: string}, data: Array<string>) {
        this.command = command;
        this.list = list;
        this.header = header;
        this.data = data;
    }
    push(command: RPG.EventCommand): void {
        this.list.push(command);
    }
    headerInt(id: string, defaultValue = 0): number {
        const value = this.header[id];
        if (! value) {
            return defaultValue;
        }
        const valueInt = parseInt(value);
        if (isNaN(valueInt)) {
            return defaultValue;
        }
        return valueInt;
    }
    headerStr(id: string, defaultValue = ''): string {
        const value = this.header[id];
        if (! value) {
            return defaultValue;
        }
        return value;
    }

}

Saba.applyMyMethods(_Game_Interpreter, Game_Interpreter);
Saba.applyMyMethods(_Scene_Map, Scene_Map);

}
