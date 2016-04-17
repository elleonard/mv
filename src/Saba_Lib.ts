module Saba {

export var applyMyMethods = (myClass: any, presetClass: any, applyConstructor?: boolean) => {
    for (var p in myClass.prototype) {
        if (myClass.prototype.hasOwnProperty(p)) {
            if (p === 'constructor' && ! applyConstructor) { continue; }
            Object.defineProperty(presetClass.prototype, p, Object.getOwnPropertyDescriptor(myClass.prototype,p));
            //presetClass.prototype[p] = myClass.prototype[p];
        }
    }
};

export var toIntArray = (list: Array<string>): Array<number> => {
    var ret: Array<number> = [];
    for (var i = 0; i < list.length; i++) {
        ret[i] = parseInt(list[i]);
    }
    return ret;
};

export var toIntArrayByStr = (str: string, minLength: number = 0): Array<number> => {
    var ret: Array<number> = [];
    for (var i = 0; i < minLength; i++) {
        ret[i] = 0;
    }
    if (! str) {
        return ret;
    }
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
        ret[i] = parseInt(list[i]);
        if (isNaN(ret[i])) {
            ret[i] = 0;
        }
    }
    return ret;
};

export var parseIntValue = (value: string, defaultValue: number): number => {
    const intNum = parseInt(value);
    if (isNaN(intNum)) {
        return defaultValue;
    } else {
        return intNum;
    }
};


}
