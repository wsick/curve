var Path2DEx = (function () {
    function Path2DEx(arg0) {
        if (arg0 instanceof Path2D) {
        }
        else if (typeof arg0 === "string") {
            Path2DEx.parse.call(this, arg0);
        }
        else {
        }
    }
    Path2DEx.prototype.addPath = function (path, transform) {
    };
    Path2DEx.prototype.closePath = function () {
    };
    Path2DEx.prototype.moveTo = function (x, y) {
    };
    Path2DEx.prototype.lineTo = function (x, y) {
    };
    Path2DEx.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
    };
    Path2DEx.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
    };
    Path2DEx.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
    };
    Path2DEx.prototype.arcTo = function (x1, y1, x2, y2, radius) {
    };
    Path2DEx.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
    };
    Path2DEx.prototype.rect = function (x, y, width, height) {
    };
    Path2DEx.parse = function (d) {
        throw new Error("Not implemented");
    };
    return Path2DEx;
})();
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
(function (ex) {
    var _this = this;
    ex.parse = function (d) {
        var existing;
        if (_this instanceof Path2D) {
            existing = _this;
        }
        else {
            existing = new ex();
        }
        doParse(existing, d);
        return existing;
    };
    function doParse(path, d) {
    }
})(Path2DEx);

//# sourceMappingURL=Path2D.js.map