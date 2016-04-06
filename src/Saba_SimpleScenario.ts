//=============================================================================
// Saba_SimpleScenario.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc テキストファイルからツクールのイベントを書き出すプラグインです。
 *
 * @param autoWordWrap
 * @desc YED_WordWrap のプラグインの機能の自動改行用の文字列(<wrap> <br>)を自動で埋め込みます。
 * @default false
 *
 * @param scenarioFolder
 * @desc シナリオファイルがある場所を設定します
 * @default /../scenario/
 *
 * 
 * @help
 * Ver
 *
 * 睡工房さんのTES　と互換があるようにしています。
 * hime.be/rgss3/tes.html
 * リファレンスも、↑をご覧ください。
 * ただし、未実装箇所が多くあります。
 *
 * ■使い方
 * プロジェクトフォルダと同じディレクトリに
 * scenario フォルダを作成します。
 * その中に.txt ファイルを作成し、シナリオを書いていきます。
 *
 * その後、ツクールの開発環境からゲームを起動し、
 * マップ画面でF7キーを押すことで変換が完了します。
 *
 * シナリオを実行するには、プラグインコマンドで
 * scenatio <<ファイル名>>
 * と記述します。
 *
 //**************************************************************************
 //　独自コマンド
 //**************************************************************************
 * 　n1 n2 n3 ... n99
 * 　＞立ち絵を表示します。n の後の数字はアクターIDです。
 * 　　■パラメータ
 * 　　　face: number
 * 　　　　→表情ID
 * 　　　hoppe: number
 * 　　　　→ほっぺたの赤らみID
 * 　　　pose: number
 * 　　　　→ポーズID
 * 　　　name: string
 * 　　　　→表示する名前
 * 　　　pos: string
 * 　　　　→立ち位置(right→右, left→左)
 * 　　　　　　　　　(default_posよりも優先します)
 *
 * 　m1 m2 m3 ... m99
 * 　＞立ち絵なし、名前ありのメッセージを表示します。m の後の数字はモブIDです。
 * 　　■パラメータ
 * 　　　face: number
 * 　　　　→表情ID
 * 　　　name: string
 * 　　　　→表示する名前
 *
 * 　mob1 mob2 mob3 ... mob99
 * 　＞m1 などのコマンドで表示されるデフォルトの名前を設定します。
 * 　　■パラメータ
 * 　　　name: string
 * 　　　　→設定する名前
 *
 * 　cos1 cos2 cos3 ... cos99
 * 　＞キャラクターの衣装を変更します。n の後の数字はアクターIDです。
 * 　　■パラメータ
 * 　　　outer: string
 * 　　　　→アウターのID(a→裸)
 * 　　　innerBottm: string
 * 　　　　→パンツのID(a→裸)
 * 　　　innerTop: string
 * 　　　　→ブラのID(a→裸)
 *
 * 　not_close
 * 　＞会話ウィンドウを一時的に閉じなくします。
 * 　　■パラメータ
 * 　　　flag: string
 * 　　　　→on: 閉じなくする  off: 解除する
 *
 * 　hide_left
 * 　＞左のキャラを非表示にします
 *
 * 　hide_right
 * 　＞右のキャラを非表示にします
 *
 * 　color
 * 　＞ウィンドウカラーを設定します。
 * 　　キャラの会話では自動で設定されますが、
 * 　　通常の地の文などでは前回の色を引き継いでしまうため、
 * 　　このコマンドで指定し直すことができます。
 * 　　■パラメータ
 * 　　　color: number
 * 　　　　→ウィンドウ色ID
 * 
 * 　hide
 * 　＞全てのキャラクターを非表示にし、ウィンドウが閉じなくなるモードを
 * 　　合わせて解除します。
 *
 * 　default_pos
 * 　＞キャラクターのデフォルト立ち位置を設定します。
 * 　　設定しない場合、左に立ちます。
 * 　　■パラメータ
 * 　　　actor: number
 * 　　　　→アクターID
 * 　　　pos: string
 * 　　　　→立ち位置(right→右, left→左)
 *
 * 　start
 * 　＞default_posなどの設定をクリアします。
 *
 * 　preloadPicture
 * 　＞picture ファイルを先に読み込んでおきます
 * 　　■パラメータ
 * 　　　file: 読み込んでおくファイル名
 *
 *
 * イベント実装状況(○→実装済み)
//**************************************************************************
//　メッセージ系
//**************************************************************************
 *○　message_h
 *○　message
 *○　choice_h
 *○　choice_if
 *○　choice_cancel
 *○　choice_end
 *　　input_num
 *　　choice_item
 *　　scroll_h
 *　　scroll
 *　　scroll_end
//**************************************************************************
//　ゲーム進行系
//**************************************************************************
 *○　sw
 *　　var
 *　　var_random
 *　　var_item
 *　　var_weapon
 *　　var_armor
 *　　var_actor
 *　　var_enemy
 *　　var_character
 *　　var_party
 *　　var_other
 *　　var_script
 *○　self_sw
 *○　timer
//**************************************************************************
//　フロー制御系
//**************************************************************************
 *○　if_sw
 *○　if_var
 *○　if_self_sw
 *○　if_timer
 *○　if_enemy
 *○　if_character
 *○　if_vehicle
 *○　if_money
 *○　if_item
 *○　if_weapon
 *○　if_armor
 *○　if_button
 *○　if_script
 *○　else
 *　　loop
 *　　loop_end
 *　　loop_break
 *○　event_break
 *○　return
 *○　common
 *○　label
 *○　label_jump
 *　　comment
 *　　comment2
//**************************************************************************
//　パーティ系
//**************************************************************************
 *　　money
 *　　item
 *　　weapon
 *　　armor
 *　　member
//**************************************************************************
//　アクター系
//**************************************************************************
 *　　hp
 *　　mp
 *　　state
 *○　all_recovery
 *○　exp
 *○　level
 *　　capability
 *　　skill
 *　　equip
 *○　name
 *○　class
 *○　nickname
//**************************************************************************
//　移動系
//**************************************************************************
 *○　map_move
 *○　vehicle_pos
 *○　event_pos
 *○　scroll_map
 *○　route_h
 *○　route
 *○　vehicle
//**************************************************************************
//　キャラクター系
//**************************************************************************
 *○　transparent
 *○　followers
 *○　gather
 *○　anime
 *○　balloon
 *○　erace
//**************************************************************************
//　画面効果系
//**************************************************************************
 *○　fadeout
 *○　fadein
 *○　tone
 *○　flash
 *○　shake
//**************************************************************************
//　時間調整系
//**************************************************************************
 *○　wait
