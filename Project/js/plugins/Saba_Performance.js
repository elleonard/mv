//=============================================================================
// Saba_Performanse.js
//=============================================================================
/*:ja
 * @plugindesc テスト版です！！！！
 * @author Sabakan
 *
 * @help
 * ・MV1.3 WebGL モード限定です
 * ・blur の表現が変わります（隙間が気になります……）
 * ・loadBitmap で読み込んだ Bitmap に対して描画しようとするとエラーになります。
 */
var Saba;
(function (Saba) {


/**
 * Bitmap.blur が重いのでフィルタで代用
 */
Scene_MenuBase.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    var blurFilter = new PIXI.filters.BlurFilter(1);
    this._backgroundSprite.filters = [blurFilter];
    this.addChild(this._backgroundSprite);
};
SceneManager.snapForBackground = function() {
    this._backgroundBitmap = this.snap();
    // this._backgroundBitmap.blur();
};

/**
 * Scene_Title から newGame は snapForBackground は不必要
 */
Scene_Title.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    if (!SceneManager.isNextScene(Scene_Map)) {
        SceneManager.snapForBackground();
    }
};


/**
 * マップ切り替え時は SceneManager.snapForBackground を呼ばないようにした
 */
Scene_Map.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    if (!SceneManager.isNextScene(Scene_Battle) && !SceneManager.isNextScene(Scene_Map)) {
        this._spriteset.update();
        this._mapNameWindow.hide();
        SceneManager.snapForBackground();
    }
    $gameScreen.clearZoom();
};

/**
 * Window の描画は drawImage が何度も走るので PIXI.Sprite で代用
 */
