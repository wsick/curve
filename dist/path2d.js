var path2d;
(function (path2d) {
    path2d.version = '0.1.0';
})(path2d || (path2d = {}));
var path2d;
(function (path2d) {
    var proto = CanvasRenderingContext2D.prototype;
    if (typeof proto.drawPath !== "function") {
        proto.drawPath = function (path) {
            this.beginPath();
            for (var i = 0, ops = path.$ops, len = ops.length; i < len; i++) {
                var op = ops[i];
                var name_1 = path2d.PathOpType[op.type];
                var func = CanvasRenderingContext2D.prototype[name_1];
                if (!func)
                    throw new Error("Invalid path operation type. [" + op.type + "]");
                func.apply(this, op.args);
            }
        };
    }
})(path2d || (path2d = {}));
var path2d;
(function (path2d) {
    var proto = CanvasRenderingContext2D.prototype;
    if (!proto.ellipse) {
        proto.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
            this.save();
            this.translate(x, y);
            this.rotate(rotation);
            this.scale(radiusX, radiusY);
            this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
            this.restore();
        };
    }
})(path2d || (path2d = {}));
var path2d;
(function (path2d) {
    var proto = CanvasRenderingContext2D.prototype;
    var _fill = proto.fill;
    proto.fill = function (arg) {
        if (arg instanceof Path2D) {
            this.drawPath(arg);
            _fill.apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else {
            _fill.apply(this, arguments);
        }
    };
    var _stroke = proto.stroke;
    proto.stroke = function (arg) {
        if (arg instanceof Path2D) {
            this.drawPath(arg);
            _stroke.call(this);
        }
        else {
            _stroke.call(this);
        }
    };
    var _clip = proto.clip;
    proto.clip = function (arg) {
        if (arg instanceof Path2D) {
            this.drawPath(arg);
            _clip.apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else {
            _clip.apply(this, arguments);
        }
    };
})(path2d || (path2d = {}));
var path2d;
(function (path2d) {
    (function (PathOpType) {
        PathOpType[PathOpType["closePath"] = 0] = "closePath";
        PathOpType[PathOpType["moveTo"] = 1] = "moveTo";
        PathOpType[PathOpType["lineTo"] = 2] = "lineTo";
        PathOpType[PathOpType["bezierCurveTo"] = 3] = "bezierCurveTo";
        PathOpType[PathOpType["quadraticCurveTo"] = 4] = "quadraticCurveTo";
        PathOpType[PathOpType["arc"] = 5] = "arc";
        PathOpType[PathOpType["arcTo"] = 6] = "arcTo";
        PathOpType[PathOpType["ellipse"] = 7] = "ellipse";
        PathOpType[PathOpType["rect"] = 8] = "rect";
    })(path2d.PathOpType || (path2d.PathOpType = {}));
    var PathOpType = path2d.PathOpType;
    var Path2DEx = (function () {
        function Path2DEx(arg0) {
            if (arg0 instanceof Path2D) {
                this.$ops = JSON.parse(JSON.stringify(this.$ops));
            }
            else if (typeof arg0 === "string") {
                this.$ops = [];
                Path2DEx.parse.call(this, arg0);
            }
            else {
                this.$ops = [];
            }
        }
        Path2DEx.prototype.addPath = function (path, transform) {
        };
        Path2DEx.prototype.closePath = function () {
            this.$ops.push({
                type: PathOpType.closePath,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.moveTo = function (x, y) {
            this.$ops.push({
                type: PathOpType.moveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.lineTo = function (x, y) {
            this.$ops.push({
                type: PathOpType.lineTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            this.$ops.push({
                type: PathOpType.bezierCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
            this.$ops.push({
                type: PathOpType.quadraticCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.$ops.push({
                type: PathOpType.arc,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.arcTo = function (x1, y1, x2, y2, radius) {
            this.$ops.push({
                type: PathOpType.arcTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
            this.$ops.push({
                type: PathOpType.ellipse,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.rect = function (x, y, width, height) {
            this.$ops.push({
                type: PathOpType.rect,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.parse = function (d) {
            throw new Error("Not implemented");
        };
        return Path2DEx;
    })();
    path2d.Path2DEx = Path2DEx;
})(path2d || (path2d = {}));
/// <reference path="Path2DEx" />
(function (global) {
    if (typeof Path2D === "function") {
        global.Path2D.parse = global.path2d.Path2DEx.parse;
    }
    else {
        global.Path2D = global.path2d.Path2DEx;
    }
})(this);
var path2d;
(function (path2d) {
    function parseNumber(tracker) {
        var data = tracker.data;
        var len = data.length;
        if (isNaN(data, tracker.offset)) {
            tracker.offset += 3;
            return NaN;
        }
        var negate = false;
        if (data[tracker.offset] === 0x2D) {
            negate = true;
            tracker.offset++;
        }
        else if (data[tracker.offset] === 0x2B) {
            tracker.offset++;
        }
        if (isInfinity(data, tracker.offset)) {
            tracker.offset += 8;
            return negate ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        }
        var characteristic = parseInteger(tracker);
        var cur = data[tracker.offset];
        var mantissa = 0;
        if (cur === 0x2E) {
            mantissa = parseMantissa(tracker);
        }
        else if (cur !== 0x45 && cur !== 0x65) {
            return negate ? -characteristic : characteristic;
        }
        var significand = parseSignificand(tracker);
        var num = negate ? -characteristic - mantissa : characteristic + mantissa;
        num = num * Math.pow(10, significand);
        return num;
    }
    path2d.parseNumber = parseNumber;
    function isNaN(data, i) {
        return data[i + 0] === 0x4E
            && data[i + 1] === 0x61
            && data[i + 2] === 0x4E;
    }
    function isInfinity(data, i) {
        return data[i + 0] === 0x49
            && data[i + 1] === 0x6E
            && data[i + 2] === 0x66
            && data[i + 3] === 0x69
            && data[i + 4] === 0x6E
            && data[i + 5] === 0x69
            && data[i + 6] === 0x74
            && data[i + 7] === 0x79;
    }
    function parseInteger(tracker) {
        return 0;
    }
    function parseMantissa(tracker) {
        return 0;
    }
    function parseSignificand(tracker) {
        var data = tracker.data;
        if (data[tracker.offset] !== 0x45 && data[tracker.offset] !== 0x65)
            return 0;
        tracker.offset++;
        if (data[tracker.offset] === 0x2D) {
            tracker.offset++;
            return -parseInteger(tracker);
        }
        else {
            return parseInteger(tracker);
        }
    }
})(path2d || (path2d = {}));
/// <reference path="Path2DEx" />
var path2d;
(function (path2d) {
    path2d.Path2DEx.parse = function (d) {
        if (this instanceof Path2D)
            return doParse(this, d);
        return doParse(new path2d.Path2DEx(), d);
    };
    function doParse(path, d) {
        var data = toBuffer(d);
        var i = 0;
        var len = data.length;
        return path;
    }
    function toBuffer(d) {
        if (typeof TextEncoder === "function") {
            return new TextEncoder().encode(d);
        }
    }
})(path2d || (path2d = {}));

//# sourceMappingURL=path2d.js.map