//**************************************************************************
//　ピクチャと天候系
//**************************************************************************
 *○　picture
 *○　picture_move
 *○　picture_rotation
 *○　picture_tone
 *○　picture_erace
 *○　weather
//**************************************************************************
//　音楽と効果音系
//**************************************************************************
 *○　bgm
 *○　fadeout_bgm
 *○　save_bgm
 *○　resume_bgm
 *○　bgs
 *○　fadeout_bgs
 *○　me
 *○　se
//**************************************************************************
//　シーン制御系
//**************************************************************************
 *　　battle
 *　　battle_win
 *　　battle_escape
 *　　battle_loss
 *　　battle_end
 *　　shop
 *　　input_name
 *○　menu_open
 *○　save_open
 *○　gameover
 *　　battle_bgm
 *　　battle_end_me
 *○　title_return
//**************************************************************************
//　システム設定系
//**************************************************************************
 *　　battle_bgm
 *　　battle_end_me
 *○　save_disable
 *○　menu_disable
 *○　encount_disable
 *○　formation_disable
 *　　window_color
 *　　actor_graphic
 *　　vehicle_graphic
//**************************************************************************
//　ムービー系
//**************************************************************************
 *○　movie
//**************************************************************************
//　マップ系
//**************************************************************************
 *　　map_name_disable
 *　　tileset
 *　　battle_background
 *　　parallax
 *　　pos_info
//**************************************************************************
//　バトル系
//**************************************************************************
 *　　enemy_hp
 *　　enemy_mp
 *　　enemy_state
 *　　enemy_all_recovery
 *　　enemy_appear
 *　　enemy_trans
 *　　battle_anime
 *　　force
 *　　battle_abort
//**************************************************************************
//　上級系
//**************************************************************************
 *　　script
 *　　script2
 *　　plugin
//**************************************************************************
//　その他
//**************************************************************************
 *○　end
 */
module Saba {
export module SimpleScenario {

const parameters = PluginManager.parameters('Saba_SimpleScenario');
const AUTO_WARD_WRAP = parameters['autoWordWrap'] === 'true';

if (Utils.isNwjs()) {
    var fs = require('fs');
    var path = require('path');
}

const pathParam = parameters['scenarioFolder'];
const SCENARIO_FILE_NAME = 'Scenario.json';
export const SCENARIO_PATH = function() {
    var p = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, pathParam);
    if (p.match(/^\/([A-Z]\:)/)) {
        p = p.slice(1);
    }
    return decodeURIComponent(p);
}();
const DATA_PATH = function() {
    var p = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/');
    if (p.match(/^\/([A-Z]\:)/)) {
        p = p.slice(1);
    }
    return decodeURIComponent(p);
}();
DataManager.loadDataFile('$dataScenraio', SCENARIO_FILE_NAME);

declare var $dataScenraio: {[id: string]: Array<RPG.EventCommand>};

// 変換ボタン。F7
Input.keyMapper[118] = 'debug2';


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
            console.log(`コマンド実行:${args[0]}`);
            console.log(list);
            this.setupChild(list, this._eventId);
        }
    }
}

class _Scene_Map extends Scene_Map {
    update(): void {
        _Scene_Map_update.call(this);
        this.updateConvertScenario();
    }
    updateConvertScenario(): void {
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
export class Scenario_Converter {
    indent: number;         // 現在のインデント
    defaultPosMap: {[actorId: number]: number};   // アクターごとのデフォルト立ち位置
    _defaultMobNameMap: {[mobId: number]: string};      // モブごとのデフォルトの名前
    _defaultMobFaceMap: {[mobId: number]: Array<any>};  // モブごとのデフォルトの顔グラ
    _replaceMap: {[key: string]: string};
    /**
     * 全てのシナリオを変換します。
     */
    convertAll(): void {
        const self = this;
        
        this._replaceMap = {};

        const scenario: {[name: string]: Array<RPG.EventCommand>} = {};
        fs.readdir(SCENARIO_PATH, function (err, files) {
            if (err) {
                console.error(err.message);
                return;
            }
            if (! files) {
                return;
            }
            self.convertReplace(files);
            self.convertFiles(SCENARIO_PATH, files, scenario);
            console.log(scenario);
            fs.writeFileSync(DATA_PATH + 'Scenario.json', JSON.stringify(scenario));
            DataManager.loadDataFile('$dataScenraio', SCENARIO_FILE_NAME);
            console.log('シナリオの変換が終わりました');
        });
    }
    convertFiles(basePath, files, scenario): void {
        if (! files) {
            return;
        }
        for (const file of files) {
            const filePath = path.resolve(basePath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                const files2 = fs.readdirSync(filePath);
                this.convertFiles(filePath + '/', files2, scenario);
                continue;
            }
            const name = this.parseValidFileName(file);
            if (! name) {
                continue;
            }
            const text = fs.readFileSync(basePath +  file, 'utf8');
            scenario[name] = this.convert(file, text);
        }
    }
    /**
     * 指定のファイルがシナリオファイルかどうかを返します
     */
    parseValidFileName(file): string {
        if (file.indexOf('replace.txt') === 0) {
            return;
        }
        let index = file.indexOf('.txt');
        if (index === -1) {
            index = file.indexOf('.sce');
        }
        if (index === -1) {
            return null;
        }
        const name = file.substr(0, index);
        return name;
    }
    /**
     * replace ファイルを変換します
     */
    convertReplace(files): void {
        for (const file of files) {
            const index = file.indexOf('replace.txt');
            if (index === -1) {
                continue;
            }
            const name = file.substr(0, index);
            const text = fs.readFileSync(SCENARIO_PATH +  file, 'utf8');
            this.parseReplace(text);
            return;
        }
    }
    parseReplace(text: string): void {
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.indexOf('//') === 0) {
                continue;
            }
            const chars = line.split(/\s/);
            if (chars.length < 2) {
                continue;
            }
            this._replaceMap[chars[0]] = chars[chars.length - 1];
        }
        //console.log(this._replaceMap)
    }
    convert(file, text): Array<RPG.EventCommand> {
        this.indent = 0;

        const list = [];

        const lines = text.split('\n');
        const blocks: Array<Block> = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            line = this.removeWS(line);
            if (line.length === 0) {
                continue;
            }
            if (line.indexOf('//') === 0) {
                continue;
            }
            const block: Block = new Block(i + 1);
            blocks.push(block);

            if (line.indexOf('@') === 0) {
                block.header = line;
                if (line.indexOf('@choice_if') >= 0 || line.indexOf('@choice_h') >= 0) {
                    continue;
                }
                let offset = 1;
                if (i + offset === lines.length) {
                    break;
                }
                lines[i + offset] = this.removeWS(lines[i + offset]);
                while (i + offset < lines.length && (lines[i + offset].indexOf('@') !== 0 || lines[i + offset].indexOf('@route') !== -1) && lines[i + offset].length > 0) {
                    block.pushMsg(this.removeWS(lines[i + offset]));
                    offset++;
                    if (i + offset < lines.length) {
                        lines[i + offset] = this.removeWS(lines[i + offset]);
                    }
                }
                i += offset - 1;
            } else {
                block.header = '@normal_messages';
                let offset = 0;
                while (i + offset < lines.length && lines[i + offset].indexOf('@') !== 0 && lines[i + offset].length > 0) {
                    block.pushMsg(this.removeWS(lines[i + offset]));
                    offset++;
                }
                if (offset >= 1) {
                    i += offset - 1;
                }
            }
        }

