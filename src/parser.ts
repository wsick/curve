/// <reference path="Path2DEx" />

namespace path2d {
    Path2DEx.parse = function (d: string): Path2D {
        if (this instanceof Path2D)
            return doParse(this, d);
        return doParse(new Path2DEx(), d);
    };

    export interface IParseTracker {
        data: Uint8Array;
        offset: number;
    }
    function doParse(path: Path2D, d: string): Path2D {
        var data = toBuffer(d);
        var i = 0;
        var len = data.length;

        //TODO: Implement

        return path;
    }

    function toBuffer(d: string): Uint8Array {
        if (typeof TextEncoder === "function") {
            return new TextEncoder().encode(d);
        }
    }
}