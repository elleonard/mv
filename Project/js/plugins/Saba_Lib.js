var Saba;
(function (Saba) {
    Saba.applyMyMethods = function (myClass, presetClass, applyConstructor) {
        for (var p in myClass.prototype) {
            if (myClass.prototype.hasOwnProperty(p)) {
                if (p === 'constructor' && !applyConstructor) {
                    continue;
                }
                Object.defineProperty(presetClass.prototype, p, Object.getOwnPropertyDescriptor(myClass.prototype, p));
            }
        }
    };
    Saba.toIntArray = function (list) {
        var ret = [];
        for (var i = 0; i < list.length; i++) {
            ret[i] = parseInt(list[i]);
        }
        return ret;
    };
    Saba.toIntArrayByStr = function (str, minLength) {
        if (minLength === void 0) { minLength = 0; }
        var ret = [];
        for (var i = 0; i < minLength; i++) {
            ret[i] = 0;
        }
        if (!str) {
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
    Saba.parseIntValue = function (value, defaultValue) {
        var intNum = parseInt(value);
        if (isNaN(intNum)) {
            return defaultValue;
        }
        else {
            return intNum;
        }
    };
})(Saba || (Saba = {}));
