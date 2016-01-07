///<reference path="../../IStrokeParameters.ts"/>

namespace curve.bounds.stroke {
    import vec2 = la.vec2;

    export function extendStartCap(box: IBoundingBox, sx: number, sy: number, metrics: any, pars: IStrokeParameters) {
        //HTML5 doesn't support start *and* end cap individually
        var cap = pars.strokeStartLineCap || pars.strokeEndLineCap || 0;
        var func = cappers[cap] || cappers[PenLineCap.Flat];
        func(box, sx, sy, metrics, pars.strokeThickness);
    }

    interface ICapper {
        (box: IBoundingBox, sx: number, sy: number, metrics: any, thickness: number);
    }
    var cappers: ICapper[] = [];
    cappers[PenLineCap.Round] = function (box: IBoundingBox, sx: number, sy: number, metrics: any, thickness: number) {
        var hs = thickness / 2.0;
        box.l = Math.min(box.l, sx - hs);
        box.r = Math.max(box.r, sx + hs);
        box.t = Math.min(box.t, sy - hs);
        box.b = Math.max(box.b, sy + hs);
    };
    cappers[PenLineCap.Square] = function (box: IBoundingBox, sx: number, sy: number, metrics: any, thickness: number) {
        var sd = vec2.clone(metrics.startVector);
        if (!sd || !sd[0] || !sd[1])
            return;
        vec2.reverse(vec2.normalize(sd));
        var sdo = vec2.orthogonal(vec2.clone(sd));

        var hs = thickness / 2.0;
        var x1 = sx + hs * (sd[0] + sdo[0]);
        var x2 = sx + hs * (sd[0] - sdo[0]);
        var y1 = sy + hs * (sd[1] + sdo[1]);
        var y2 = sy + hs * (sd[1] - sdo[1]);

        box.l = Math.min(box.l, x1, x2);
        box.r = Math.max(box.r, x1, x2);
        box.t = Math.min(box.t, y1, y2);
        box.b = Math.max(box.b, y1, y2);
    };
    cappers[PenLineCap.Flat] = function (box: IBoundingBox, sx: number, sy: number, metrics: any, thickness: number) {
        var sdo = vec2.clone(metrics.startVector);
        if (!sdo || !sdo[0] || !sdo[1])
            return;
        vec2.orthogonal(vec2.normalize(sdo));

        var hs = thickness / 2.0;
        var x1 = sx + hs * sdo[0];
        var x2 = sx + hs * -sdo[0];
        var y1 = sy + hs * sdo[1];
        var y2 = sy + hs * -sdo[1];

        box.l = Math.min(box.l, x1, x2);
        box.r = Math.max(box.r, x1, x2);
        box.t = Math.min(box.t, y1, y2);
        box.b = Math.max(box.b, y1, y2);
    };
}