var Saba;
(function (Saba) {
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
        SimpleScenario.isNumeric = function (lowerLimit, upperLimit, type) {
            return new NumericValidator(lowerLimit, upperLimit, type);
        };
        SimpleScenario.isNumericParam = function (paramName) {
            return new NumericParamValidator(paramName);
        };
        SimpleScenario.notEmpty = function () {
            return new NotEmptyValidator();
        };
        SimpleScenario.list = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
            return new ListValidator(arg);
        };
        SimpleScenario.isBool = function () {
            return new ListValidator(['true', 'false']);
        };
        SimpleScenario.regCheck = function (reg) {
            return new RegExpValidator(reg);
        };
        SimpleScenario.varCheck = function (reg) {
            return new VarValidator(reg);
        };
        SimpleScenario.varCheck2 = function (str) {
            return new VarValidator2(str);
        };
        SimpleScenario.validates['n1'] = {
            'face': SimpleScenario.isNumeric(0),
            'pose': SimpleScenario.isNumeric(0),
            'hoppe': SimpleScenario.isNumeric(0),
            'position': SimpleScenario.list('right', 'left'),
        };
        SimpleScenario.validates['n2'] = SimpleScenario.validates['n3'] = SimpleScenario.validates['n4'] = SimpleScenario.validates['n5'] = SimpleScenario.validates['n6'] = SimpleScenario.validates['n7'] = SimpleScenario.validates['n8'] = SimpleScenario.validates['n9'] = SimpleScenario.validates['n1'];
        SimpleScenario.validates['m1'] = {
            'index': SimpleScenario.isNumeric(0),
        };
        SimpleScenario.validates['m2'] = SimpleScenario.validates['m3'] = SimpleScenario.validates['m4'] = SimpleScenario.validates['m5'] = SimpleScenario.validates['m6'] = SimpleScenario.validates['m7'] = SimpleScenario.validates['m8'] = SimpleScenario.validates['m9'] = SimpleScenario.validates['m1'];
        SimpleScenario.validates['mob1'] = {
            'name': SimpleScenario.notEmpty()
        };
        SimpleScenario.validates['mob2'] = SimpleScenario.validates['mob3'] = SimpleScenario.validates['mob4'] = SimpleScenario.validates['mob5'] = SimpleScenario.validates['mob6'] = SimpleScenario.validates['mob7'] = SimpleScenario.validates['mob8'] = SimpleScenario.validates['mob9'] = SimpleScenario.validates['mob1'];
        SimpleScenario.validates['cos1'] = {};
        SimpleScenario.validates['cos2'] = SimpleScenario.validates['cos3'] = SimpleScenario.validates['cos4'] = SimpleScenario.validates['cos5'] = SimpleScenario.validates['cos6'] = SimpleScenario.validates['cos7'] = SimpleScenario.validates['cos8'] = SimpleScenario.validates['cos9'] = SimpleScenario.validates['cos1'];
        SimpleScenario.validates['messages'] = {};
        SimpleScenario.validates['normal_messages'] = {};
        SimpleScenario.validates['not_close'] = {
            'flag': SimpleScenario.list('on', 'off')
        };
        SimpleScenario.validates['start'] = {};
        SimpleScenario.validates['hide'] = {};
        SimpleScenario.validates['else'] = {};
        SimpleScenario.validates['return'] = {};
        SimpleScenario.validates['default_pos'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'position': SimpleScenario.list('right', 'left'),
        };
        SimpleScenario.validates['end'] = {};
        SimpleScenario.validates['end_else'] = {};
        SimpleScenario.validates['vehicle'] = {};
        SimpleScenario.validates['choice_end'] = {};
        SimpleScenario.validates['message_h'] = {
            'index': SimpleScenario.isNumeric(0, 7),
            'back': SimpleScenario.isNumeric(0, 2),
            'pos': SimpleScenario.isNumeric(0, 29)
        };
        SimpleScenario.validates['message'] = {
            'value': SimpleScenario.notEmpty()
        };
        SimpleScenario.validates['choice_h'] = {
            'cancel': SimpleScenario.isNumeric(0, 5)
        };
        SimpleScenario.validates['choice_if'] = {
            'index': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1, 4)
            ]
        };
        SimpleScenario.validates['input_num'] = {
            'var': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'num': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1, 8),
            ]
        };
        SimpleScenario.validates['choice_item'] = {
            'var': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ]
        };
        SimpleScenario.validates['map_move'] = {
            'type': SimpleScenario.list('const', 'var'),
            'map': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'x': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0),
                SimpleScenario.varCheck2('type')
            ],
            'y': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0),
                SimpleScenario.varCheck2('type')
            ],
            'direction': SimpleScenario.list('0', '2', '4', '6', '8', 'left', 'right', 'up', 'down'),
            'fade': SimpleScenario.list('0', '1', '2', 'black', 'white', 'none'),
        };
        SimpleScenario.validates['vehicle_pos'] = {
            'vehicle': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0, 2)
            ],
            'type': SimpleScenario.list('const', 'var'),
            'map': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'x': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0),
                SimpleScenario.varCheck2('type')
            ],
            'y': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0),
                SimpleScenario.varCheck2('type')
            ]
        };
        SimpleScenario.validates['event_pos'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(-1)
            ],
            'type': SimpleScenario.list('const', 'var', 'target'),
            'x': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0),
                SimpleScenario.varCheck2('type')
            ],
            'y': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0),
                SimpleScenario.varCheck2('type')
            ],
            'direction': SimpleScenario.list('0', '2', '4', '6', '8', 'left', 'right', 'up', 'down')
        };
        SimpleScenario.validates['scroll_map'] = {
            'direction': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('2', '4', '6', '8', 'left', 'right', 'up', 'down')
            ],
            'num': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0, 100)
            ],
            'speed': [
                SimpleScenario.isNumeric(1, 6)
            ]
        };
        SimpleScenario.validates['scroll_h'] = {
            'speed': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1, 8)
            ],
            'noskip': SimpleScenario.isBool()
        };
        SimpleScenario.validates['scroll'] = {
            'value': SimpleScenario.notEmpty()
        };
        SimpleScenario.validates['if_sw'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'flag': SimpleScenario.list('on', 'off')
        };
        SimpleScenario.validates['if_var'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'value': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[-+]{0,1}(var\.){0,1}\d+$/),
                SimpleScenario.varCheck(/^[-+]{0,1}(var\.){0,1}(\d+)$/)
            ],
            'op': SimpleScenario.list('=', '>=', '<=', '>', '<', '><')
        };
        SimpleScenario.validates['if_self_sw'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('A', 'B', 'C', 'D')
            ],
            'flag': SimpleScenario.list('on', 'off')
        };
        SimpleScenario.validates['if_timer'] = {
            'time': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0, 5999)
            ],
            'op': SimpleScenario.list('>=', '<=')
        };
        SimpleScenario.validates['if_actor'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'type': SimpleScenario.list('party', 'name', 'class', 'skill', 'weapon', 'armor', 'state')
        };
        SimpleScenario.validates['if_enemy'] = {
            'enemy': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'type': SimpleScenario.list('visible', 'state'),
            'value': SimpleScenario.isNumeric(1)
        };
        SimpleScenario.validates['if_character'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(-1)
            ],
            'direction': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('2', '4', '6', '8', 'left', 'right', 'up', 'down')
            ],
        };
        SimpleScenario.validates['if_vehicle'] = {
            'vehicle': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0, 2)
            ]
        };
        SimpleScenario.validates['if_money'] = {
            'money': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0)
            ],
            'op': SimpleScenario.list('>=', '<=', '<')
        };
        SimpleScenario.validates['if_item'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ]
        };
        SimpleScenario.validates['if_weapon'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'equip': SimpleScenario.isBool()
        };
        SimpleScenario.validates['if_armor'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'equip': SimpleScenario.isBool()
        };
        SimpleScenario.validates['if_button'] = {
            'button': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('2', '4', '6', '8', '11', '12', '13', '14', '15', '16', '17', '18', 'down', 'left', 'right', 'up', 'A', 'B', 'C', 'X', 'Y', 'Z', 'L', 'R')
            ]
        };
        SimpleScenario.validates['if_script'] = {
            'script': SimpleScenario.notEmpty()
        };
        SimpleScenario.validates['common'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ]
        };
        SimpleScenario.validates['label'] = {
            'value': SimpleScenario.notEmpty()
        };
        SimpleScenario.validates['label_jump'] = {
            'value': SimpleScenario.notEmpty()
        };
        SimpleScenario.validates['common'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ]
        };
        SimpleScenario.validates['sw'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'end': SimpleScenario.isNumericParam('id'),
            'flag': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('on', 'off')
            ],
        };
        SimpleScenario.validates['var'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'end': SimpleScenario.isNumericParam('id'),
            'op': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('=', '+', '-', '*', '/', '%'),
            ],
            'value': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[-+]{0,1}(var\.){0,1}\d+$/),
            ],
        };
        SimpleScenario.validates['self_sw'] = {
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('A', 'B', 'C', 'D')
            ],
            'flag': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('on', 'off')
            ]
        };
        SimpleScenario.validates['timer'] = {
            'flag': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('on', 'off')
            ],
            'time': SimpleScenario.isNumeric(1, 5999)
        };
        SimpleScenario.validates['save_disable'] = {
            'flag': SimpleScenario.isBool()
        };
        SimpleScenario.validates['menu_disable'] = {
            'flag': SimpleScenario.isBool()
        };
        SimpleScenario.validates['encount_disable'] = {
            'flag': SimpleScenario.isBool()
        };
        SimpleScenario.validates['formation_disable'] = {
            'flag': SimpleScenario.isBool()
        };
        SimpleScenario.validates['transparent'] = {
            'flag': SimpleScenario.isBool()
        };
        SimpleScenario.validates['followers'] = {
            'flag': SimpleScenario.isBool()
        };
        SimpleScenario.validates['gather'] = {};
        SimpleScenario.validates['erace'] = {};
        SimpleScenario.validates['anime'] = {
            'target': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(-1)
            ],
            'anime': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'wait': SimpleScenario.isBool()
        };
        SimpleScenario.validates['route_h'] = {
            'event': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(-1)
            ],
            'repeat': SimpleScenario.isBool(),
            'skip': SimpleScenario.isBool(),
            'wait': SimpleScenario.isBool()
        };
        SimpleScenario.validates['balloon'] = {
            'target': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(-1)
            ],
            'balloon': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'wait': [
                SimpleScenario.isBool()
            ]
        };
        SimpleScenario.validates['tone'] = {
            'red': SimpleScenario.isNumeric(-255, 255),
            'green': SimpleScenario.isNumeric(-255, 255),
            'blue': SimpleScenario.isNumeric(-255, 255),
            'gray': SimpleScenario.isNumeric(0, 255),
            'time': SimpleScenario.isNumeric(1, 600),
            'wait': SimpleScenario.isBool()
        };
        SimpleScenario.validates['flash'] = {
            'red': SimpleScenario.isNumeric(0, 255),
            'green': SimpleScenario.isNumeric(0, 255),
            'blue': SimpleScenario.isNumeric(0, 255),
            'strength': SimpleScenario.isNumeric(0, 255),
            'time': SimpleScenario.isNumeric(1, 600),
            'wait': SimpleScenario.isBool()
        };
        SimpleScenario.validates['shake'] = {
            'strength': SimpleScenario.isNumeric(1, 9),
            'speed': SimpleScenario.isNumeric(1, 9),
            'time': SimpleScenario.isNumeric(1, 600),
            'wait': SimpleScenario.isBool(),
        };
        SimpleScenario.validates['wait'] = {
            'time': SimpleScenario.isNumeric(1, 999)
        };
        SimpleScenario.validates['picture'] = {
            'layer': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1, 100)
            ],
            'file': SimpleScenario.notEmpty(),
            'origin': SimpleScenario.list('ul', 'center'),
            'type': SimpleScenario.list('const', 'var'),
            'x': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(-9999, 9999, 'type'),
                SimpleScenario.varCheck2('type'),
            ],
            'y': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(-9999, 9999, 'type'),
                SimpleScenario.varCheck2('type'),
            ],
            'zoom_x': SimpleScenario.isNumeric(0, 2000),
            'zoom_y': SimpleScenario.isNumeric(0, 2000),
            'transparent': SimpleScenario.isNumeric(0, 255),
            'blend': SimpleScenario.isNumeric(0, 2),
        };
        SimpleScenario.validates['picture_move'] = {
            'layer': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1, 100)
            ],
            'origin': [
                SimpleScenario.list('ul', 'center')
            ],
            'type': [
                SimpleScenario.list('const', 'var')
            ],
            'x': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(-9999, 9999),
                SimpleScenario.varCheck2('type'),
            ],
            'y': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(-9999, 9999),
                SimpleScenario.varCheck2('type'),
            ],
            'zoom_x': SimpleScenario.isNumeric(0, 2000),
            'zoom_y': SimpleScenario.isNumeric(0, 2000),
            'transparent': SimpleScenario.isNumeric(0, 255),
            'blend': SimpleScenario.isNumeric(0, 2),
            'time': SimpleScenario.isNumeric(1, 600),
            'wait': SimpleScenario.isBool()
        };
        SimpleScenario.validates['picture_rotation'] = {
            'layer': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1, 100)
            ],
            'speed': SimpleScenario.isNumeric(-90, 90),
        };
        SimpleScenario.validates['picture_tone'] = {
            'layer': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1, 100)
            ],
            'red': SimpleScenario.isNumeric(-255, 255),
            'green': SimpleScenario.isNumeric(-255, 255),
            'blue': SimpleScenario.isNumeric(-255, 255),
            'gray': SimpleScenario.isNumeric(0, 255),
            'time': SimpleScenario.isNumeric(1, 600),
            'wait': SimpleScenario.isBool(),
        };
        SimpleScenario.validates['picture_erace'] = {
            'layer': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1, 100)
            ],
        };
        SimpleScenario.validates['weather'] = {
            'weather': SimpleScenario.list('none', 'rain', 'storm', 'snow'),
            'strength': SimpleScenario.isNumeric(1, 9),
            'time': SimpleScenario.isNumeric(0, 600),
            'wait': SimpleScenario.isBool(),
        };
        SimpleScenario.validates['bgm'] = {
            'volume': SimpleScenario.isNumeric(0, 100),
            'pitch': SimpleScenario.isNumeric(50, 150),
            'pan': SimpleScenario.isNumeric(-100, 100),
        };
        SimpleScenario.validates['fadeout_bg:'] = {
            'time': SimpleScenario.isNumeric(1, 60)
        };
        SimpleScenario.validates['bgs'] = {
            'volume': SimpleScenario.isNumeric(0, 100),
            'pitch': SimpleScenario.isNumeric(50, 150),
            'pan': SimpleScenario.isNumeric(-100, 100),
        };
        SimpleScenario.validates['fadeout_bg:'] = {
            'time': SimpleScenario.isNumeric(1, 60)
        };
        SimpleScenario.validates['me'] = {
            'volume': SimpleScenario.isNumeric(0, 100),
            'pitch': SimpleScenario.isNumeric(50, 150),
            'pan': SimpleScenario.isNumeric(-100, 100),
        };
        SimpleScenario.validates['se'] = {
            'volume': SimpleScenario.isNumeric(0, 100),
            'pitch': SimpleScenario.isNumeric(50, 150),
            'pan': SimpleScenario.isNumeric(-100, 100),
        };
        SimpleScenario.validates['movie'] = {
            'file': SimpleScenario.notEmpty()
        };
        SimpleScenario.validates['all_recovery'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
                SimpleScenario.varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
            ]
        };
        SimpleScenario.validates['exp'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
                SimpleScenario.varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
            ],
            'value': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[-+]{0,1}(var\.){0,1}\d+$/),
                SimpleScenario.varCheck(/^[-+]{0,1}(var\.){0,1}(\d+)$/)
            ],
            'message': SimpleScenario.isBool()
        };
        SimpleScenario.validates['level'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
                SimpleScenario.varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
            ],
            'value': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[-+]{0,1}(var\.){0,1}\d+$/),
                SimpleScenario.varCheck(/^[-+]{0,1}(var\.){0,1}(\d+)$/)
            ],
            'message': SimpleScenario.isBool()
        };
        SimpleScenario.validates['capability'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
                SimpleScenario.varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
            ],
            'capability': [
                SimpleScenario.notEmpty(),
                SimpleScenario.list('0', '1', '2', '3', '4', '5', '6', '7', 'maxhp', 'maxmp', 'atk', 'def', 'matk', 'mdef', 'agi', 'luk'),
            ],
            'value': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[-+]{0,1}(var\.){0,1}\d+$/),
                SimpleScenario.varCheck(/^[-+]{0,1}(var\.){0,1}(\d+)$/)
            ]
        };
        SimpleScenario.validates['skill'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.regCheck(/^[+]{0,1}(var\.){0,1}\d+$/),
                SimpleScenario.varCheck(/^[+]{0,1}(var\.){0,1}(\d+)$/)
            ],
            'value': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0),
            ]
        };
        SimpleScenario.validates['equip'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1),
            ],
            'part': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0, 4),
            ],
            'id': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(0),
            ]
        };
        SimpleScenario.validates['name'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ],
            'value': SimpleScenario.notEmpty()
        };
        SimpleScenario.validates['class'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1),
            ],
            'value': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1)
            ]
        };
        SimpleScenario.validates['nickname'] = {
            'actor': [
                SimpleScenario.notEmpty(),
                SimpleScenario.isNumeric(1),
            ],
            'value': SimpleScenario.notEmpty()
        };
    })(SimpleScenario = Saba.SimpleScenario || (Saba.SimpleScenario = {}));
})(Saba || (Saba = {}));