Window.prototype._refreshBack = function() {
    var m = this._margin;
    var w = this._width - m * 2;
    var h = this._height - m * 2;
    // var bitmap = new Bitmap(w, h);

    // this._windowBackSprite.bitmap = bitmap;
    this._windowBackSprite.setFrame(0, 0, w, h);
    this._windowBackSprite.move(m, m);

    this._windowBackSprite._toneFilter = new ToneFilter();

    if (w > 0 && h > 0 && this._windowskin) {
        var baseTexture = this.getBaseTexture();

        this._windowBackSprite.removeChildren();

        var p = 96;
        var texture = new PIXI.Texture(baseTexture);
        texture.frame = new PIXI.Rectangle(0, 0, p, p);
        var backSprite = new PIXI.Sprite(texture);
        backSprite.width = w;
        backSprite.height = h;
        this._windowBackSprite.addChild(backSprite);
        // bitmap.blt(this._windowskin, 0, 0, p, p, 0, 0, w, h);


        var tileTexture = new PIXI.Texture(baseTexture);
        tileTexture.frame = new PIXI.Rectangle(0, p, p, p);

        for (var y = 0; y < h; y += p) {
            for (var x = 0; x < w; x += p) {
                var ww = p;
                var hh = p;
                if (x + ww > w) {
                    ww = w - x;
                }
                if (y + hh > h) {
                    hh = h - y;
                }
                var tileSprite
                if (p != hh || p != ww) {
                    var tileTexture2 = new PIXI.Texture(baseTexture);
                    tileTexture2.frame = new PIXI.Rectangle(0, p, ww, hh);
                    tileSprite = new PIXI.Sprite(tileTexture2);
                } else {
                    tileSprite = new PIXI.Sprite(tileTexture);
                }
                tileSprite.width = ww;
                tileSprite.height = hh;
                tileSprite.position.x = x;
                tileSprite.position.y = y;
                this._windowBackSprite.addChild(tileSprite);
                // bitmap.blt(this._windowskin, 0, p, p, p, x, y, p, p);
            }
        }
        var tone = this._colorTone;
        this._windowBackSprite._toneFilter.adjustTone(tone[0], tone[1], tone[2]);
        //bitmap.adjustTone(tone[0], tone[1], tone[2]);
    }
};
Window.prototype.getBaseTexture = function() {
    var baseTexture = PIXI.utils.BaseTextureCache[this._windowskin._image.src];
    if (! baseTexture) {
        baseTexture = new PIXI.BaseTexture(this._windowskin._image, PIXI.SCALE_MODES.DEFAULT);
        baseTexture.imageUrl = this._windowskin.src;
        PIXI.utils.BaseTextureCache[this._windowskin._image.src] = baseTexture;
    }
    return baseTexture;
};
Window.prototype._refreshFrame = function() {
    var w = this._width;
    var h = this._height;
    var m = 24;
    // var bitmap = new Bitmap(w, h);

    // this._windowFrameSprite.bitmap = bitmap;
    this._windowFrameSprite.setFrame(0, 0, w, h);

    if (w > 0 && h > 0 && this._windowskin) {
        // var skin = this._windowskin;
        var baseTexture = this.getBaseTexture();

        var parent = this._windowFrameSprite;
        parent.removeChildren();
        var p = 96;
        var q = 96;
        this._addPixiSprite(parent, baseTexture, p+m, 0+0, p-m*2, m, m, 0, w-m*2, m);
        this._addPixiSprite(parent, baseTexture, p+m, 0+q-m, p-m*2, m, m, h-m, w-m*2, m);
        this._addPixiSprite(parent, baseTexture, p+0, 0+m, m, p-m*2, 0, m, m, h-m*2);
        this._addPixiSprite(parent, baseTexture, p+q-m, 0+m, m, p-m*2, w-m, m, m, h-m*2);
        this._addPixiSprite(parent, baseTexture, p+0, 0+0, m, m, 0, 0, m, m);
        this._addPixiSprite(parent, baseTexture, p+q-m, 0+0, m, m, w-m, 0, m, m);
        this._addPixiSprite(parent, baseTexture, p+0, 0+q-m, m, m, 0, h-m, m, m);
        this._addPixiSprite(parent, baseTexture, p+q-m, 0+q-m, m, m, w-m, h-m, m, m);

        // bitmap.blt(skin, p+m, 0+0, p-m*2, m, m, 0, w-m*2, m);
        // bitmap.blt(skin, p+m, 0+q-m, p-m*2, m, m, h-m, w-m*2, m);
        // bitmap.blt(skin, p+0, 0+m, m, p-m*2, 0, m, m, h-m*2);
        // bitmap.blt(skin, p+q-m, 0+m, m, p-m*2, w-m, m, m, h-m*2);
        // bitmap.blt(skin, p+0, 0+0, m, m, 0, 0, m, m);
        // bitmap.blt(skin, p+q-m, 0+0, m, m, w-m, 0, m, m);
        // bitmap.blt(skin, p+0, 0+q-m, m, m, 0, h-m, m, m);
        // bitmap.blt(skin, p+q-m, 0+q-m, m, m, w-m, h-m, m, m);
    }
};
Window.prototype._addPixiSprite = function(parent, baseTexture, sx, sy, sw, sh, dx, dy, dw, dh) {
    var texture = new PIXI.Texture(baseTexture);
    texture.frame = new PIXI.Rectangle(sx, sy, sw, sh);
    var sprite = new PIXI.Sprite(texture);
    sprite.width = dw;
    sprite.height = dh;
    sprite.position.x = dx;
    sprite.position.y = dy;
    parent.addChild(sprite);
};
/* バグっちゃったのでひとまずナシ
Window.prototype._refreshCursor = function() {
    var pad = this._padding;
    var x = this._cursorRect.x + pad - this.origin.x;
    var y = this._cursorRect.y + pad - this.origin.y;
    var w = this._cursorRect.width;
    var h = this._cursorRect.height;
    var m = 4;
    var x2 = Math.max(x, pad);
    var y2 = Math.max(y, pad);
    var ox = x - x2;
    var oy = y - y2;
    var w2 = Math.min(w, this._width - pad - x2);
    var h2 = Math.min(h, this._height - pad - y2);
    // var bitmap = new Bitmap(w2, h2);

    // this._windowCursorSprite.bitmap = bitmap;
    this._windowCursorSprite.setFrame(0, 0, w2, h2);
    this._windowCursorSprite.move(x2, y2);

    if (w > 0 && h > 0 && this._windowskin) {
        // var skin = this._windowskin;
        var p = 96;
        var q = 48;

        var baseTexture = this.getBaseTexture();
        var parent = this._windowCursorSprite;
        parent.removeChildren();

        this._addPixiSprite(parent, baseTexture, p+m, p+m, q-m*2, q-m*2, ox+m, oy+m, w-m*2, h-m*2);
        this._addPixiSprite(parent, baseTexture, p+m, p+0, q-m*2, m, ox+m, oy+0, w-m*2, m);
        this._addPixiSprite(parent, baseTexture, p+m, p+q-m, q-m*2, m, ox+m, oy+h-m, w-m*2, m);
        this._addPixiSprite(parent, baseTexture, p+0, p+m, m, q-m*2, ox+0, oy+m, m, h-m*2);
        this._addPixiSprite(parent, baseTexture, p+q-m, p+m, m, q-m*2, ox+w-m, oy+m, m, h-m*2);
        this._addPixiSprite(parent, baseTexture, p+0, p+0, m, m, ox+0, oy+0, m, m);
        this._addPixiSprite(parent, baseTexture, p+q-m, p+0, m, m, ox+w-m, oy+0, m, m);
        this._addPixiSprite(parent, baseTexture, p+0, p+q-m, m, m, ox+0, oy+h-m, m, m);
        this._addPixiSprite(parent, baseTexture, p+q-m, p+q-m, m, m, ox+w-m, oy+h-m, m, m);

        // bitmap.blt(skin, p+m, p+m, q-m*2, q-m*2, ox+m, oy+m, w-m*2, h-m*2);
        // bitmap.blt(skin, p+m, p+0, q-m*2, m, ox+m, oy+0, w-m*2, m);
        // bitmap.blt(skin, p+m, p+q-m, q-m*2, m, ox+m, oy+h-m, w-m*2, m);
        // bitmap.blt(skin, p+0, p+m, m, q-m*2, ox+0, oy+m, m, h-m*2);
        // bitmap.blt(skin, p+q-m, p+m, m, q-m*2, ox+w-m, oy+m, m, h-m*2);
        // bitmap.blt(skin, p+0, p+0, m, m, ox+0, oy+0, m, m);
        // bitmap.blt(skin, p+q-m, p+0, m, m, ox+w-m, oy+0, m, m);
        // bitmap.blt(skin, p+0, p+q-m, m, m, ox+0, oy+h-m, m, m);
        // bitmap.blt(skin, p+q-m, p+q-m, m, m, ox+w-m, oy+h-m, m, m);
    }
};*/


