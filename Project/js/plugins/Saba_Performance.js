//=============================================================================
// Saba_Performance.js
//=============================================================================
/*:ja
 * @plugindesc まだテスト版です。OFFにする場合は 0 を入力してください
 * @author Sabakan
 *
 * @param useBlurFilter
 * @desc PIXI のフィルタを使ってブラー効果を適用します。<br>■副作用:　中。ブラーの見た目が変わってしまいます。
 * @default 1
 *
 * @param skipSnapForBackgroundByNewGame
 * @desc ゲーム開始時にSnapForBackgroundをしないようにします。<br>■副作用:　小。ゲーム開始時に特殊な処理をしている場合は無効にしてください
 * @default 1
 *
 * @param skipSnapForBackgroundByMapChange
 * @desc マップ移動時にSnapForBackgroundをしないようにします。<br>■副作用:　小
 * @default 1
 *
 * @param usePixiSpriteToDrawWindow_Base
 * @desc PIXI.Spriteを使ってWindow_Baseを描画します。<br>■副作用:　中。Windowの描画を変更している場合は無効にしてください
 * @default 1
 *
 * @param useFilterToChangePictureTone
 * @desc PIXI のフィルタを使ってピクチャの色調を変化させます。<br>■副作用:　大。グレー効果は効かなくなります
 * @default 1
 *
 * @param reduceWindowInitializeProcess
 * @desc ウィンドウの初期化の無駄な処理を減らします<br>■副作用:　なし
 * @default 1
 *
 * @param skipCallingDrawImageByLoadedBitmap
 * @desc 読み込んだBitmapのdrawImage()呼び出しを省略します<br>■副作用:　中。読み込んだBitmapに描画をするとエラーになります
 * @default 1
 *
 * @param alternateBitmapClearMethod
 * @desc Bitmap.clear() メソッドを高速な方法に切り替えます<br>■副作用:　中。Bitmap.clear()を呼ぶと、CanvasRenderingContext2Dのスタイルもクリアされます
 * @default 1
 *
 * @param usePixiSpriteToDrawIcon
 * @desc PIXI.Spriteを使ってIconを描画します。<br>■副作用:　中。アイコンのZ順に影響が出ることがあります
 * @default 1
 *
 * @param usePixiSpriteToDrawFace
 * @desc PIXI.Spriteを使ってFaceを描画します。<br>■副作用:　中。顔グラのZ順に影響が出ることがあります
 * @default 1
 *
 * @param usePixiSpriteToDrawCharacter
 * @desc PIXI.Spriteを使ってCharacterを描画します。<br>■副作用:　中。キャラグラのZ順に影響が出ることがあります
 * @default 1
 *
 * @param skipStatusWindowRefreshInStartMethod
 * @desc Scene_Menu の開始時に_statusWindow.refresh()を呼ばないようにします。■副作用:　小。ステータスウィンドウがうまく表示されない場合は無効にしてください
 * @default 1
 *
 * @help
 * ・MV1.3 WebGL モード限定です
 * ・canvas.getContext() 呼び出しで固まってしまう機種に対して効果を発揮します
 */
var Saba;
(function (Saba) {

var parameters = PluginManager.parameters('Saba_Performance');


if (parseInt(parameters['useBlurFilter'])) {
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
}

if (parseInt(parameters['skipSnapForBackgroundByNewGame'])) {
    /**
     * Scene_Title から newGame の選択時は、snapForBackground が不必要
     */
    Scene_Title.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        if (!SceneManager.isNextScene(Scene_Map)) {
            SceneManager.snapForBackground();
        }
    };
}

if (parseInt(parameters['skipSnapForBackgroundByMapChange'])) {
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
}

if (parseInt(parameters['usePixiSpriteToDrawWindow_Base'])) {
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
            this._windowBackSprite._toneFilter.reset();
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
        var parent = this._windowCursorSprite;
        parent.removeChildren();

        if (w > 0 && h > 0 && this._windowskin) {
            // var skin = this._windowskin;
            var p = 96;
            var q = 48;

            var baseTexture = this.getBaseTexture();

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
    };
}

if (parseInt(parameters['useFilterToChangePictureTone'])) {
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
}

if (parseInt(parameters['reduceWindowInitializeProcess'])) {
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
}


if (parseInt(parameters['skipCallingDrawImageByLoadedBitmap'])) {
    /**
     * 画像を読み込んで使う Bitmap は drawImage をしない
     */
    Bitmap.prototype._onLoad = function() {
        if(Decrypter.hasEncryptedImages) {
            window.URL.revokeObjectURL(this._image.src);
        }
        this._isLoading = false;
        this.resize(this._image.width, this._image.height);

        this._baseTexture.loadSource(this._image);
        this._canvas2 = this._canvas;
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
            this._context = this._canvas.getContext('2d');
            this._context.drawImage(this._image, 0, 0);
        }
        var data = this._context.getImageData(x, y, 1, 1).data;
        var result = '#';
        for (var i = 0; i < 3; i++) {
            result += data[i].toString(16).padZero(2);
        }
        return result;
    };
}


if (parseInt(parameters['alternateBitmapClearMethod'])) {
    /**
     * Chromium の clearRect は遅い
     */
    Bitmap.prototype.clear = function() {
        this._canvas.width = this._canvas.width;    // 裏技
        this._setDirty();
        //this.clearRect(0, 0, this.width, this.height);
    };
}


