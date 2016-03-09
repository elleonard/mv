//=============================================================================
// KisekiWindow.js
//=============================================================================
/*:ja
 * @plugindesc 画面下にアクターの情報を表示します
 * @author Sabakan
 *
 * @param UseSmallFaceImage?
 * @desc アクター画像の描画に、あらかじめ用意しておいた 192*96 サイズのきれいな顔グラフィックを使う場合、true にします。
 * @default false
 *
 * @param HideSwitchId
 * @desc アクター情報を非表示にするスイッチ番号です
 * @default 2
 *
 * @param ShowTp?
 * @desc TPゲージも表示するかどうかのフラグです
 * @default true
 *
 * @param AreaWidth
 * @desc 描画領域の幅です
 * @default 120
 *
 * @help
 * Ver0.1
 *
 * UseSmallFaceImage が false の場合、顔画像をプログラムで縮小して表示します。
 * その場合、画像が汚くなります。
 *
 * UseSmallFaceImage true の場合、img/faces の中に、
 * 対応する画像の末尾に _s をつけた 192*96 サイズのファイルを用意します。
 * 例: Actor1.png → Actor1_s.png
 * 画像編集ソフトで縮小すると綺麗に表示されます。
 *
 * プラグインコマンドはありません。
 */


module KisekiWindow {

var parameters = PluginManager.parameters('KisekiWindow');
var useSmallFaceImage = String(parameters['UseSmallFaceImage?'] === 'true');
var areaWidth = parseInt(String(parameters['AreaWidth'] || 120));
var showTp = String(parameters['ShowTp?'] === 'true');
var hideSwitchId = parseInt(String(parameters['HideSwitchId'] || 2));

class Window_KisekiStatus extends Window_Selectable {
    /** ウィンドウの高さ */
    private static WINDOW_HEIGHT = 70;
    /** ゲージの高さ */
    private static GAUGE_HEIGHT = 2;
    /** 顔グラのサイズ */
    private static SMALL_FACE_IMAGE_SIZE = 48;
    private lastActorInfo: {[actorId: number]: string} = {};
    private _messageWindow: Window_Message;

