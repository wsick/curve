var path2d;
(function (path2d) {
    path2d.version = '0.1.0';
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
    (function (IPathOpType) {
        IPathOpType[IPathOpType["closePath"] = 0] = "closePath";
        IPathOpType[IPathOpType["moveTo"] = 1] = "moveTo";
        IPathOpType[IPathOpType["lineTo"] = 2] = "lineTo";
        IPathOpType[IPathOpType["bezierCurveTo"] = 3] = "bezierCurveTo";
        IPathOpType[IPathOpType["quadraticCurveTo"] = 4] = "quadraticCurveTo";
        IPathOpType[IPathOpType["arc"] = 5] = "arc";
        IPathOpType[IPathOpType["arcTo"] = 6] = "arcTo";
        IPathOpType[IPathOpType["ellipse"] = 7] = "ellipse";
        IPathOpType[IPathOpType["rect"] = 8] = "rect";
    })(path2d.IPathOpType || (path2d.IPathOpType = {}));
    var IPathOpType = path2d.IPathOpType;
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
                type: IPathOpType.closePath,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.moveTo = function (x, y) {
            this.$ops.push({
                type: IPathOpType.moveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.lineTo = function (x, y) {
            this.$ops.push({
                type: IPathOpType.lineTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            this.$ops.push({
                type: IPathOpType.bezierCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
            this.$ops.push({
                type: IPathOpType.quadraticCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.$ops.push({
                type: IPathOpType.arc,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.arcTo = function (x1, y1, x2, y2, radius) {
            this.$ops.push({
                type: IPathOpType.arcTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
            this.$ops.push({
                type: IPathOpType.ellipse,
                args: Array.prototype.slice.call(arguments, 0)
            });
        };
        Path2DEx.prototype.rect = function (x, y, width, height) {
            this.$ops.push({
                type: IPathOpType.rect,
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
        global.Path2D.parse = global.Path2DEx.parse;
    }
    else {
        global.Path2D = global.Path2DEx;
    }
})(this);
/// <reference path="Path2DEx" />
var path2d;
(function (path2d) {
    path2d.Path2DEx.parse = function (d) {
        var existing;
        if (this instanceof Path2D) {
            existing = this;
        }
        else {
            existing = new path2d.Path2DEx();
        }
        doParse(existing, d);
        return existing;
    };
    function doParse(path, d) {
    }
})(path2d || (path2d = {}));

//# sourceMappingURL=path2d.js.map