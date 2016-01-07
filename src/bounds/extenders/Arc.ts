namespace curve.bounds.extenders {
    import vec2 = la.vec2;

    export interface IArcMetrics extends ISegmentMetrics {
        sx: number;
        sy: number;
        l: number;
        cl: boolean;
        r: number;
        cr: boolean;
        t: number;
        ct: boolean;
        b: number;
        cb: boolean;
    }

    export class Arc implements IBoundsExtender {
        isMove = false;

        init(sx: number, sy: number, args: any[]): IArcMetrics {
            var x = args[0];
            var y = args[1];
            var radius = args[2];
            var sa = args[3];
            var ea = args[4];
            var cc = args[5];

            sx = x + (radius * Math.cos(sa));
            sy = y + (radius * Math.sin(sa));
            var ex = x + (radius * Math.cos(ea));
            var ey = y + (radius * Math.sin(ea));

            var l = x - radius;
            var cl = arcContainsPoint(sx, sy, ex, ey, l, y, cc);

            var r = x + radius;
            var cr = arcContainsPoint(sx, sy, ex, ey, r, y, cc);

            var t = y - radius;
            var ct = arcContainsPoint(sx, sy, ex, ey, x, t, cc);

            var b = y + radius;
            var cb = arcContainsPoint(sx, sy, ex, ey, x, b, cc);

            return {
                sx: sx,
                sy: sy,
                l: l,
                cl: cl,
                r: r,
                cr: cr,
                t: t,
                ct: ct,
                b: b,
                cb: cb,
                endPoint: vec2.create(ex, ey),
                startVector: getStartVector(x, y, cc, sx, sy),
                endVector: getEndVector(x, y, cc, ex, ey)
            };
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: IArcMetrics) {
            var sa = args[3];
            var ea = args[4];
            if (ea === sa)
                return;

            var ep = metrics.endPoint,
                ex = ep[0],
                ey = ep[1];
            box.l = Math.min(box.l, sx, ex);
            box.r = Math.max(box.r, sx, ex);
            box.t = Math.min(box.t, sy, ey);
            box.b = Math.max(box.b, sy, ey);

            if (metrics.cl)
                box.l = Math.min(box.l, metrics.l);
            if (metrics.cr)
                box.r = Math.max(box.r, metrics.r);
            if (metrics.ct)
                box.t = Math.min(box.t, metrics.t);
            if (metrics.cb)
                box.b = Math.max(box.b, metrics.b);
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: IArcMetrics, pars: IStrokeParameters) {
            var sa = args[3];
            var ea = args[4];
            if (ea === sa)
                return;

            var ep = metrics.endPoint,
                ex = ep[0],
                ey = ep[1];
            box.l = Math.min(box.l, sx, ex);
            box.r = Math.max(box.r, sx, ex);
            box.t = Math.min(box.t, sy, ey);
            box.b = Math.max(box.b, sy, ey);

            var hs = pars.strokeThickness / 2.0;
            if (metrics.cl)
                box.l = Math.min(box.l, metrics.l - hs);
            if (metrics.cr)
                box.r = Math.max(box.r, metrics.r + hs);
            if (metrics.ct)
                box.t = Math.min(box.t, metrics.t - hs);
            if (metrics.cb)
                box.b = Math.max(box.b, metrics.b + hs);

            var cap = pars.strokeStartLineCap || pars.strokeEndLineCap || 0; //HTML5 doesn't support start and end cap
            var sv = vec2.reverse(vec2.clone(metrics.startVector));
            var ss = getCapSpread(sx, sy, pars.strokeThickness, cap, sv);
            var es = getCapSpread(ex, ey, pars.strokeThickness, cap, metrics.endVector);

            box.l = Math.min(box.l, ss.x1, ss.x2, es.x1, es.x2);
            box.r = Math.max(box.r, ss.x1, ss.x2, es.x1, es.x2);
            box.t = Math.min(box.t, ss.y1, ss.y2, es.y1, es.y2);
            box.b = Math.max(box.b, ss.y1, ss.y2, es.y1, es.y2);
        }
    }

    function getStartVector(x: number, y: number, cc: number, sx: number, sy: number): Float32Array {
        var rx = sx - x,
            ry = sy - y;
        if (cc)
            return vec2.create(ry, -rx);
        return vec2.create(-ry, rx);
    }

    function getEndVector(x: number, y: number, cc: number, ex: number, ey: number): Float32Array {
        var rx = ex - x,
            ry = ey - y;
        if (cc)
            return vec2.create(ry, -rx);
        return vec2.create(-ry, rx);
    }

    function arcContainsPoint(sx: number, sy: number, ex: number, ey: number, cpx: number, cpy: number, cc: boolean): boolean {
        // var a = ex - sx;
        // var b = cpx - sx;
        // var c = ey - sy;
        // var d = cpy - sy;
        // det = ad - bc;
        var n = (ex - sx) * (cpy - sy) - (cpx - sx) * (ey - sy);
        if (n === 0)
            return true;
        if (n > 0 && cc)
            return true;
        if (n < 0 && !cc)
            return true;
        return false;
    }

    function getCapSpread(x: number, y: number, thickness: number, cap: PenLineCap, vector: Float32Array) {
        var hs = thickness / 2.0;
        switch (cap) {
            case PenLineCap.Round:
                return {
                    x1: x - hs,
                    x2: x + hs,
                    y1: y - hs,
                    y2: y + hs
                };
                break;
            case PenLineCap.Square:
                var ed = vec2.normalize(vec2.clone(vector));
                var edo = vec2.orthogonal(vec2.clone(ed));
                return {
                    x1: x + hs * (ed[0] + edo[0]),
                    x2: x + hs * (ed[0] - edo[0]),
                    y1: y + hs * (ed[1] + edo[1]),
                    y2: y + hs * (ed[1] - edo[1])
                };
                break;
            case PenLineCap.Flat:
            default:
                var edo = vec2.orthogonal(vec2.normalize(vec2.clone(vector)));
                return {
                    x1: x + hs * edo[0],
                    x2: x + hs * -edo[0],
                    y1: y + hs * edo[1],
                    y2: y + hs * -edo[1]
                };
                break;
        }
    }
}