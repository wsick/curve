namespace curve.segments {
    export interface IArcMetrics {
        inited: boolean;
        sx: number;
        sy: number;
        ex: number;
        ey: number;
        l: number;
        cl: boolean;
        r: number;
        cr: boolean;
        t: number;
        ct: boolean;
        b: number;
        cb: boolean;
    }

    export class Arc implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]) {
            var x = args[0];
            var y = args[1];
            var radius = args[2];
            var sa = args[3];
            var ea = args[4];
            var cc = args[5];
            ctx.arc(x, y, radius, sa, ea, cc);
        }

        init(metrics: IArcMetrics, x: number, y: number, radius: number, sa: number, ea: number, cc: boolean) {
            if (metrics.inited)
                return;

            var sx = metrics.sx = x + (radius * Math.cos(sa));
            var sy = metrics.sy = y + (radius * Math.sin(sa));
            var ex = metrics.ex = x + (radius * Math.cos(ea));
            var ey = metrics.ey = y + (radius * Math.sin(ea));

            var l = metrics.l = x - radius;
            metrics.cl = arcContainsPoint(sx, sy, ex, ey, l, y, cc);

            var r = metrics.r = x + radius;
            metrics.cr = arcContainsPoint(sx, sy, ex, ey, r, y, cc);

            var t = metrics.t = y - radius;
            metrics.ct = arcContainsPoint(sx, sy, ex, ey, x, t, cc);

            var b = metrics.b = y + radius;
            metrics.cb = arcContainsPoint(sx, sy, ex, ey, x, b, cc);

            metrics.inited = true;
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any) {
            var x = args[0];
            var y = args[1];
            var radius = args[2];
            var sa = args[3];
            var ea = args[4];
            var cc = args[5];

            if (ea === sa)
                return;

            this.init(metrics, x, y, radius, sa, ea, cc);

            box.l = Math.min(box.l, sx, metrics.ex);
            box.r = Math.max(box.r, sx, metrics.ex);
            box.t = Math.min(box.t, sy, metrics.ey);
            box.b = Math.max(box.b, sy, metrics.ey);

            if (metrics.cl)
                box.l = Math.min(box.l, metrics.l);
            if (metrics.cr)
                box.r = Math.max(box.r, metrics.r);
            if (metrics.ct)
                box.t = Math.min(box.t, metrics.t);
            if (metrics.cb)
                box.b = Math.max(box.b, metrics.b);
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any) {
            var x = args[0];
            var y = args[1];
            var radius = args[2];
            var sa = args[3];
            var ea = args[4];
            var cc = args[5];

            if (ea === sa)
                return;
            this.init(metrics, x, y, radius, sa, ea, cc);

            box.l = Math.min(box.l, sx, metrics.ex);
            box.r = Math.max(box.r, sx, metrics.ex);
            box.t = Math.min(box.t, sy, metrics.ey);
            box.b = Math.max(box.b, sy, metrics.ey);

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
            var sv = this.getStartVector(metrics.sx, metrics.sy, args, metrics);
            sv[0] = -sv[0];
            sv[1] = -sv[1];
            var ss = getCapSpread(sx, sy, pars.strokeThickness, cap, sv);
            var ev = this.getEndVector(metrics.sx, metrics.sy, args, metrics);
            var es = getCapSpread(metrics.ex, metrics.ey, pars.strokeThickness, cap, ev);

            box.l = Math.min(box.l, ss.x1, ss.x2, es.x1, es.x2);
            box.r = Math.max(box.r, ss.x1, ss.x2, es.x1, es.x2);
            box.t = Math.min(box.t, ss.y1, ss.y2, es.y1, es.y2);
            box.b = Math.max(box.b, ss.y1, ss.y2, es.y1, es.y2);
        }

        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[] {
            var x = args[0];
            var y = args[1];
            var radius = args[2];
            var sa = args[3];
            var ea = args[4];
            var cc = args[5];
            this.init(metrics, x, y, radius, sa, ea, cc);

            var rv = [
                sx - x,
                sy - y
            ];
            if (cc)
                return [rv[1], -rv[0]];
            return [-rv[1], rv[0]];
        }

        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[] {
            var x = args[0];
            var y = args[1];
            var radius = args[2];
            var sa = args[3];
            var ea = args[4];
            var cc = args[5];
            this.init(metrics, x, y, radius, sa, ea, cc);

            var rv = [
                metrics.ex - x,
                metrics.ey - y
            ];
            if (cc)
                return [rv[1], -rv[0]];
            return [-rv[1], rv[0]];
        }
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

    function getCapSpread(x: number, y: number, thickness: number, cap: PenLineCap, vector: number[]) {
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
                var ed = normalizeVector(vector);
                var edo = perpendicularVector(ed);
                return {
                    x1: x + hs * (ed[0] + edo[0]),
                    x2: x + hs * (ed[0] - edo[0]),
                    y1: y + hs * (ed[1] + edo[1]),
                    y2: y + hs * (ed[1] - edo[1])
                };
                break;
            case PenLineCap.Flat:
            default:
                var ed = normalizeVector(vector);
                var edo = perpendicularVector(ed);
                return {
                    x1: x + hs * edo[0],
                    x2: x + hs * -edo[0],
                    y1: y + hs * edo[1],
                    y2: y + hs * -edo[1]
                };
                break;
        }
    }

    function normalizeVector(v: number[]): number[] {
        var len = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return [
            v[0] / len,
            v[1] / len
        ];
    }

    function perpendicularVector(v: number[]): number[] {
        return [
            -v[1],
            v[0]
        ];
    }
}