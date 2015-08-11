/// <reference path="Path2DEx" />

namespace path2d {
    Path2DEx.parse = function (d: string): Path2D {
        var existing: Path2D;
        if (this instanceof Path2D) {
            existing = this;
        } else {
            existing = new Path2DEx();
        }
        doParse(existing, d);
        return existing;
    };

    function doParse (path: Path2D, d: string) {
        //TODO: Implement
    }
}