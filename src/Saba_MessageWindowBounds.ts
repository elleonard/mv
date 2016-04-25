//=============================================================================
// Saba_MessageWindowBounds.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc メッセージウィンドウの位置やフォントサイズを設定するプラグインです。
 *
 *
 * @param topWindowMargin
 * @desc 上部に表示するメッセージウィンドウの表示位置の空きです。上、右、下、左の順です（ただし、下のマージンは無効です）
 * @default 0, 0, 0, 0
 *
 * @param topWindowPadding
 * @desc 上部に表示するメッセージウィンドウの文字と枠の空きです。上、右、下、左の順です。
 * @default 0, 0, 0, 0
 *
 * @param topWindowFontSize
 * @desc 上部に表示するメッセージウィンドウのフォントサイズです
 * @default 28
 *
 * @param centerWindowMargin
 * @desc 中央に表示するメッセージウィンドウの表示位置の空きです。上、右、下、左の順です（ただし、下のマージンは無効です）
 * @default 0, 0, 0, 0
 *
 * @param centerWindowPadding
 * @desc 中央に表示するメッセージウィンドウの文字と枠の空きです。上、右、下、左の順です。
 * @default 0, 0, 0, 0
 *
 * @param centerWindowFontSize
 * @desc 中央に表示するメッセージウィンドウのフォントサイズです
 * @default 28
 *
 * @param bottomWindowMargin
 * @desc 下部に表示するメッセージウィンドウの表示位置の空きです。上、右、下、左の順です（ただし、上のマージンは無効です）
 * @default 0, 0, 0, 0
 *
 * @param bottomWindowPadding
 * @desc 下部に表示するメッセージウィンドウの文字と枠の空きです。上、右、下、左の順です。
 * @default 0, 0, 0, 0
 *
 * @param bottomWindowFontSize
 * @desc 下部に表示するメッセージウィンドウのフォントサイズです
 * @default 28
 *
 * @help
 * Ver
 *
 * Saba_Tachie と併用可能です。その場合、Saba_Tachie よりも上に配置してください。
 * 右の padding は、Yami Engine Delta - Word Wrap との併用時にのみ動作します。
 * YED_WordWrap よりも下に配置してください。
 *
 * @license
 * Saba_MapTachie licensed under the MIT License.
 */
module Saba {
export module MessageWindowBounds {

const parameters = PluginManager.parameters('Saba_MessageWindowBounds');

const topMargin = Saba.toIntArrayByStr(parameters['topWindowMargin'], 4);
const topPadding = Saba.toIntArrayByStr(parameters['topWindowPadding'], 4);
const centerMargin = Saba.toIntArrayByStr(parameters['centerWindowMargin'], 4);
const centerPadding = Saba.toIntArrayByStr(parameters['centerWindowPadding'], 4);
const bottomMargin = Saba.toIntArrayByStr(parameters['bottomWindowMargin'], 4);
const bottomPadding = Saba.toIntArrayByStr(parameters['bottomWindowPadding'], 4);
const topWindowFontSize = parseInt(parameters['topWindowFontSize']);
const centerWindowFontSize = parseInt(parameters['centerWindowFontSize']);
const bottomWindowFontSize = parseInt(parameters['bottomWindowFontSize']);


const TOP_POS = 0;
const CENTER_POS = 1;
const BOTTOM_POS = 2;

var Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
Window_Message.prototype.updatePlacement = function() {
    Window_Message_updatePlacement.call(this);
    var margin = getWindowMargin(this._positionType);
    this.x += margin[3];
    if (this._positionType == BOTTOM_POS) {
        this.y -= margin[2];
    } else {
        this.y += margin[0];
    }
};

var Window_Message_updateBackground = Window_Message.prototype.updateBackground;
Window_Message.prototype.updateBackground = function() {
    if (! Saba.Tachie) {
        this.refreshWindowRect();
    }
    Window_Message_updateBackground.call(this);
};
var Window_Message_windowWidth = Window_Message.prototype.windowWidth;
Window_Message.prototype.windowWidth = function() {
    var baseWidth = Window_Message_windowWidth.call(this);
    var margin = getWindowMargin(this._positionType);
    return baseWidth - margin[1] - margin[3];
};

var Window_Message_windowHeight = Window_Message.prototype.windowHeight;
Window_Message.prototype.windowHeight = function() {
    var baseHeight = Window_Message_windowHeight.call(this);
    var padding = getWindowPadding(this._positionType);
    return baseHeight + padding[0] + padding[2];
};

var Window_Message_newLineX = Window_Message.prototype.newLineX;
Window_Message.prototype.newLineX = function() {
    var xx = Window_Message_newLineX.call(this);
    var padding = getWindowPadding(this._positionType);
    return xx + padding[3];
}

var Window_Message_newPage = Window_Message.prototype.newPage;
Window_Message.prototype.newPage = function() {
    Window_Message_newPage.call(this);
    if (this._galMode) {
        return;
    }
    var padding = getWindowPadding(this._positionType);
    this._textState.y = this.standardPadding() + padding[0];
}

Window_Message.prototype.textAreaWidth = function(): number {
    var padding = getWindowPadding(this._positionType);
    return this.contentsWidth() - padding[1];
};

var Window_Message_standardFontSize = Window_Message.prototype.standardFontSize;
Window_Message.prototype.standardFontSize = function() {
    switch (this._positionType) {
    case TOP_POS:
        return topWindowFontSize;
    case CENTER_POS:
        return centerWindowFontSize;
    case BOTTOM_POS:
        return bottomWindowFontSize;
    default:
        return Window_Message_standardFontSize.call(this);
    }
}
var Window_Message_lineHeight = Window_Message.prototype.lineHeight;
Window_Message.prototype.lineHeight = function() {
    return this.standardFontSize() + 8;
}

const getWindowPadding = (type: number): Array<number> => {
    switch (type) {
    case TOP_POS:
        return topPadding;
    case CENTER_POS:
        return centerPadding;
    case BOTTOM_POS:
        return bottomPadding;
    default:
        return [0, 0, 0, 0];
    }
}
const getWindowMargin = (type: number): Array<number> => {
    switch (type) {
    case TOP_POS:
        return topMargin;
    case CENTER_POS:
        return centerMargin;
    case BOTTOM_POS:
        return bottomMargin;
    default:
        return [0, 0, 0, 0];
    }
}

Window_Message.prototype.refreshWindowRect = function() {
    this.move(0, 0, this.windowWidth(), this.windowHeight());
    this.createContents();
    this.updatePlacement();
    this._refreshContents();
};

}}

interface Window_Message {
    textAreaWidth(): number;
    refreshWindowRect(): void;
}