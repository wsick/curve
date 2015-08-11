/// <reference path="Path2DEx" />

(function (global: any) {
    if (typeof Path2D === "function") {
        global.Path2D.parse = global.Path2DEx.parse;
    } else {
        global.Path2D = global.Path2DEx;
    }
})(this);