    constructor(messageWindow: Window_Message) {
        super(0, Graphics.height - Window_KisekiStatus.WINDOW_HEIGHT, Graphics.width, Window_KisekiStatus.WINDOW_HEIGHT);
        this.refresh();
        this.backOpacity = 0;
        this.opacity = 0;
        this.padding = 0;
        this._messageWindow = messageWindow;
    }
    /**
     * @override
     */
    update(): void {
        super.update();
        if (this.isStatesChanged()) {
            this.refresh();
        }
        this.updateVisivility();
    }
    /**
     * @override
     */
    refresh(): void {
        this.saveLastStates();
        super.refresh();
    }
    /**
     * @override
     */
    standardPadding(): number {
        return 0;
    }
    /**
     * @override
     */
    spacing(): number {
        return 0;
    }
    /**
     * @override
     */
    maxItems(): number {
        return $gameParty.members().length;
    }
    /**
     * @override
     */
    maxCols(): number {
        return this.maxItems();
    }
    /**
     * @override
     */
    drawItem(index: number): void {
        let rect: Rectangle = this.itemRect(index);
        var actor = $gameParty.members()[index];
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.drawBg(actor, rect.x + 5, rect.y - 1);
        this.drawActorMiniFace(actor, rect.x + 7, rect.y);
        var xx = 8;
        var yy = 34;
        var gaugeWidth = areaWidth - 60;
        this.drawActorHpGauge(actor, rect.x + xx + 47, rect.y + yy + 0, gaugeWidth);
        this.drawActorMpGauge(actor, rect.x + xx + 42, rect.y + yy + 4, gaugeWidth);
        this.drawActorTpGauge(actor, rect.x + xx + 37, rect.y + yy + 8, gaugeWidth);
        this.drawFrame(actor, rect.x + 5, rect.y - 1);
    }
    /**
     * @override
     */
    itemRect(index: number): Rectangle {
        return new Rectangle(areaWidth * index, 20, areaWidth, Window_KisekiStatus.WINDOW_HEIGHT);
    }
    /**
     * 状態が変わったメンバーが存在するか？
     */
    private isStatesChanged(): boolean {
        var members = $gameParty.members();
        for (var actor of members) {
            var infoList = this.lastActorInfo[actor.actorId()];
            if (! infoList) {
                // 初期更新 or メンバーが追加された
                return true;
            }
            if (infoList !== this.createInfoList(actor)) {
                // 状態が変わった
                return true;
            }
        }
        var memberCount = 0;
        for (var key in this.lastActorInfo) {
            if (this.lastActorInfo.hasOwnProperty(key)) {
                memberCount++;
            }
        }
        if (members.length !== memberCount) {
            // メンバーが抜けた
            return true;
        }
        return false;
    }
    /**
     * メンバーの状態を保存する
     */
    private saveLastStates(): void {
        this.lastActorInfo = {};
        for (var actor of $gameParty.members()) {
            this.lastActorInfo[actor.actorId()] = this.createInfoList(actor);
        }
    }
    /**
     * メンバーの状態テキストを作成する
     */
    private createInfoList(actor: Game_Actor): string {
        return [actor.hp, actor.mp, actor.tp].join();
    }
    /**
     * 表示を更新する
     */
    private updateVisivility(): void {
        if ($gameMessage.isBusy()) {
            this.visible = false;
            return;
        }
        if (this._messageWindow && this._messageWindow.isOpen()) {
            return;
        }
        if ($gameSwitches.value(hideSwitchId)) {
            this.visible = false;
            return;
        }
        this.visible = true;
    }
    /**
     * 小さい顔グラを表示する
     */
    private drawActorMiniFace(actor: Game_Actor, x: number, y: number) {
        var size = Window_KisekiStatus.SMALL_FACE_IMAGE_SIZE;
        var smallBitmap = new Bitmap(size, size);

        var fileName = actor.faceName();
        var w = Window_Base._faceWidth;
        var h = Window_Base._faceHeight;
        if (useSmallFaceImage) {
            fileName += '_s';
            w = size;
            h = size;
        }
        var faceImage = ImageManager.loadFace(fileName);
        if (! faceImage.isReady()) {
            this.lastActorInfo = {};
            return;
        }
        smallBitmap.blt(faceImage, actor.faceIndex() % 4 * w, Math.floor(actor.faceIndex() / 4) * h, size, size, 0, 0, size, size);
        this.removeEdge(smallBitmap);

        this.contents.blt(smallBitmap, 0, 0, size, size, x, y, size, size);
    }
    /**
     * 顔グラの端っこを消去する
     */
    private removeEdge(bitmap: Bitmap): void {
        for (var i = 0; i < 22; i++) {
          bitmap.clearRect(0, i, 22 - i, 1);
          bitmap.clearRect(26 + i, i, 22 - i, 1);
          bitmap.clearRect(0, i + 26, i, 1);
          bitmap.clearRect(48 - i, i + 26, i, 1);
        }
    }
    /**
     * HPゲージを描画する
     */
    private drawActorHpGauge(actor: Game_Actor, x: number, y: number, width: number) {
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        this.drawActorGauge(x, y, width, actor.hpRate(), color1, color2);
    }
    /**
     * MPゲージを描画する
     */
    private drawActorMpGauge(actor: Game_Actor, x: number, y: number, width: number) {
        var color1 = this.mpGaugeColor1();
        var color2 = this.mpGaugeColor2();
        this.drawActorGauge(x, y, width, actor.mpRate(), color1, color2);
    }
    /**
     * TPゲージを描画する
     */
    private drawActorTpGauge(actor: Game_Actor, x: number, y: number, width: number) {
        if (! showTp) {
            return;
        }
        var color1 = this.tpGaugeColor1();
        var color2 = this.tpGaugeColor2();
        this.drawActorGauge(x, y, width, actor.tpRate(), color1, color2);
    }
    /**
     * ゲージを描画する
     */
    private drawActorGauge(x, y, width, rate, color1, color2) {
        var fillW = Math.floor(width * rate);
        this.contents.fillRect(x - 2, y - 1, width + 4, 4, this.textColor(15));
        this.contents.fillRect(x - 1, y - 2, width + 2, 6, this.textColor(15));
        this.contents.fillRect(x, y, width, Window_KisekiStatus.GAUGE_HEIGHT, this.gaugeBackColor());
        this.contents.gradientFillRect(x, y, fillW, Window_KisekiStatus.GAUGE_HEIGHT, color1, color2);
    }
    /**
     * 背景を描画する
     */
    private drawBg(actor: Game_Actor, x: number, y: number) {
        var frameImage = ImageManager.loadSystem('Actor_bg1');
        this.contents.blt(frameImage, 0, 0, frameImage.width, frameImage.height, x, y, frameImage.width, frameImage.height);
    }
    /**
     * フレームを描画する
     */
    private drawFrame(actor: Game_Actor, x: number, y: number) {
        var frameImage = ImageManager.loadSystem('Actor_bg2');
        this.contents.blt(frameImage, 0, 0, frameImage.width, frameImage.height, x, y, frameImage.width, frameImage.height);
    }
}

var Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
class _Scene_Map extends Scene_Map {
    protected _kisekiStatusWindow: Window_KisekiStatus;
    /**
     * @alias
     */
    createAllWindows(): void {
        Scene_Map_createAllWindows.call(this);
        this._kisekiStatusWindow = new Window_KisekiStatus(this._messageWindow);
        this.addWindow(this._kisekiStatusWindow);
    }
    refreshKisekiStatus(): void {
        this._kisekiStatusWindow.refresh();
    }
}

var applyMyMethods = (myClass: any, presetClass: any, applyConstructor: boolean) => {
    let myProto = myClass.prototype;
    for (var p in myProto) {
        if (myProto.hasOwnProperty(p)) {
            if (p === 'constructor' && ! applyConstructor) {
                continue;
            }
            presetClass.prototype[p] = myProto[p];
        }
    }
};
applyMyMethods(_Scene_Map, Scene_Map, false);

}