/**
 * 色調の変化の度に drawImage が走るのでフィルタで代用
 */
Sprite.prototype.setColorTone = function(tone) {
    if (!(tone instanceof Array)) {
        throw new Error('Argument must be an array');
    }
    if (!this._colorTone.equals(tone)) {
        if (! this._toneFilter) {
            this._toneFilter = new ToneFilter();
            this.filters = [this._toneFilter];
        }
        this._colorTone = tone.clone();
        this._toneFilter.reset();
        this._toneFilter.adjustTone(tone[0], tone[1], tone[2]);
    }
};

/**
 * ウィンドウの初期化で3回 _refreshAllParts が走るので1回にまとめた
 */
var _Window_Base_initialize = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(x, y, width, height) {
    this._initializing = true;
    _Window_Base_initialize.call(this, x, y, width, height);
    this._initializing = false;
    this._refreshAllParts();
};
var _Window__refreshAllParts = Window.prototype._refreshAllParts;
Window.prototype._refreshAllParts = function() {
    if (this._initializing) {
        return;
    }
    _Window__refreshAllParts.call(this);
};


/**
 * 画像を読み込んで使う Bitmap は、読み込み完了時に drawImage をしない
 */
Bitmap.prototype._onLoad = function() {
    if(Decrypter.hasEncryptedImages) {
        window.URL.revokeObjectURL(this._image.src);
    }
    this._isLoading = false;
    this.resize(this._image.width, this._image.height);

    this._baseTexture.loadSource(this._image);
    this._canvas2 = this._canvas;
    this._context2 = this._context;
    this._canvas = this._image;
    this._context = null;
    //this._context.drawImage(this._image, 0, 0);
    this._setDirty();
    this._callLoadListeners();
};
Bitmap.prototype.getPixel = function(x, y) {
    if (! this._context) {
        // この時だけ仕方なく描画。
        this._canvas = this._canvas2;
        this._context = this._context2;
        this._context.drawImage(this._image, 0, 0);
    }
    var data = this._context.getImageData(x, y, 1, 1).data;
    var result = '#';
    for (var i = 0; i < 3; i++) {
        result += data[i].toString(16).padZero(2);
    }
    return result;
};

})(Saba || (Saba = {}));
