interface Game_Picture {
    tachieActorId: number;
    tachieRefreshFlag: boolean;
}
interface Game_Temp {
    getActorBitmapCache(actorId: number): Bitmap;
}


module Tachie {


var DEFAULT_PICTURE_ID1: number = 12;
var DEFAULT_PICTURE_ID2: number = 11;
var ACTOR_PREFIX: string = '___actor';



var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
var _Game_Picture_initTarget = Game_Picture.prototype.initTarget;
var _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;



class _Game_Interpreter extends Game_Interpreter {
    pluginCommand(command: string, args: string[]) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Tachie' || command === '立ち絵') {
            var x: number = parseInt(args[2] || '0');
            var y: number = parseInt(args[3] || '0');
            var opacity: number = parseInt(args[4] || '255');
            switch (args[0]) {
            case 'show_left':
                $gameScreen.showPicture(DEFAULT_PICTURE_ID1, ACTOR_PREFIX + args[1], 0, x, y, 100, 100, opacity, 0);
                break;
            case 'show_right':
                $gameScreen.showPicture(DEFAULT_PICTURE_ID2, ACTOR_PREFIX + args[1], 0, x, y, 100, 100, opacity, 0);
                break;
            }
        }
    }
}



class _Game_Picture extends Game_Picture {
    initTarget(): void {
        _Game_Picture_initTarget.call(this);
        this.tachieActorId = this.getTachieActorId();
    }
    protected getTachieActorId(): number {
        var matcher = /^___actor([-+]?\d+)/;
        var result = matcher.exec(this._name);
        if (result && result.length > 1) {
            return parseInt(result[1]) || 0;
        } else {
            return 0;
        }
    }
}


class _Game_Temp extends Game_Temp {
    protected actorBitmapCache: {[actorId: number]: Bitmap};

    getActorBitmapCache(actorId: number): Bitmap {
        this.actorBitmapCache = this.actorBitmapCache || {};
        if (! this.actorBitmapCache[actorId]) {
            this.actorBitmapCache[actorId] = new Bitmap(Graphics.width / 2 + 100, Graphics.height);
        }
        return this.actorBitmapCache[actorId];
    }
}



class _Game_Screen extends Game_Screen {
    showActorPicture(actorId: number, pictureId: number, x: number, y: number) {
        var name = ACTOR_PREFIX + actorId;
        this.showPicture(pictureId, name, 0, x, y, 1, 1, 1, 0);
    }
}



class _Sprite_Picture extends Sprite_Picture {
    updateBitmap(): void {
        _Sprite_Picture_updateBitmap.call(this);
        var picture = this.picture();
        if (picture && picture.tachieRefreshFlag) {
            picture.tachieRefreshFlag = false;
            this.redrawActorImage();
        }
    }
    loadBitmap(): void {
        var picture = this.picture();
        if (picture && picture.tachieActorId !== 0) {
            this.bitmap = $gameTemp.getActorBitmapCache(picture.tachieActorId);
            this.redrawActorImage();
        } else {
            _Sprite_Picture_loadBitmap.call(this);
        }
    }
    protected redrawActorImage(): void {
        var picture = this.picture();
        if (! picture) {
            return;
        }
        var actorId = picture.tachieActorId;
        if (actorId === 0) {
            return;
        }
        this.bitmap.clear();
        var actor = $gameActors.actor(actorId);
        var cache = $gameTemp.getActorBitmapCache(actorId);
        this.drawActorImage(actor, cache);
    }
    drawActorImage(actor: Game_Actor, bitmap: Bitmap): void {
        var img: Bitmap = ImageManager.loadPicture('actor' + actor.actorId());
        if (img.isReady()) {
            bitmap.blt(img, 0, 0, img.width, img.height, 0, 0);
            this.picture().tachieRefreshFlag = false;
        } else {
            this.picture().tachieRefreshFlag = true;
        }
    }
}



var applyMyMethods = (myClass: any, presetClass: any, applyConstructor?: boolean) => {
    for (var p in myClass.prototype) {
        if (myClass.prototype.hasOwnProperty(p)) {
            if (p === 'constructor' && ! applyConstructor) { continue; }
            presetClass.prototype[p] = myClass.prototype[p];
        }
    }
};
applyMyMethods(_Game_Interpreter, Game_Interpreter);
applyMyMethods(_Sprite_Picture, Sprite_Picture);
applyMyMethods(_Game_Screen, Game_Screen);
applyMyMethods(_Game_Picture, Game_Picture);
applyMyMethods(_Game_Temp, Game_Temp);

}
