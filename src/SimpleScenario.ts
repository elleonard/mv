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
 *
 * イベント一覧(@→実装済み)
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
      map_move
      vehicle_pos
      event_pos
      scroll_map
      route_h
      route
      vehicle
 *****************************************************************************
 * キャラクター系
 *****************************************************************************
    @ transparent
    @ followers
    @ gather
      anime
      balloon
      erace
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
                        scenario[name] = self.convert(file2, text);
                    }
                    continue;
                }
                const index = file.indexOf('.txt');
                if (index === -1) {
                    continue;
                }
                const name = file.substr(0, index);
                const text = fs.readFileSync(SCENARIO_PATH +  file, 'utf8');
                scenario[name] = self.convert(file, text);
            }
            console.log(scenario);
            fs.writeFileSync(DATA_PATH + 'Scenario.json', JSON.stringify(scenario));
            DataManager.loadDataFile('$dataScenraio', SCENARIO_FILE_NAME);
        });
    }
    protected convert(file, text): Array<RPG.EventCommand> {
        this.indent = 0;

        const list = [];

        const lines = text.split('\n');
        const blocks: Array<Block> = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            line = this.removeWS(line);
            const block: Block = new Block(i + 1);
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
                block.header = '@messages';
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
            this.convertCommand(file, list, block);
        }
        return list;
    }
    /**
     * ホワイトスペースを削除します。
     */
    protected removeWS(line: string): string {
        const ret = line.replace(/^\s+/g, '');
        if (ret === '_') {
            return '';
        } else {
            return ret;
        }
    }
    /**
     * コマンドを変換します。
     */
    protected convertCommand(file, list: Array<RPG.EventCommand>, block: Block): void {
        const headerList = block.header.split(' ');
        const command = headerList[0].substr(1);
        const header = this.parseHeader(headerList);
        var context = new Context(file, block.lineNumber, command, list, header, block.data);
        try {
            this.validate(context);
            this['convertCommand_' + command](context);
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
    protected validate(context: Context): void {
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
        this.convertCommand_messages(context);
    }
    protected convertCommand_messages(context: Context) {
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
    protected convertCommand_message_h(context: Context): void {
        const actor = context.header['actor'] || '';
        const index = context.headerInt('index', 0);
        const back = context.headerInt('back', 0);
        const pos = context.headerInt('pos', 2);
        context.push({'code': 101, 'indent': this.indent, 'parameters': [actor, index, back, pos]});
        for (const msg of context.data) {
            context.push({'code': 401, 'indent': this.indent, 'parameters': [msg]});
        }
    }
    protected convertCommand_message(context: Context): void {
        const value = context.header['value'];
        context.push({'code': 401, 'indent': this.indent, 'parameters': [value]});
    }
    protected convertCommand_common(context: Context): void {
        const id = context.headerInt('id');
        context.push({'code': 117, 'indent': this.indent, 'parameters': [id]});
    }
    protected convertCommand_sw(context: Context): void {
        const id = context.headerInt('id');
        const end = context.headerInt('end', id);
        const flag = context.headerStr('flag') === 'on' ? 0 : 1;
        context.push({'code': 121, 'indent': this.indent, 'parameters': [id, end, flag]});
    }
    protected convertCommand_var(context: Context): void {
        const id = context.headerInt('id');
        const end = context.headerInt('end', id);
        const op = context.headerStr('op');
        context.push({'code': 122, 'indent': this.indent, 'parameters': [id, end, op, 0]});
    }
    protected convertCommand_self_sw(context: Context): void {
        const id = context.headerInt('id');
        const flag = context.headerStr('flag') === 'on' ? 0 : 1;
        context.push({'code': 123, 'indent': this.indent, 'parameters': [id, flag]});
    }
    protected convertCommand_timer(context: Context): void {
        const flag = context.headerStr('flag') === 'on' ? 0 : 1;
        const time = context.headerInt('time');
        context.push({'code': 124, 'indent': this.indent, 'parameters': [flag, time]});
    }
    protected convertCommand_save_disable(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 134, 'indent': this.indent, 'parameters': [flag]});
    }
    protected convertCommand_menu_disable(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 135, 'indent': this.indent, 'parameters': [flag]});
    }
    protected convertCommand_encount_disable(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 136, 'indent': this.indent, 'parameters': [flag]});
    }
    protected convertCommand_formation_disable(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 137, 'indent': this.indent, 'parameters': [flag]});
    }
    protected convertCommand_transparent(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 211, 'indent': this.indent, 'parameters': [flag]});
    }
    protected convertCommand_followers(context: Context): void {
        var flag = context.headerBool('flag', true) ? 0 : 1;
        context.push({'code': 216, 'indent': this.indent, 'parameters': [flag]});
    }
    protected convertCommand_gather(context: Context): void {
        context.push({'code': 217, 'indent': this.indent, 'parameters': []});
    }
    protected convertCommand_fadeout(context: Context): void {
        context.push({'code': 221, 'indent': this.indent, 'parameters': []});
    }
    protected convertCommand_fadein(context: Context): void {
        context.push({'code': 222, 'indent': this.indent, 'parameters': []});
    }
    protected convertCommand_tone(context: Context): void  {
        const tone = context.headerTone();
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 223, 'indent': this.indent, 'parameters': [tone, time, wait]});
    }
    protected convertCommand_flash(context: Context): void  {
        const red = context.headerInt('red', 255);
        const green = context.headerInt('green', 255);
        const blue = context.headerInt('blue', 255);
        const strength = context.headerInt('strength', 170);
        var color = [red, green, blue, strength];
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 224, 'indent': this.indent, 'parameters': [color, time, wait]});
    }
    protected convertCommand_shake(context: Context): void  {
        const strength = context.headerInt('strength', 5);
        const speed = context.headerInt('speed', 5);
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 225, 'indent': this.indent, 'parameters': [strength, speed, time, wait]});
    }
    protected convertCommand_wait(context: Context): void  {
        const time = context.headerInt('time', 60);
        context.push({'code': 230, 'indent': this.indent, 'parameters': [time]});
    }
    protected convertCommand_picture(context: Context): void  {
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
    protected convertCommand_picture_move(context: Context): void  {
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
        context.push({'code': 232, 'indent': this.indent, 'parameters': [layer, origin, type, x, y, zoomX, zoomy, opacity, blend, time, wait]});
    }
    protected convertCommand_picture_rotation(context: Context): void  {
        const layer = context.headerInt('layer');
        const speed = context.headerInt('speed', 5);
        context.push({'code': 233, 'indent': this.indent, 'parameters': [layer, speed]});
    }
    protected convertCommand_picture_tone(context: Context): void  {
        const layer = context.headerInt('layer');
        const tone = context.headerTone();
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 234, 'indent': this.indent, 'parameters': [layer, tone, time, wait]});
    }
    protected convertCommand_picture_erace(context: Context): void {
        const layer = context.headerInt('layer');
        context.push({'code': 235, 'indent': this.indent, 'parameters': [layer]});
    }
    protected convertCommand_picture_weather(context: Context): void  {
        const weather = context.headerStr('weather', 'none');
        const strength = context.headerInt('strength', 5);
        const time = context.headerInt('time', 60);
        const wait = context.headerBool('wait', true);
        context.push({'code': 236, 'indent': this.indent, 'parameters': [weather, strength, time, wait]});
    }
    protected convertCommand_bgm(context: Context): void {
        var name = context.headerStr('file');
        var volume = context.headerInt('volume', 100);
        var pitch = context.headerInt('pitch', 100);
        var pan = context.headerInt('pan', 100);
        const bgm: RPG.AudioFile = {name: name, volume: volume, pitch: pitch, pan: pan};

        context.push({'code': 241, 'indent': this.indent, 'parameters': [bgm]});
    }
    protected convertCommand_fadeout_bgm(context: Context): void {
        const time = context.headerInt('time', 10);
        context.push({'code': 242, 'indent': this.indent, 'parameters': [time]});
    }
    protected convertCommand_save_bgm(context: Context): void {
        context.push({'code': 243, 'indent': this.indent, 'parameters': []});
    }
    protected convertCommand_resume_bgm(context: Context): void {
        context.push({'code': 244, 'indent': this.indent, 'parameters': []});
    }
    protected convertCommand_bgs(context: Context): void {
        var name = context.headerStr('file');
        var volume = context.headerInt('volume', 100);
        var pitch = context.headerInt('pitch', 100);
        var pan = context.headerInt('pan', 100);
        const bgs: RPG.AudioFile = {name: name, volume: volume, pitch: pitch, pan: pan};

        context.push({'code': 245, 'indent': this.indent, 'parameters': [bgs]});
    }
    protected convertCommand_fadeout_bgs(context: Context): void {
        const time = context.headerInt('time', 10);
        context.push({'code': 246, 'indent': this.indent, 'parameters': [time]});
    }
    protected convertCommand_me(context: Context): void {
        var name = context.headerStr('file');
        var volume = context.headerInt('volume', 100);
        var pitch = context.headerInt('pitch', 100);
        var pan = context.headerInt('pan', 100);
        const me: RPG.AudioFile = {name: name, volume: volume, pitch: pitch, pan: pan};

        context.push({'code': 249, 'indent': this.indent, 'parameters': [me]});
    }
    protected convertCommand_se(context: Context): void {
        var name = context.headerStr('file');
        var volume = context.headerInt('volume', 100);
        var pitch = context.headerInt('pitch', 100);
        var pan = context.headerInt('pan', 100);
        const se: RPG.AudioFile = {name: name, volume: volume, pitch: pitch, pan: pan};

        context.push({'code': 250, 'indent': this.indent, 'parameters': [se]});
    }
    protected convertCommand_stop_se(context: Context): void {
        context.push({'code': 251, 'indent': this.indent, 'parameters': []});
    }
    protected convertCommand_stop_movie(context: Context): void {
        var file = context.headerStr('file');
        context.push({'code': 261, 'indent': this.indent, 'parameters': [file]});
    }
    protected convertCommand_all_recovery(context: Context): void {
        var params = context.headerVar('actor');
        context.push({'code': 314, 'indent': this.indent, 'parameters': [params[0], params[1]]});
    }
    protected convertCommand_exp(context: Context): void {
        var actor = context.headerVar('actor');
        var value = context.headerOperateVar('value');
        var message = context.headerBool('message', false);
        context.push({'code': 315, 'indent': this.indent, 'parameters': [actor[0], actor[1], value[0], value[1], value[2], message]});
    }
    protected convertCommand_level(context: Context): void {
        var actor = context.headerVar('actor');
        var value = context.headerOperateVar('value');
        var message = context.headerBool('message', false);
        context.push({'code': 316, 'indent': this.indent, 'parameters': [actor[0], actor[1], value[0], value[1], value[2], message]});
    }
    protected convertCommand_name(context: Context): void {
        var actor = context.headerInt('actor');
        var value = context.headerStr('value');
        context.push({'code': 320, 'indent': this.indent, 'parameters': [actor, value]});
    }
    protected convertCommand_class(context: Context): void {
        var actor = context.headerInt('actor');
        var value = context.headerInt('value');
        var keep_exp = context.headerBool('keep_exp', false);
        context.push({'code': 321, 'indent': this.indent, 'parameters': [actor, value, keep_exp]});
    }
    protected convertCommand_nickname(context: Context): void {
        var actor = context.headerInt('actor');
        var value = context.headerInt('value');
        context.push({'code': 323, 'indent': this.indent, 'parameters': [actor, value]});
    }

}

class Block {
    header: string;
    data: Array<string> = [];
    constructor(public lineNumber: number) {
    }
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
export class Context {
    constructor(public file: string,
                public lineNumber: number,
                public command: string,
                public list: Array<RPG.EventCommand>,
                public header: {[key: string]: string},
                public data: Array<string>) {
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
    error(msg: string): void {
        console.error(`file: ${this.file} line: ${this.lineNumber} command: ${this.command} ${msg}`);
    }
}

Saba.applyMyMethods(_Game_Interpreter, Game_Interpreter);
Saba.applyMyMethods(_Scene_Map, Scene_Map);

}