if (parseInt(parameters['usePixiSpriteToDrawIcon'])) {
    /**
     * drawIcon では drawImage が行われるので PIXI.Sprite で代用
     */
    Window_Base.prototype.drawIcon = function(iconIndex, x, y) {
        var baseTexture = PIXI.utils.BaseTextureCache['system/IconSet'];
        if (! baseTexture) {
            var bitmap = ImageManager.loadSystem('IconSet');
            if (! bitmap.isReady()) {
                return;
            }
            baseTexture = new PIXI.BaseTexture(bitmap._image, PIXI.SCALE_MODES.DEFAULT);
            baseTexture.imageUrl = 'system/IconSet';
            PIXI.utils.BaseTextureCache['system/IconSet'] = baseTexture;
        }

        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;

        var texture = new PIXI.Texture(baseTexture);
        texture.frame = new PIXI.Rectangle(sx, sy, pw, ph);
        var sprite = new PIXI.Sprite(texture);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.alpha = this.contents.paintOpacity / 255.0;
        this._windowContentsSprite.addChild(sprite);

        // this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
    };
}


if (parseInt(parameters['usePixiSpriteToDrawFace'])) {
    /**
     * drawFace では drawImage が行われるので PIXI.Sprite で代用
     */
    Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
        if (! faceName) {
            return;
        }
        width = width || Window_Base._faceWidth;
        height = height || Window_Base._faceHeight;

        var baseTexture = PIXI.utils.BaseTextureCache['face/' + faceName];
        if (! baseTexture) {
            var bitmap = ImageManager.loadFace(faceName);
            if (! bitmap.isReady()) {
                return;
            }
            baseTexture = new PIXI.BaseTexture(bitmap._image, PIXI.SCALE_MODES.DEFAULT);
            baseTexture.imageUrl = 'face/' + faceName;
            PIXI.utils.BaseTextureCache['face/' + faceName] = baseTexture;
        }

        var pw = Window_Base._faceWidth;
        var ph = Window_Base._faceHeight;
        var sw = Math.min(width, pw);
        var sh = Math.min(height, ph);
        var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        var sx = faceIndex % 4 * pw + (pw - sw) / 2;
        var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;

        if (sx + sw > baseTexture.width || sy + sh > baseTexture.height) {
            console.error(faceName + ' グラフィックの描画領域が画像サイズをはみ出しています');
            return;
        }
        var texture = new PIXI.Texture(baseTexture);
        texture.frame = new PIXI.Rectangle(sx, sy, sw, sh);
        var sprite = new PIXI.Sprite(texture);
        sprite.position.x = dx;
        sprite.position.y = dy;
        sprite.alpha = this.contents.paintOpacity / 255.0;
        this._windowContentsSprite.addChild(sprite);

        //this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    };
}


if (parseInt(parameters['usePixiSpriteToDrawCharacter'])) {
    /**
     * drawCharacter では drawImage が行われるので PIXI.Sprite で代用
     */
    Window_Base.prototype.drawCharacter = function(characterName, characterIndex, x, y) {
        if (! characterName) {
            return;
        }
        var baseTexture = PIXI.utils.BaseTextureCache['character' + characterName];
        if (! baseTexture) {
            var bitmap = ImageManager.loadCharacter(characterName);
            if (! bitmap.isReady()) {
              return;
            }
            baseTexture = new PIXI.BaseTexture(bitmap._image, PIXI.SCALE_MODES.DEFAULT);
            baseTexture.imageUrl = 'character' + characterName;
            PIXI.utils.BaseTextureCache['character' + characterName] = baseTexture;
        }

        var big = ImageManager.isBigCharacter(characterName);
        var pw = baseTexture.width / (big ? 3 : 12);
        var ph = baseTexture.height / (big ? 4 : 8);
        var n = characterIndex;
        var sx = (n % 4 * 3 + 1) * pw;
        var sy = (Math.floor(n / 4) * 4) * ph;

        var texture = new PIXI.Texture(baseTexture);
        texture.frame = new PIXI.Rectangle(sx, sy, pw, ph);
        var sprite = new PIXI.Sprite(texture);
        sprite.position.x = x - pw / 2;
        sprite.position.y = y - ph;
        this.addChild(sprite);

        //this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    };
}


if (parseInt(parameters['usePixiSpriteToDrawIcon']) ||
    parseInt(parameters['usePixiSpriteToDrawFace']) ||
    parseInt(parameters['usePixiSpriteToDrawCharacter'])) {
    /**
     * drawXXX 系を PIXI.Sprite で代用するときに必要なもの
     */
    Bitmap.prototype.setClearHandler = function(onClear) {
        this.onClear = onClear;
    };
    var _Bitmap_clear = Bitmap.prototype.clear;
    Bitmap.prototype.clear = function() {
        _Bitmap_clear.call(this);
        if (this.onClear) {
            this.onClear();
        }
    };
    var _Window_Base_createContents = Window_Base.prototype.createContents;
    Window_Base.prototype.createContents = function() {
        _Window_Base_createContents.call(this);
        this.contents.setClearHandler(this.onClearContents.bind(this));
    };
    Window_Base.prototype.onClearContents = function() {
        // PIXI.Sprite を全部消去
        this._windowContentsSprite.removeChildren();
    };
}


if (parseInt(parameters['skipStatusWindowRefreshInStartMethod'])) {
    /**
     * _statusWindow は作成時に refresh 済み
     */
    Scene_Menu.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        // this._statusWindow.refresh();
    };
}


})(Saba || (Saba = {}));
