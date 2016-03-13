var SimpleScenario;
(function (SimpleScenario) {
    SimpleScenario.validates = {};
    var NumericValidator = (function () {
        function NumericValidator(_lowerLimit, _upperLimit, _type) {
            this._lowerLimit = _lowerLimit;
            this._upperLimit = _upperLimit;
            this._type = _type;
        }
        NumericValidator.prototype.validate = function (context, paramName, value) {
            if (this._type && context.headerStr[this._type] === 'const') {
                return;
            }
            if (value === undefined) {
                return;
            }
            var num = parseInt(value);
            if (isNaN(num)) {
                context.error("param: " + paramName + " \u306E\u578B\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u5FC5\u8981\u306A\u3082\u306E: number\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
                return;
            }
            if (this._lowerLimit > num) {
                context.error("param: " + paramName + " \u306E\u5024\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u6700\u4F4E\u5024: " + this._lowerLimit + "\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
            }
            if (this._upperLimit == null) {
                return;
            }
            if (this._upperLimit < num) {
                context.error("param: " + paramName + " \u306E\u5024\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u6700\u5927\u5024: " + this._upperLimit + "\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
            }
        };
        NumericValidator.prototype.priority = function () {
            return 10;
        };
        return NumericValidator;
    }());
    SimpleScenario.NumericValidator = NumericValidator;
    var NotEmptyValidator = (function () {
        function NotEmptyValidator() {
        }
        NotEmptyValidator.prototype.validate = function (context, paramName, value) {
            if (value == null) {
                context.error("param: " + paramName + " \u306F\u5FC5\u9808\u3067\u3059\u3002");
            }
        };
        NotEmptyValidator.prototype.priority = function () {
            return 20;
        };
        return NotEmptyValidator;
    }());
    SimpleScenario.NotEmptyValidator = NotEmptyValidator;
    var NumericParamValidator = (function () {
        function NumericParamValidator(_target) {
            this._target = _target;
        }
        NumericParamValidator.prototype.validate = function (context, paramName, value) {
            if (value === undefined) {
                return;
            }
            var num = parseInt(value);
            if (isNaN(num)) {
                context.error("param: " + paramName + " \u306E\u578B\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u5FC5\u8981\u306A\u3082\u306E: number\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
                return;
            }
            var target = context.headerInt(this._target);
            if (target > num) {
                context.error("param: " + paramName + " \u306E\u5024\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u6700\u4F4E\u5024: " + this._target + "\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
            }
        };
        NumericParamValidator.prototype.priority = function () {
            return 0;
        };
        return NumericParamValidator;
    }());
    SimpleScenario.NumericParamValidator = NumericParamValidator;
    var ListValidator = (function () {
        function ListValidator(_target) {
            this._target = _target;
        }
        ListValidator.prototype.validate = function (context, paramName, value) {
            if (value === undefined) {
                return;
            }
            if (this._target.indexOf(value) === -1) {
                context.error("param: " + paramName + " \u306E\u5024\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u5FC5\u8981\u5024: " + JSON.stringify(this._target) + "\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
            }
        };
        ListValidator.prototype.priority = function () {
            return 5;
        };
        return ListValidator;
    }());
    SimpleScenario.ListValidator = ListValidator;
    var RegExpValidator = (function () {
        function RegExpValidator(_target) {
            this._target = _target;
        }
        RegExpValidator.prototype.validate = function (context, paramName, value) {
            if (value === undefined) {
                return;
            }
            if (!this._target.exec(value)) {
                context.error("param: " + paramName + " \u306E\u5024\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
            }
        };
        RegExpValidator.prototype.priority = function () {
            return 5;
        };
        return RegExpValidator;
    }());
    SimpleScenario.RegExpValidator = RegExpValidator;
    var VarValidator = (function () {
        function VarValidator(_target) {
            this._target = _target;
        }
        VarValidator.prototype.validate = function (context, paramName, value) {
            if (value === undefined) {
                return;
            }
            var ret = this._target.exec(value);
            if (!ret) {
                context.error("param: " + paramName + " \u306E\u5024\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
            }
            var vId = parseInt(ret[2]);
            if (vId < 1) {
                context.error("param: " + paramName + " \u306E\u5024\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u6700\u4F4E\u5024: " + 1 + "\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + vId);
            }
        };
        VarValidator.prototype.priority = function () {
            return 5;
        };
        return VarValidator;
    }());
    SimpleScenario.VarValidator = VarValidator;
    var VarValidator2 = (function () {
        function VarValidator2(_type) {
            this._type = _type;
        }
        VarValidator2.prototype.validate = function (context, paramName, value) {
            if (value === undefined) {
                return;
            }
            if (this._type && context.headerStr[this._type] === 'var') {
                return;
            }
            var num = parseInt(value);
            if (isNaN(num)) {
                context.error("param: " + paramName + " \u306E\u578B\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u5FC5\u8981\u306A\u3082\u306E: number\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
                return;
            }
            var lowerLimit = 0;
            if (lowerLimit > num) {
                context.error("param: " + paramName + " \u306E\u5024\u304C\u305F\u3060\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u6700\u4F4E\u5024: " + lowerLimit + "\u3002\u8A2D\u5B9A\u3055\u308C\u305F\u3082\u306E: " + value);
            }
        };
        VarValidator2.prototype.priority = function () {
            return 5;
        };
        return VarValidator2;
    }());
    SimpleScenario.VarValidator2 = VarValidator2;
    var isNumeric = function (lowerLimit, upperLimit, type) {
        return new NumericValidator(lowerLimit, upperLimit, type);
    };
    var isNumericParam = function (paramName) {
        return new NumericParamValidator(paramName);
    };
    var notEmpty = function () {
        return new NotEmptyValidator();
    };
    var list = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i - 0] = arguments[_i];
        }
        return new ListValidator(arg);
    };
    var isBool = function () {
        return new ListValidator(['true', 'false']);
    };
    var regCheck = function (reg) {
        return new RegExpValidator(reg);
    };
    var varCheck = function (reg) {
        return new VarValidator(reg);
    };
    var varCheck2 = function (str) {
        return new VarValidator2(str);
    };
    SimpleScenario.validates['n1'] = {
        'face': isNumeric(0),
        'pose': isNumeric(0),
        'hoppe': isNumeric(0),
        'position': list('right', 'left'),
    };
    SimpleScenario.validates['n2'] = SimpleScenario.validates['n3'] = SimpleScenario.validates['n4'] = SimpleScenario.validates['n5'] = SimpleScenario.validates['n6'] = SimpleScenario.validates['n7'] = SimpleScenario.validates['n8'] = SimpleScenario.validates['n9'] = SimpleScenario.validates['n1'];
    SimpleScenario.validates['cos1'] = {};
    SimpleScenario.validates['cos2'] = SimpleScenario.validates['cos3'] = SimpleScenario.validates['cos4'] = SimpleScenario.validates['cos5'] = SimpleScenario.validates['cos6'] = SimpleScenario.validates['cos7'] = SimpleScenario.validates['cos8'] = SimpleScenario.validates['cos9'] = SimpleScenario.validates['cos1'];
    SimpleScenario.validates['messages'] = {};
    SimpleScenario.validates['not_close'] = {
        'flag': list('on', 'off')
    };
    SimpleScenario.validates['start'] = {};
    SimpleScenario.validates['hide'] = {};
    SimpleScenario.validates['return'] = {};
    SimpleScenario.validates['default_pos'] = {
        'actor': [
            notEmpty(),
            isNumeric(1)
        ],
        'position': list('right', 'left'),
    };
    SimpleScenario.validates['end'] = {};
    SimpleScenario.validates['vehicle'] = {};
    SimpleScenario.validates['choice_end'] = {};
    SimpleScenario.validates['message_h'] = {
        'index': isNumeric(0, 7),
        'back': isNumeric(0, 2),
        'pos': isNumeric(0, 29)
    };
    SimpleScenario.validates['message'] = {
        'value': notEmpty()
    };
    SimpleScenario.validates['choice_h'] = {
        'cancel': isNumeric(0, 5)
    };
    SimpleScenario.validates['choice_if'] = {
        'index': [
            notEmpty(),
            isNumeric(1, 4)
        ]
    };
    SimpleScenario.validates['input_num'] = {
        'var': [
            notEmpty(),
            isNumeric(1)
        ],
        'num': [
            notEmpty(),
            isNumeric(1, 8),
        ]
    };
    SimpleScenario.validates['choice_item'] = {
        'var': [
            notEmpty(),
            isNumeric(1)
        ]
    };
    SimpleScenario.validates['map_move'] = {
        'type': list('const', 'var'),
        'map': [
            notEmpty(),
            isNumeric(1)
        ],
        'x': [
            notEmpty(),
            isNumeric(0),
            varCheck2('type')
        ],
        'y': [
            notEmpty(),
            isNumeric(0),
            varCheck2('type')
        ],
        'direction': list('0', '2', '4', '6', '8', 'left', 'right', 'up', 'down'),
        'fade': list('0', '1', '2', 'black', 'white', 'none'),
    };
    SimpleScenario.validates['vehicle_pos'] = {
        'vehicle': [
            notEmpty(),
            isNumeric(0, 2)
        ],
        'type': list('const', 'var'),
        'map': [
            notEmpty(),
            isNumeric(1)
        ],
        'x': [
            notEmpty(),
            isNumeric(0),
            varCheck2('type')
        ],
        'y': [
            notEmpty(),
            isNumeric(0),
            varCheck2('type')
        ]
    };
    SimpleScenario.validates['event_pos'] = {
        'id': [
            notEmpty(),
            isNumeric(-1)
        ],
        'type': list('const', 'var', 'target'),
        'x': [
            notEmpty(),
            isNumeric(0),
            varCheck2('type')
        ],
        'y': [
            notEmpty(),
            isNumeric(0),
            varCheck2('type')
        ],
        'direction': list('0', '2', '4', '6', '8', 'left', 'right', 'up', 'down')
    };
    SimpleScenario.validates['scroll_map'] = {
        'direction': [
            notEmpty(),
            list('2', '4', '6', '8', 'left', 'right', 'up', 'down')
        ],
        'num': [
            notEmpty(),
            isNumeric(0, 100)
        ],
        'speed': [
            isNumeric(1, 6)
        ]
    };
    SimpleScenario.validates['scroll_h'] = {
        'speed': [
            notEmpty(),
            isNumeric(1, 8)
        ],
        'noskip': isBool()
    };
    SimpleScenario.validates['scroll'] = {
        'value': notEmpty()
    };
    SimpleScenario.validates['common'] = {
        'id': [
            notEmpty(),
            isNumeric(1)
        ]
    };
    SimpleScenario.validates['sw'] = {
        'id': [
            notEmpty(),
            isNumeric(1)
        ],
        'end': isNumericParam('id'),
        'flag': [
            notEmpty(),
            list('on', 'off')
        ],
    };
    SimpleScenario.validates['var'] = {
        'id': [
            notEmpty(),
            isNumeric(1)
        ],
        'end': isNumericParam('id'),
        'op': [
            notEmpty(),
            list('eq', '+', '-', '*', '/', '%'),
        ],
        'value': [
            notEmpty(),
            regCheck(/^[-+]{0,1}(var\.){0,1}\d+$/),
        ],
    };
    SimpleScenario.validates['self_sw'] = {
        'id': [
            notEmpty(),
            list('A', 'B', 'C', 'D')
        ],
        'flag': [
            notEmpty(),
            list('on', 'off')
        ]
    };
    SimpleScenario.validates['timer'] = {
        'flag': [
            notEmpty(),
            list('on', 'off')
        ],
        'time': isNumeric(1, 5999)
    };
    SimpleScenario.validates['save_disable'] = {
        'flag': isBool()
    };
    SimpleScenario.validates['menu_disable'] = {
        'flag': isBool()
    };
    SimpleScenario.validates['encount_disable'] = {
        'flag': isBool()
    };
    SimpleScenario.validates['formation_disable'] = {
        'flag': isBool()
    };
    SimpleScenario.validates['transparent'] = {
        'flag': isBool()
    };
    SimpleScenario.validates['followers'] = {
        'flag': isBool()
    };
    SimpleScenario.validates['gather'] = {};
    SimpleScenario.validates['erace'] = {};
    SimpleScenario.validates['anime'] = {
        'target': [
            notEmpty(),
            isNumeric(-1)
        ],
        'anime': [
            notEmpty(),
            isNumeric(1)
        ],
        'wait': isBool()
    };
    SimpleScenario.validates['route_h'] = {
        'event': [
            notEmpty(),
            isNumeric(-1)
        ],
        'repeat': isBool(),
        'skip': isBool(),
        'wait': isBool()
    };
    SimpleScenario.validates['balloon'] = {
        'target': [
            notEmpty(),
            isNumeric(-1)
        ],
        'balloon': [
            notEmpty(),
            isNumeric(1)
        ],
        'wait': [
            isBool()
        ]
    };
    SimpleScenario.validates['tone'] = {
        'red': isNumeric(-255, 255),
        'green': isNumeric(-255, 255),
        'blue': isNumeric(-255, 255),
        'gray': isNumeric(0, 255),
        'time': isNumeric(1, 600),
        'wait': isBool()
    };
    SimpleScenario.validates['flash'] = {
        'red': isNumeric(0, 255),
        'green': isNumeric(0, 255),
        'blue': isNumeric(0, 255),
        'strength': isNumeric(0, 255),
        'time': isNumeric(1, 600),
        'wait': isBool()
    };
    SimpleScenario.validates['shake'] = {
        'strength': isNumeric(1, 9),
        'speed': isNumeric(1, 9),
        'time': isNumeric(1, 600),
        'wait': isBool(),
    };
    SimpleScenario.validates['wait'] = {
        'time': isNumeric(1, 999)
    };
    SimpleScenario.validates['picture'] = {
        'layer': [
            notEmpty(),
            isNumeric(1, 100)
        ],
        'file': notEmpty(),
        'origin': list('ul', 'center'),
        'type': list('const', 'var'),
        'x': [
            notEmpty(),
            isNumeric(-9999, 9999, 'type'),
            varCheck2('type'),
        ],
        'y': [
            notEmpty(),
            isNumeric(-9999, 9999, 'type'),
            varCheck2('type'),
        ],
        'zoom_x': isNumeric(0, 2000),
        'zoom_y': isNumeric(0, 2000),
        'transparent': isNumeric(0, 255),
        'blend': isNumeric(0, 2),
    };
    SimpleScenario.validates['picture_move'] = {
        'layer': [
            notEmpty(),
            isNumeric(1, 100)
        ],
        'origin': [
            list('ul', 'center')
        ],
        'type': [
            list('const', 'var')
        ],
        'x': [
            notEmpty(),
            isNumeric(-9999, 9999),
            varCheck2('type'),
        ],
        'y': [
            notEmpty(),
            isNumeric(-9999, 9999),
            varCheck2('type'),
        ],
        'zoom_x': isNumeric(0, 2000),
        'zoom_y': isNumeric(0, 2000),
        'transparent': isNumeric(0, 255),
        'blend': isNumeric(0, 2),
        'time': isNumeric(1, 600),
        'wait': isBool()
    };
    SimpleScenario.validates['picture_rotation'] = {
        'layer': [
            notEmpty(),
            isNumeric(1, 100)
        ],
        'speed': isNumeric(-90, 90),
    };
    SimpleScenario.validates['picture_tone'] = {
        'layer': [
            notEmpty(),
            isNumeric(1, 100)
        ],
        'red': isNumeric(-255, 255),
        'green': isNumeric(-255, 255),
        'blue': isNumeric(-255, 255),
        'gray': isNumeric(0, 255),
        'time': isNumeric(1, 600),
        'wait': isBool(),
    };
    SimpleScenario.validates['picture_erace'] = {
        'layer': [
            notEmpty(),
            isNumeric(1, 100)
        ],
    };
    SimpleScenario.validates['weather'] = {
        'weather': list('none', 'rain', 'storm', 'snow'),
        'strength': isNumeric(1, 9),
        'time': isNumeric(0, 600),
        'wait': isBool(),
    };
    SimpleScenario.validates['bgm'] = {
        'volume': isNumeric(0, 100),
        'pitch': isNumeric(50, 150),
        'pan': isNumeric(-100, 100),
    };
    SimpleScenario.validates['fadeout_bg:'] = {
        'time': isNumeric(1, 60)
    };
    SimpleScenario.validates['bgs'] = {
        'volume': isNumeric(0, 100),
        'pitch': isNumeric(50, 150),
        'pan': isNumeric(-100, 100),
    };
    SimpleScenario.validates['fadeout_bg:'] = {
        'time': isNumeric(1, 60)
    };
    SimpleScenario.validates['me'] = {
        'volume': isNumeric(0, 100),
        'pitch': isNumeric(50, 150),
        'pan': isNumeric(-100, 100),
    };
    SimpleScenario.validates['se'] = {
        'volume': isNumeric(0, 100),
        'pitch': isNumeric(50, 150),
        'pan': isNumeric(-100, 100),
    };
    SimpleScenario.validates['movie'] = {
        'file': notEmpty()
    };
    SimpleScenario.validates['all_recovery'] = {
        'actor': [
            notEmpty(),
            regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
            varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
        ]
    };
    SimpleScenario.validates['exp'] = {
        'actor': [
            notEmpty(),
            regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
            varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
        ],
        'value': [
            notEmpty(),
            regCheck(/^[-+]{0,1}(var\.){0,1}\d+$/),
            varCheck(/^[-+]{0,1}(var\.){0,1}(\d+)$/)
        ],
        'message': isBool()
    };
    SimpleScenario.validates['level'] = {
        'actor': [
            notEmpty(),
            regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
            varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
        ],
        'value': [
            notEmpty(),
            regCheck(/^[-+]{0,1}(var\.){0,1}\d+$/),
            varCheck(/^[-+]{0,1}(var\.){0,1}(\d+)$/)
        ],
        'message': isBool()
    };
    SimpleScenario.validates['capability'] = {
        'actor': [
            notEmpty(),
            regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
            varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
        ],
        'capability': [
            notEmpty(),
            list('0', '1', '2', '3', '4', '5', '6', '7', 'maxhp', 'maxmp', 'atk', 'def', 'matk', 'mdef', 'agi', 'luk'),
        ],
        'value': [
            notEmpty(),
            regCheck(/^[-+]{0,1}(var\.){0,1}\d+$/),
            varCheck(/^[-+]{0,1}(var\.){0,1}(\d+)$/)
        ]
    };
    SimpleScenario.validates['skill'] = {
        'actor': [
            notEmpty(),
            regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
            varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
        ],
        'value': [
            notEmpty(),
            isNumeric(0),
        ]
    };
    SimpleScenario.validates['equip'] = {
        'actor': [
            notEmpty(),
            isNumeric(1),
        ],
        'part': [
            notEmpty(),
            isNumeric(0, 4),
        ],
        'id': [
            notEmpty(),
            isNumeric(0),
        ]
    };
    SimpleScenario.validates['name'] = {
        'actor': [
            notEmpty(),
            isNumeric(1)
        ],
        'value': notEmpty()
    };
    SimpleScenario.validates['class'] = {
        'actor': [
            notEmpty(),
            isNumeric(1),
        ],
        'value': [
            notEmpty(),
            isNumeric(1)
        ]
    };
    SimpleScenario.validates['nickname'] = {
        'actor': [
            notEmpty(),
            isNumeric(1),
        ],
        'value': notEmpty()
    };
})(SimpleScenario || (SimpleScenario = {}));
