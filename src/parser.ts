/// <reference path="Path2DEx" />

namespace path2d {
    Path2DEx.parse = function (d: string): Path2D {
        if (this instanceof Path2D)
            return doParse(this, d);
        return doParse(new Path2DEx(), d);
    };

    function doParse (path: Path2D, d: string): Path2D {
        //TODO: Implement

        return path;
    }
}