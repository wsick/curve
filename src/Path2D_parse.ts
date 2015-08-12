/// <reference path="Path2DEx" />

(function (global: any) {
    if (typeof Path2D === "function") {
        global.Path2D.parse = global.path2d.Path2DEx.parse;
    } else {
        global.Path2D = global.path2d.Path2DEx;
    }
})(this);