        for (const block of blocks) {
            this.convertCommand(file, list, block);
        }
        return list;
    }
    /**
     * ホワイトスペースを削除します。
     */
    removeWS(line: string): string {
        const ret = line.replace(/^[\x20|\t]+/g, '');
        if (ret === '_') {
            return ' ';
        } else {
            return ret;
        }
    }
    /**
     * コマンドを変換します。
     */
    convertCommand(file, list: Array<RPG.EventCommand>, block: Block): void {
        const headerList = block.header.split(' ');
        const command = headerList[0].substr(1);
        const header = this.parseHeader(headerList);
        var context = new Context(file, block.lineNumber, command, list, header, block.data);
        var n = /n(\d+)/.exec(command);
        var a = /a(\d+)/.exec(command);
        var cos = /cos(\d+)/.exec(command);
        var m = /m(\d+)/.exec(command);
        var mob = /mob(\d+)/.exec(command);
        try {
            this.validate(context);
            if (n) {
                this['convertCommand_n'](parseInt(n[1]), context);
            } else if (a) {
                this['convertCommand_n'](parseInt(a[1]), context);
            } else if (cos) {
                this['convertCommand_cos'](parseInt(cos[1]), context);
            } else if (m) {
                this['convertCommand_m'](parseInt(m[1]), context);
            } else if (mob) {
                this['convertCommand_mob'](parseInt(mob[1]), context);
            } else {
                if (command === 'n' || command === 'a' || command === 'm' || command === 'mob') {
                    context.error('のコマンドが存在しません');
                }
                else if (! this['convertCommand_' + command]) {
                    context.error(command + 'のコマンドが存在しません');
                } else {
                    this['convertCommand_' + command](context);
                }
            }
        } catch (e) {
            console.error(command + 'のコマンドでエラーが発生しました');
            console.log(e);
            console.log(e.stack);
            throw e;
        }
    }
    /**
     * コマンドのパラメータが正しいかどうかを検証します。
     * @param {Context} context [description]
     */
    validate(context: Context): void {
        var validaor = validates[context.command];
        if (! validaor) {
            console.error(context.command + 'のコマンドの Validator が存在しません');
            return;
        }
        for (const paramName in validaor) {
            if (! validaor.hasOwnProperty(paramName)) {
                continue;
            }
            var vv = validaor[paramName];
            if (! vv) {
                console.error(`${context.command} ${paramName} のValidator が存在しません`);
                continue;
            }
            if (Array.isArray(vv)) {
                var validatorList: Array<Validator> = vv;
                for (const v of validatorList) {
                    if (! v) {
                        console.error(`${context.command} ${paramName} のValidator が存在しません`);
                        continue;
                    }
                    v.validate(context, paramName, context.header[paramName]);
                }
            } else {
                vv.validate(context, paramName, context.header[paramName]);
            }
        }
    }
    /**
     * ヘッダをパースします。
     */
    parseHeader(headerList): Header {
        var result = {};
        for (var i = 1; i < headerList.length; i++) {
            var text = headerList[i];
            var index = text.indexOf('=');
            var key = text.substr(0, index);
            var value = text.substr(index + 1);
            result[key] = value;
        }
        return new Header(result);
    }


    convertCommand_start(context: Context): void {
        this.defaultPosMap = {};
        this._defaultMobNameMap = {};
        this._defaultMobFaceMap = {};
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie notClose on`]});
    }
    convertCommand_hide(context: Context): void {
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie notClose off`]});
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hide`]});
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hideName`]});
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hideBalloon`]});
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie clearWindowColor`]});
    }
    convertCommand_hide_left(context: Context): void {
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hideLeft`]});
    }
    convertCommand_hide_right(context: Context): void {
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hideRight`]});
    }
    convertCommand_default_pos(context: Context): void {
        var actorId = parseInt(context.header['actor']);
        var position = context.header['position'] === 'right' ? 2 : 1;
        this.defaultPosMap[actorId] = position;
    }
    convertCommand_not_close(context: Context): void {
        var flag = context.header['flag'];
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie notClose ${flag}`]});
    }
    convertCommand_preloadPicture(context: Context): void {
        var file = context.headerStr('file');
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie preloadPicture ${file}`]});
    }
    convertCommand_n(actorId: number, context: Context): void {
        let position = this.defaultPosMap[actorId] || 1;
        if (context.header['position']) {
            position = context.header['position'] === 'right' ? 2 : 1;
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

        let x = 0;
        let y = 0;
        if (position === Tachie.LEFT_POS) {
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie showLeft ${actorId} ${x} ${y} 100`]});
        } else {
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie showRight ${actorId} ${x} ${y} 100`]});
        }
        this.convertCommand_messages(context);
    }
    convertCommand_color(context: Context): void {
        let color = 0;
        if (context.header['color']) {
            color = context.headerInt('color');
        }
        if (color > 0) {
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie windowColor ` + color]});
        } else {
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie clearWindowColor`]});
        }
    }
    convertCommand_m(mobId: number, context: Context): void {
        let name = this._defaultMobNameMap[mobId] || '';
        if (context.header['name']) {
            name = context.headerStr('name');
        }
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie deactivateAll`]});
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie showName ${name}`]});

        let face = '';
        let index = 0;
        let faceList = this._defaultMobFaceMap[mobId];
        if (faceList) {
            face = faceList[0];
            index = faceList[1];
        }
        if (context.header['face']) {
            face = context.headerStr('face');
        }

        if (context.header['index']) {
            index = context.headerInt('index');
        }
        
        let color = 0;
        if (context.header['color']) {
            color = context.headerInt('color');
        }

        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hideBalloon`]});
        if (color > 0) {
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie windowColor ` + color]});
        } else {
            context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie clearWindowColor`]});
        }
        context.push({'code': 101, 'indent': this.indent, 'parameters': [face, index, 0, 2]});
        for (const msg of context.data) {
            context.push({'code': 401, 'indent': this.indent, 'parameters': [this.replaceMessage(msg)]});
        }
    }
    convertCommand_normal_messages(context: Context) {
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hideName`]});
        this.convertCommand_messages(context);
    }
    convertCommand_messages(context: Context) {
        context.push({'code': 101, 'indent': this.indent, 'parameters': ['', 0, 0, 2]});
        for (const msg of context.data) {
            context.push({'code': 401, 'indent': this.indent, 'parameters': [this.replaceMessage(msg)]});
        }
    }
    convertCommand_cos(actorId: number, context: Context): void {
        var types = ['outer', 'innerTop', 'innerBottom'];

        for (const type of types) {
            if (context.header[type]) {
                const outer: string = context.header[type];
                context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie ${type} ${actorId} ${outer}`]});
            }
        }
    }
    convertCommand_mob(mobId: number, context: Context): void {
        var name = context.headerStr('name');
        this._defaultMobNameMap[mobId] = name;
        
        var face = context.headerStr('face')
        var index = context.headerInt('index', 0)
        if (face) {
            this._defaultMobFaceMap[mobId] = [face, index];
        }
    }
    convertCommand_message_h(context: Context): void {
        context.push({'code': 356, 'indent': this.indent, 'parameters': [`Tachie hideName`]});
        const actor = context.header['actor'] || '';
        const index = context.headerInt('index', 0);
        const back = context.headerInt('back', 0);
        const pos = context.headerInt('pos', 2);
        context.push({'code': 101, 'indent': this.indent, 'parameters': [actor, index, back, pos]});
        for (const msg of context.data) {
            context.push({'code': 401, 'indent': this.indent, 'parameters': [msg]});
        }
    }
    convertCommand_message(context: Context): void {
        const value = context.header['value'];
        context.push({'code': 401, 'indent': this.indent, 'parameters': [this.replaceMessage(value)]});
    }
    replaceMessage(text: string): string {
        for (const key in this._replaceMap) {
            if (! this._replaceMap.hasOwnProperty(key)) {
                continue;
            }
            const value = this._replaceMap[key];
            var regExp = new RegExp(key, 'g');
            text = text.replace(regExp , value);
        }
        return text;
    }
    convertCommand_choice_h(context: Context): void {
        var labels: Array<string> = [];
        if (context.header['label1']) {
            labels.push(context.header['label1']);
        }
        if (context.header['label2']) {
            labels.push(context.header['label2']);
        }
        if (context.header['label3']) {
            labels.push(context.header['label3']);
        }
        if (context.header['label4']) {
            labels.push(context.header['label4']);
        }
        if (context.header['label5']) {
            labels.push(context.header['label5']);
        }
        if (context.header['label6']) {
            labels.push(context.header['label6']);
        }
        const cancelType = context.headerInt('cancel', 0) - 1;// -2
        const defaultType = context.headerInt('default', 0) - 1;
        const positionType = context.headerInt('position', 2);
        const background = context.headerInt('background', 0);
        context.push({'code':102, 'indent': this.indent, 'parameters': [labels, cancelType, defaultType, positionType, background]});
    }
    convertCommand_choice_if(context: Context): void {
        const index = context.headerInt('index') - 1;
        this.indent++;
        context.push({'code':402, 'indent': this.indent - 1, 'parameters': [index]})
    }
    convertCommand_choice_cancel(context: Context): void {
        this.indent++;
        context.push({'code':403, 'indent': this.indent - 1, 'parameters': []})
    }
    convertCommand_choice_end(context: Context): void {
        this.indent--;
        context.push({'code':0, 'indent': this.indent, 'parameters': []})
    }
    /**
     * ○ 条件分岐（スイッチ）
     */
    convertCommand_if_sw(context: Context): void {
        this.indent++;
        const ifnum = 0
        const id = context.headerInt('id');
        const flag  = context.headerStr('flag', 'on') === 'on' ? 0 : 1
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, id, flag]})
    }
    /**
     * ○ 条件分岐（変数）
     */
    convertCommand_if_var(context: Context): void {
        this.indent++;
        const ifnum = 1
        const id = context.headerInt('id');
        const value = context.headerStr('value');
        var reg = /(var\.)/;
        const type  = reg.exec(value) ? 1 : 0;	//0:数値 1:変数
        let op    = ['=', '>=', '<=', '>', '<', '><'].indexOf(context.headerStr('op')) || 0
        if (type === 1 && parseInt(value) <= 0) {
            throw new Error('変数指定時に「0」以下が使われました。');
        }
        const valueNum = /(\d+)/.exec(value);
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, id, type, parseInt(valueNum[0]), op]});
    }
    /**
     * ○ 条件分岐（セルフスイッチ）
     */
    convertCommand_if_self_sw(context: Context): void {
        this.indent++;
        const ifnum = 2
        const id = context.headerStr('id');
        const flag  = context.headerStr('flag', 'on') === 'on' ? 0 : 1
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, id, flag]});
    }
    /**
     * ○ 条件分岐（タイマー）
     */
    convertCommand_if_timer(context: Context): void {
        this.indent++;
        const ifnum = 3
        const time = context.headerInt('time');
        const op    = ['>=', '<=', '<'].indexOf(context.headerStr('op')) || 0
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, time, op]});
    }
    /**
     * ○ 条件分岐（アクター）
     */
    convertCommand_if_actor(context: Context): void {
        this.indent++;
        const ifnum = 4
        const id = context.headerInt('id');
        let type = 0;
        let value = 0;
        switch (context.headerStr('type')) {
        case 'party':
            type  = 0;
            value = 0;
            break;
        case 'name':
            type  = 1;
            value = context.headerInt('value');
            break;
        case 'class':
            type  = 2;
            new NotEmptyValidator().validate(context, 'value', context.header['value']);
            new NumericValidator(1).validate(context, 'value', context.header['value']);
            value = context.headerInt('value');
            break;
        case 'skill':
            type  = 3
            new NotEmptyValidator().validate(context, 'value', context.header['value']);
            new NumericValidator(1).validate(context, 'value', context.header['value']);
            value = context.headerInt('value');
            break;
        case 'weapon':
            type  = 4
            new NotEmptyValidator().validate(context, 'value', context.header['value']);
            new NumericValidator(1).validate(context, 'value', context.header['value']);
            value = context.headerInt('value');
            break;
        case 'armor':
            type  = 5
            new NotEmptyValidator().validate(context, 'value', context.header['value']);
            new NumericValidator(1).validate(context, 'value', context.header['value']);
            value = context.headerInt('value');
            break;
        case 'state':
            type  = 6
            new NotEmptyValidator().validate(context, 'value', context.header['value']);
            new NumericValidator(1).validate(context, 'value', context.header['value']);
            value = context.headerInt('value');
            break;
        default:
            type  = 0
            value = 0
            break;
        }
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, id, type, value]});
    }
    /**
     * ○ 条件分岐（敵キャラ）
     */
    convertCommand_if_enemy(context: Context): void {
        this.indent++;
        const ifnum = 5
        let type = 0;
        let value = 0;
        const enemy = context.headerInt('enemy');
        switch (context.headerStr('type')) {
        case 'visible':
            type  = 0
            value = 0
            break;
        case 'state':
            type  = 1
            new NotEmptyValidator().validate(context, 'value', context.header['value']);
            new NumericValidator(1).validate(context, 'value', context.header['value']);
            value = context.headerInt('value');
            break;
        default:
            type  = 0
            value = 0
            break;
        }
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, enemy, type, value]});
    }
    /**
     * ○ 条件分岐（キャラクター）
     */
    convertCommand_if_character(context: Context): void {
        this.indent++;
        const ifnum = 6
        const id = context.headerInt('id');
        let direction = 0;
        switch (context.headerStr('direction')) {
        case '2':
        case 'down':
            direction = 2
            break;
        case '4':
        case 'left':
            direction = 4
            break;
        case '6':
        case 'right':
            direction = 6
            break;
        case '8':
        case 'up':
            direction = 8
            break;
        }
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, id, direction]});
    }
    /**
     * ○ 条件分岐（乗り物）
     */
    convertCommand_if_vehicle(context: Context): void {
        this.indent++;
        const ifnum = 13
        const vehicle = context.headerInt('vehicle');
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, vehicle]});
    }
    /**
     * ○ 条件分岐（お金）
     */
    convertCommand_if_money(context: Context): void {
        this.indent++;
        const ifnum = 7
        const money = context.headerInt('money');
        const op    = ['ge', 'le', 'lt'].indexOf(context.header['op']) || 0
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, money, op]});
    }
    /**
     * ○ 条件分岐（アイテム）
     */
    convertCommand_if_item(context: Context): void {
        this.indent++;
        const ifnum = 8
        const id = context.headerInt('id');
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, id]});
    }
    /**
     * ○ 条件分岐（武器）
     */
    convertCommand_if_weapon(context: Context): void {
        this.indent++;
        const ifnum = 9
        const id = context.headerInt('id');
        const equip = context.headerStr('equip', 'false') == 'true' ? true : false;
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, id, equip]});
    }
    /**
     * ○ 条件分岐（防具）
     */
    convertCommand_if_armor(context: Context): void {
        this.indent++;
        const ifnum = 10
        const id = context.headerInt('id');
        const equip = context.headerStr('equip', 'false') == 'true' ? true : false;
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, id, equip]});
    }
    /**
     * ○ 条件分岐（ボタン）
     */
    convertCommand_if_button(context: Context): void {
        this.indent++;
        const ifnum = 11
        let button = 0;
        switch (context.headerStr('button')) {
        case '2':
        case 'down':
            button = 2;
            break;
        case '4':
        case 'left':
            button = 4;
            break;
        case '6':
        case 'right':
            button = 6;
            break;
        case '8':
        case 'up':
            button = 8;
            break;
        case '11':
        case 'A':
            button = 11;
            break;
        case '12':
        case 'B':
            button = 12;
            break;
        case '13':
        case 'C':
            button = 13;
            break;
        case '14':
        case 'X':
            button = 14;
            break;
        case '15':
        case 'Y':
            button = 15;
            break;
        case '16':
        case 'Z':
            button = 16;
            break;
        case '17':
        case 'L':
            button = 17;
            break;
        case '18':
        case 'R':
            button = 18;
            break;
        }
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, button]});
    }
    /**
     * ○ 条件分岐（スクリプト）
     */
    convertCommand_if_script(context: Context): void {
        this.indent++;
        const ifnum = 12;
        let script = context.headerStr('script');
        script = script.replace(/<!!>/g, '=');
        script = script.replace(/<ii>/g, ' ');
        context.push({'code':111, 'indent': this.indent - 1, 'parameters': [ifnum, script]});
    }
    /**
     * ○ 条件分岐（それ以外）
     */
    convertCommand_else(context: Context): void {
        this.indent++;
        context.push({'code':411, 'indent': this.indent - 1, 'parameters': []});
    }
    convertCommand_end_else(context: Context): void {
        this.indent--;
        context.push({'code': 0, 'indent': this.indent + 1, 'parameters': []});
        this.indent++;
        context.push({'code':411, 'indent': this.indent - 1, 'parameters': []});
    }
    /**
     * ○ イベントの中断
     */
    convertCommand_event_break(context: Context): void {
        context.push({'code': 115, 'indent': this.indent, 'parameters': []});
    }
    /**
     * ○ イベントの中断（returnタグにて）
     */
    convertCommand_return(context: Context): void {
        context.push({'code': 115, 'indent': this.indent, 'parameters': []});
    }
    /**
     * ○ コモンイベント
     */
    convertCommand_common(context: Context): void {
        const id = context.headerInt('id');
        context.push({'code': 117, 'indent': this.indent, 'parameters': [id]});
    }
    /**
     * ○ ラベル
     */
    convertCommand_label(context: Context): void {
        const value = context.headerStr('value');
        context.push({'code': 118, 'indent': this.indent, 'parameters': [value]});
    }
    /**
     * ○ ラベルジャンプ
     */
    convertCommand_label_jump(context: Context): void {
        const value = context.headerStr('value');
        context.push({'code': 119, 'indent': this.indent, 'parameters': [value]});
    }
    /**
     * ○ 注釈
     */
    convertCommand_comment(context: Context): void {
        const value = context.headerStr('value');
        context.push({'code': 108, 'indent': this.indent, 'parameters': [value]});
    }
    /**
     * ○ 注釈（２行目以降）
     */
    convertCommand_comment2(context: Context): void {
        const value = context.headerStr('value');
        context.push({'code': 408, 'indent': this.indent, 'parameters': [value]});
    }
    convertCommand_sw(context: Context): void {
        const id = context.headerInt('id');
        const end = context.headerInt('end', id);
        const flag = context.headerStr('flag') === 'on' ? 0 : 1;
        context.push({'code': 121, 'indent': this.indent, 'parameters': [id, end, flag]});
    }
    convertCommand_var(context: Context): void {
        const id = context.headerInt('id');
        const end = context.headerInt('end', id);
        const op    = ['=', '+', '-', '*', '/', '%'].indexOf(context.headerStr('op')) || 0
        const value = context.headerInt('value');
        context.push({'code': 122, 'indent': this.indent, 'parameters': [id, end, op, 0, value]});
    }
    convertCommand_self_sw(context: Context): void {
        const id = context.headerStr('id');
        const flag = context.headerStr('flag') === 'on' ? 0 : 1;
        context.push({'code': 123, 'indent': this.indent, 'parameters': [id, flag]});
    }
    convertCommand_timer(context: Context): void {
        const flag = context.headerStr('flag') === 'on' ? 0 : 1;
        const time = context.headerInt('time');
        context.push({'code': 124, 'indent': this.indent, 'parameters': [flag, time]});
    }
    convertCommand_save_disable(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 134, 'indent': this.indent, 'parameters': [flag]});
    }
    convertCommand_menu_disable(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 135, 'indent': this.indent, 'parameters': [flag]});
    }
    convertCommand_encount_disable(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 136, 'indent': this.indent, 'parameters': [flag]});
    }
    convertCommand_formation_disable(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 137, 'indent': this.indent, 'parameters': [flag]});
    }
    convertCommand_map_move(context: Context): void {
        let direction;
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
        let fade;
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
        const type = context.headerStr('type', 'const') === 'const' ? 0 : 1;
        const map = context.headerInt('map');
        const x = context.headerInt('x');
        const y = context.headerInt('y');
        context.push({'code': 201, 'indent': this.indent, 'parameters': [type, map, x, y, direction, fade]});
    }
    convertCommand_vehicle_pos(context: Context): void {
        const vehicle = context.headerInt('vehicle');
        const type = context.headerStr('type', 'const') === 'const' ? 0 : 1;
        const map = context.headerInt('map');
        const x = context.headerInt('x');
        const y = context.headerInt('y');
        context.push({'code': 202, 'indent': this.indent, 'parameters': [vehicle, type, map, x, y]});
    }
    convertCommand_event_pos(context: Context): void {
        const id = context.headerInt('id');
        let type;
        if (context.headerStr('type') === 'var') {
            type = 1;
        } else if (context.headerStr('type') === 'var') {
            type = 2;
        } else {
            type = 0;
        }
        const x = context.headerInt('x');
        const y = context.headerInt('y');
        let direction;
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
        context.push({'code': 203, 'indent': this.indent, 'parameters': [id, type, x, y, direction]});
    }
    convertCommand_scroll_map(context: Context): void {
        let direction;
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
        const num = context.headerInt('num');
        const speed = context.headerInt('speed', 4);
        context.push({'code': 204, 'indent': this.indent, 'parameters': [direction, num, speed]});
    }
    convertCommand_route_h(context: Context): void {
        var event = context.headerInt('event');
        var repeat = context.headerBool('repeat', false);
        var skip = context.headerBool('skip', false);
        var wait = context.headerBool('wait', true);

        if (context.data.length === 0) {
            context.error('移動ルートが設定されていません。');
            return;
        }
        var list = [];
        for (const line of context.data) {
            list.push(this.convertCommand_route(context, line));
        }
        list.push({'code': 0});
        var routes = {repeat: repeat, skippable: skip, wait: wait, list: list};
        context.push({'code': 205, 'indent': this.indent, 'parameters': [event, routes]});
    }
    convertCommand_route(context: Context, line: string): {} {
        const headerList = line.split(' ');
        const header  = this.parseHeader(headerList);
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
                new NumericValidator(-100, 100).validate(context, 'x', header['x']);
                new NumericValidator(-100, 100).validate(context, 'y', header['y']);
                parameters.push(header.headerInt('x', 0));
                parameters.push(header.headerInt('y', 0));
                break;
            case 'wait':
                code = 15;
                new NumericValidator(1, 999).validate(context, 'time', header['time']);
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
                new NotEmptyValidator().validate(context, 'id', header['id']);
                new NumericValidator(1).validate(context, 'id', header['id']);
                parameters['id'] = header.headerInt('id');
                break;
            case 'switch_off':
            case 'sw_off':
                code = 28;
                new NotEmptyValidator().validate(context, 'id', header['id']);
                new NumericValidator(1).validate(context, 'id', header['id']);
                parameters.push(header.headerInt('id'));
                break;
            case 'change_speed':
                code = 29;
                new NumericValidator(1, 6).validate(context, 'speed', header['speed']);
                parameters.push(header.headerInt('speed', 3));
                break;
            case 'change_freq':
                code = 30;
                new NumericValidator(1, 5).validate(context, 'freq', header['freq']);
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
                new NotEmptyValidator().validate(context, 'file', header['file']);
                new NotEmptyValidator().validate(context, 'index', header['index']);
                new NumericValidator(0, 7).validate(context, 'index', header['index']);
                parameters.push(header.headerStr('file'));
                parameters.push(header.headerInt('index'));
                break;
            case 'change_opacity':
                code = 42;
                new NumericValidator(0, 255).validate(context, 'opacity', header['opacity']);
                parameters.push(header.headerInt('opacity', 255));
                break;
            case 'change_blend':
                code = 43;
                new NumericValidator(0, 2).validate(context, 'blend', header['blend']);
                parameters.push(header.headerInt('blend', 0));
                break;
            case 'play_se':
                code = 44;
                new NumericValidator(0, 100).validate(context, 'volume', header['volume']);
                new NumericValidator(50, 150).validate(context, 'pitch', header['pitch']);
                new NumericValidator(-100, 100).validate(context, 'pan', header['pan']);

                const file = header.headerStr('file', '');
                const volume = header.headerInt('volume', 100);
                const pitch = header.headerInt('pitch', 100);
                const pan = header.headerInt('pan', 0);
                let obj = {};
                obj['name'] = file;
                obj['volume'] = volume;
                obj['pitch'] = pitch;
                obj['pan'] = pan;
                parameters.push(obj);
                break;
            case 'script':
                code = 45;
                new NotEmptyValidator().validate(context, 'script', header['script']);
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
        return {code: code, indent: null, parameters: parameters};
    }
    convertCommand_vehicle(context: Context): void {
        context.push({'code': 206, 'indent': this.indent, 'parameters': []});
    }
    convertCommand_transparent(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 211, 'indent': this.indent, 'parameters': [flag]});
    }
    /**
     * ○ アニメーションの表示
     */
    convertCommand_anime(context: Context): void {
        const target = context.headerInt('target');
        const anime = context.headerInt('anime');
        const wait = context.headerBool('wait', false);
        context.push({'code': 212, 'indent': this.indent, 'parameters': [target, anime, wait]});
    }
    /**
     * ○ フキダシアイコンの表示
     */
    convertCommand_balloon(context: Context): void {
        const target = context.headerInt('target');
        const balloon = context.headerInt('balloon');
        const wait = context.headerBool('wait', false);
        context.push({'code': 213, 'indent': this.indent, 'parameters': [target, balloon, wait]});
    }
    /**
     * ○ イベントの一時消去
     */
    convertCommand_erace(context: Context): void {
        context.push({'code': 214, 'indent': this.indent, 'parameters': []});
    }
    convertCommand_followers(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 216, 'indent': this.indent, 'parameters': [flag]});
    }
    convertCommand_gather(context: Context): void {
        context.push({'code': 217, 'indent': this.indent, 'parameters': []});
    }
    convertCommand_fadeout(context: Context): void {
        context.push({'code': 221, 'indent': this.indent, 'parameters': []});
    }
    convertCommand_fadein(context: Context): void {
        context.push({'code': 222, 'indent': this.indent, 'parameters': []});
    }
    convertCommand_tone(context: Context): void  {
        const tone = context.headerTone();
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 223, 'indent': this.indent, 'parameters': [tone, time, wait]});
    }
    convertCommand_flash(context: Context): void  {
        const red = context.headerInt('red', 255);
        const green = context.headerInt('green', 255);
        const blue = context.headerInt('blue', 255);
        const strength = context.headerInt('strength', 170);
        var color = [red, green, blue, strength];
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 224, 'indent': this.indent, 'parameters': [color, time, wait]});
    }
    convertCommand_shake(context: Context): void  {
        const strength = context.headerInt('strength', 5);
        const speed = context.headerInt('speed', 5);
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 225, 'indent': this.indent, 'parameters': [strength, speed, time, wait]});
    }
    convertCommand_wait(context: Context): void  {
        const time = context.headerInt('time', 60);
        context.push({'code': 230, 'indent': this.indent, 'parameters': [time]});
    }
    convertCommand_picture(context: Context): void  {
        const layer = context.headerInt('layer');
        const file = context.header['file'];
        const origin = context.header['origin'] === 'center' ? 1 : 0;
        const type = context.header['type'] === 'var' ? 1 : 0;
        const x = context.headerInt('x', 0);
        const y = context.headerInt('y', 0);
        const zoomX = context.headerInt('zoom_x', 100);
        const zoomy = context.headerInt('zoom_y', 100);
        const opacity = context.headerInt('transparent', 255);
        const blend = context.headerInt('blend', 0);
        context.push({'code': 231, 'indent': this.indent, 'parameters': [layer, file, origin, type, x, y, zoomX, zoomy, opacity, blend]});
    }
    convertCommand_picture_move(context: Context): void  {
        const layer = context.headerInt('layer');
        const origin = context.headerInt('origin', 0);
        const type = context.header['type'] === 'var' ? 1 : 0;
        const x = context.headerInt('x', 0);
        const y = context.headerInt('y', 0);
        const zoomX = context.headerInt('zoom_x', 100);
        const zoomy = context.headerInt('zoom_y', 100);
        const opacity = context.headerInt('transparent', 255);
        const blend = context.headerInt('blend', 0);
        const time = context.headerInt('time', 0);
        const wait = context.headerBool('wait', true);
        context.push({'code': 232, 'indent': this.indent, 'parameters': [layer, 0, origin, type, x, y, zoomX, zoomy, opacity, blend, time, wait]});
    }
    convertCommand_picture_rotation(context: Context): void  {
        const layer = context.headerInt('layer');
        const speed = context.headerInt('speed', 5);
        context.push({'code': 233, 'indent': this.indent, 'parameters': [layer, speed]});
    }
    convertCommand_picture_tone(context: Context): void  {
        const layer = context.headerInt('layer');
        const tone = context.headerTone();
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 234, 'indent': this.indent, 'parameters': [layer, tone, time, wait]});
    }
    convertCommand_picture_erace(context: Context): void {
        const layer = context.headerInt('layer');
        context.push({'code': 235, 'indent': this.indent, 'parameters': [layer]});
    }
    convertCommand_picture_weather(context: Context): void  {
        const weather = context.headerStr('weather', 'none');
        const strength = context.headerInt('strength', 5);
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 236, 'indent': this.indent, 'parameters': [weather, strength, time, wait]});
    }
    /**
     * ○ ＢＧＭの演奏
     */
    convertCommand_bgm(context: Context): void {
        var name = context.headerStr('file');
        var volume = context.headerInt('volume', 100);
        var pitch = context.headerInt('pitch', 100);
        var pan = context.headerInt('pan', 0);
        const bgm: RPG.AudioFile = {name: name, volume: volume, pitch: pitch, pan: pan};

        context.push({'code': 241, 'indent': this.indent, 'parameters': [bgm]});
    }
    /**
     * ○ ＢＧＭのフェードアウト
     */
    convertCommand_fadeout_bgm(context: Context): void {
        const time = context.headerInt('time', 10);
        context.push({'code': 242, 'indent': this.indent, 'parameters': [time]});
    }
    /**
     * ○ ＢＧＭの保存
     */
    convertCommand_save_bgm(context: Context): void {
        context.push({'code': 243, 'indent': this.indent, 'parameters': []});
    }
    /**
     * ○ ＢＧＭの再開
     */
    convertCommand_resume_bgm(context: Context): void {
        context.push({'code': 244, 'indent': this.indent, 'parameters': []});
    }
    /**
     * ○ ＢＧＳの演奏
     */
    convertCommand_bgs(context: Context): void {
        var name = context.headerStr('file');
        var volume = context.headerInt('volume', 100);
        var pitch = context.headerInt('pitch', 100);
        var pan = context.headerInt('pan', 0);
        const bgs: RPG.AudioFile = {name: name, volume: volume, pitch: pitch, pan: pan};

        context.push({'code': 245, 'indent': this.indent, 'parameters': [bgs]});
    }
    /**
     * ○ ＢＧＳのフェードアウト
     */
    convertCommand_fadeout_bgs(context: Context): void {
        const time = context.headerInt('time', 10);
        context.push({'code': 246, 'indent': this.indent, 'parameters': [time]});
    }
    /**
     * ○ ＭＥの演奏
     */
    convertCommand_me(context: Context): void {
        var name = context.headerStr('file');
        var volume = context.headerInt('volume', 100);
        var pitch = context.headerInt('pitch', 100);
        var pan = context.headerInt('pan', 0);
        const me: RPG.AudioFile = {name: name, volume: volume, pitch: pitch, pan: pan};

        context.push({'code': 249, 'indent': this.indent, 'parameters': [me]});
    }
    /**
     * ○ ＳＥの演奏
     */
    convertCommand_se(context: Context): void {
        var name = context.headerStr('file');
        var volume = context.headerInt('volume', 100);
        var pitch = context.headerInt('pitch', 100);
        var pan = context.headerInt('pan', 0);
        const se: RPG.AudioFile = {name: name, volume: volume, pitch: pitch, pan: pan};

        context.push({'code': 250, 'indent': this.indent, 'parameters': [se]});
    }
    /**
     * ○ ＳＥの停止
     */
    convertCommand_stop_se(context: Context): void {
        context.push({'code': 251, 'indent': this.indent, 'parameters': []});
    }
    /**
     * ○ メニュー画面を開く
     */
    convertCommnad_menu_open(context: Context): void {
        context.push({'code': 351, 'indent': this.indent, 'parameters': []});
    }
    /**
     * ○ セーブ画面を開く
     */
    convertCommnad_save_open(context: Context): void {
        context.push({'code': 352, 'indent': this.indent, 'parameters': []});
    }
    /**
     * ○ ゲームオーバー
     */
    convertCommnad_gameover(context: Context): void {
        context.push({'code': 353, 'indent': this.indent, 'parameters': []});
    }
    /**
     * ○ タイトル画面に戻す
     */
    convertCommnad_title_return(context: Context): void {
        context.push({'code': 354, 'indent': this.indent, 'parameters': []});
    }
    /**
     * ○ ムービーの再生
     */
    convertCommand_movie(context: Context): void {
        var file = context.headerStr('file');
        context.push({'code': 261, 'indent': this.indent, 'parameters': [file]});
    }
    /**
     * ○ タイルセットの変更
     */
    convertCommand_tileset(context: Context): void {
        var id = context.headerStr('id');
        context.push({'code': 282, 'indent': this.indent, 'parameters': [id]});
    }
    convertCommand_all_recovery(context: Context): void {
        var params = context.headerVar('actor');
        context.push({'code': 314, 'indent': this.indent, 'parameters': [params[0], params[1]]});
    }
    convertCommand_exp(context: Context): void {
        var actor = context.headerVar('actor');
        var value = context.headerOperateVar('value');
        var message = context.headerBool('message', false);
        context.push({'code': 315, 'indent': this.indent, 'parameters': [actor[0], actor[1], value[0], value[1], value[2], message]});
    }
    convertCommand_level(context: Context): void {
        var actor = context.headerVar('actor');
        var value = context.headerOperateVar('value');
        var message = context.headerBool('message', false);
        context.push({'code': 316, 'indent': this.indent, 'parameters': [actor[0], actor[1], value[0], value[1], value[2], message]});
    }
    convertCommand_name(context: Context): void {
        var actor = context.headerInt('actor');
        var value = context.headerStr('value');
        context.push({'code': 320, 'indent': this.indent, 'parameters': [actor, value]});
    }
    convertCommand_class(context: Context): void {
        var actor = context.headerInt('actor');
        var value = context.headerInt('value');
        var keep_exp = context.headerBool('keep_exp', false);
        context.push({'code': 321, 'indent': this.indent, 'parameters': [actor, value, keep_exp]});
    }
    convertCommand_nickname(context: Context): void {
        var actor = context.headerInt('actor');
        var value = context.headerInt('value');
        context.push({'code': 323, 'indent': this.indent, 'parameters': [actor, value]});
    }
    convertCommand_end(context: Context): void {
        this.indent--;
        context.push({'code': 0, 'indent': this.indent + 1, 'parameters': []});
    }
}

class Block {
    header: string;
    data: Array<string> = [];
    constructor(public lineNumber: number) {
    }
    pushMsg(line: string) {
        if (AUTO_WARD_WRAP && line.indexOf('@') === -1) {
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
export class Context {
    constructor(public file: string,
                public lineNumber: number,
                public command: string,
                public list: Array<RPG.EventCommand>,
                public _header: Header,
                public data: Array<string>) {
    }
    push(command: RPG.EventCommand): void {
        this.list.push(command);
    }
    get header(): {[key: string]: string} {
        return this._header.header;
    }
    headerInt(id: string, defaultValue = 0): number {
        return this._header.headerInt(id, defaultValue);
    }
    headerStr(id: string, defaultValue = ''): string {
        return this._header.headerStr(id, defaultValue);
    }
    headerBool(id: string, defaultValue = false): boolean {
        return this._header.headerBool(id, defaultValue);
    }
    headerTone(): Array<number> {
        return this._header.headerTone();
    }
    headerVar(id: string): Array<number> {
        return this._header.headerVar(id);
    }
    headerOperateVar(id: string): Array<number> {
        return this._header.headerOperateVar(id);
    }
    error(msg: string): void {
        console.error(`file: ${this.file} line: ${this.lineNumber} command: ${this.command} ${msg}`);
    }
    insertTop(command: RPG.EventCommand): void {
        this.list.splice(0, 0, command);
    }
}
class Header {
    constructor(public header: {[key: string]: string}) {
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
    headerBool(id: string, defaultValue = false): boolean {
        const value = this.header[id];
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        return defaultValue;
    }
    headerTone(): Array<number> {
        const red = this.headerInt('red', 0);
        const green = this.headerInt('green', 0);
        const blue = this.headerInt('blue', 0);
        const gray = this.headerInt('gray', 0);
        var tone = [red, green, blue, gray];
        return tone;
    }
    headerVar(id: string): Array<number> {
        const value = this.header[id];
        var reg = /^[+]{0,1}(var\.){0,1}(\d+)$/;
        var ret = reg.exec(value);

        var paramId = parseInt(ret[2]);
        if (ret[1] === undefined) {
            return [0, paramId];
        } else {
            return [1, paramId];
        }
    }
    headerOperateVar(id: string): Array<number> {
        const value = this.header[id];
        var reg = /^([-]{0,1})(var\.){0,1}(\d+)$/;
        var ret = reg.exec(value);

        var operation = ret[1] === '-' ? 1 : 0;
        var paramId = parseInt(ret[3]);
        if (ret[2] === undefined) {
            return [operation, 0, paramId];
        } else {
            return [operation, 1, paramId];
        }
    }
}

Saba.applyMyMethods(_Game_Interpreter, Game_Interpreter);
Saba.applyMyMethods(_Scene_Map, Scene_Map);

}}
