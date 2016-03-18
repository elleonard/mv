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


}
