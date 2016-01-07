///<reference path="../../IStrokeParameters.ts"/>

namespace curve.bounds.stroke {
    import vec2 = la.vec2;

    export function extendEndCap(box: IBoundingBox, metrics: any, pars: IStrokeParameters) {
        //HTML5 doesn't support start *and* end cap individually
        var cap = pars.strokeStartLineCap || pars.strokeEndLineCap || 0;
        var func = cappers[cap] || cappers[PenLineCap.Flat];
        func(box, metrics, pars.strokeThickness);
    }

    interface ICapper {
        (box: IBoundingBox, metrics: any, thickness: number);
    }
    var cappers: ICapper[] = [];
    cappers[PenLineCap.Round] = function (box: IBoundingBox, metrics: any, thickness: number) {
        var [ex, ey] = metrics.endPoint;
        var hs = thickness / 2.0;
        box.l = Math.min(box.l, ex - hs);
        box.r = Math.max(box.r, ex + hs);
        box.t = Math.min(box.t, ey - hs);
        box.b = Math.max(box.b, ey + hs);
    };
    cappers[PenLineCap.Square] = function (box: IBoundingBox, metrics: any, thickness: number) {
        var ed = vec2.clone(metrics.endVector);
        if (!ed || !ed[0] || !ed[1])
            return;
        vec2.normalize(ed);
        var edo = vec2.orthogonal(vec2.clone(ed));

        var [ex, ey] = metrics.endPoint;
        var hs = thickness / 2.0;

        var x1 = ex + hs * (ed[0] + edo[0]);
        var x2 = ex + hs * (ed[0] - edo[0]);
        var y1 = ey + hs * (ed[1] + edo[1]);
        var y2 = ey + hs * (ed[1] - edo[1]);

        box.l = Math.min(box.l, x1, x2);
        box.r = Math.max(box.r, x1, x2);
        box.t = Math.min(box.t, y1, y2);
        box.b = Math.max(box.b, y1, y2);
    };
    cappers[PenLineCap.Flat] = function (box: IBoundingBox, metrics: any, thickness: number) {
        var edo = vec2.clone(metrics.endVector);
        if (!edo || !edo[0] || !edo[1])
            return;
        vec2.orthogonal(vec2.normalize(edo));

        var [ex, ey] = metrics.endPoint;
        var hs = thickness / 2.0;

        var x1 = ex + hs * edo[0];
        var x2 = ex + hs * -edo[0];
        var y1 = ey + hs * edo[1];
        var y2 = ey + hs * -edo[1];

        box.l = Math.min(box.l, x1, x2);
        box.r = Math.max(box.r, x1, x2);
        box.t = Math.min(box.t, y1, y2);
        box.b = Math.max(box.b, y1, y2);
    };
}