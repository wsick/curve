/// <reference path="LineTo" />
/// <reference path="Arc" />

namespace gfx.segments {
    export interface IArcToMetrics {
        inited: boolean;
        sx: number;
        sy: number;
        line: {
            args: any[];
        };
        arc: {
            sx: number;
            sy: number;
            args: any[];
            metrics?: IArcMetrics;
        };
    }

    var _arc = new Arc();
    var _lineTo = new LineTo();

    export class ArcTo implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]) {
            var x1: number = args[0];
            var y1: number = args[1];
            var x2: number = args[2];
            var y2: number = args[3];
            var radius: number = args[4];
            ctx.arcTo(x1, y1, x2, y2, radius);
        }

        init(metrics: IArcToMetrics, sx: number, sy: number, args: any[]) {
            if (metrics.inited || sx !== metrics.sx || sy !== metrics.sy)
                return;
            metrics.sx = sx;
            metrics.sy = sy;

            var x1: number = args[0];
            var y1: number = args[1];
            var x2: number = args[2];
            var y2: number = args[3];
            var radius: number = args[4];

            var v1 = la.vec2.create(x1 - sx, y1 - sy);
            var v2 = la.vec2.create(x2 - x1, y2 - y1);
            var inner_theta = Math.PI - la.vec2.angleBetween(v1, v2);
            //find 2 points tangent to imaginary circle along guide lines
            var a = getTangentPoint(inner_theta, radius, la.vec2.create(sx, sy), v1, true);
            var b = getTangentPoint(inner_theta, radius, la.vec2.create(x1, y1), v2, false);
            metrics.line = {
                args: [a[0], a[1]]
            };

            metrics.arc = createArc(a, v1, b, v2, radius);

            metrics.inited = true;
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any) {
            this.init(metrics, sx, sy, args);

            box.l = Math.min(box.l, sx);
            box.r = Math.max(box.r, sx);
            box.t = Math.min(box.t, sy);
            box.b = Math.max(box.b, sy);

            var mline = metrics.line,
                marc = metrics.arc;
            _lineTo.extendFillBox(box, mline.sx, mline.sy, mline.args);
            _arc.extendFillBox(box, marc.sx, marc.sy, marc.args, marc.metrics);
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any) {
            this.init(metrics, sx, sy, args);

            var hs = pars.strokeThickness / 2;
            box.l = Math.min(box.l, sx - hs);
            box.r = Math.max(box.r, sx + hs);
            box.t = Math.min(box.t, sy - hs);
            box.b = Math.max(box.b, sy + hs);

            var mline = metrics.line,
                marc = metrics.arc;
            _lineTo.extendStrokeBox(box, mline.sx, mline.sy, mline.args, pars);
            _arc.extendStrokeBox(box, marc.sx, marc.sy, marc.args, marc.metrics, pars);
        }

        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[] {
            this.init(metrics, sx, sy, args);
            return _lineTo.getStartVector(sx, sy, metrics.line.args);
        }

        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[] {
            this.init(metrics, sx, sy, args);
            var marc = metrics.arc;
            return _arc.getEndVector(marc.sx, marc.sy, marc.args, marc.metrics);
        }
    }

    function createArc(a: Float32Array, v1: Float32Array, b: Float32Array, v2: Float32Array, radius: number) {
        //find center point
        var c = getPerpendicularIntersections(a, v1, b, v2);
        //counter clockwise test
        var cc = !la.vec2.isClockwiseTo(v1, v2);
        //find starting angle -- [1,0] is origin direction of 0rad
        var sa = Math.atan2(a[1] - c[1], a[0] - c[0]);
        if (sa < 0)
            sa = (2 * Math.PI) + sa;
        var ea = Math.atan2(b[1] - c[1], b[0] - c[0]);
        if (ea < 0)
            ea = (2 * Math.PI) + ea;
        return {
            sx: a[0],
            sy: a[1],
            args: [c[0], c[1], radius, sa, ea, cc],
            metrics: <IArcMetrics>{}
        };
    }

    function getTangentPoint(theta: number, radius: number, s: Float32Array, d: Float32Array, invert: boolean): Float32Array {
        var len = Math.sqrt(d[0] * d[0] + d[1] * d[1]);
        var f = radius / Math.tan(theta / 2);
        var t = f / len;
        if (invert)
            t = 1 - t;
        return la.vec2.create(s[0] + t * d[0], s[1] + t * d[1]);
    }

    function getPerpendicularIntersections(s1: Float32Array, d1: Float32Array, s2: Float32Array, d2: Float32Array): Float32Array {
        var p1 = la.vec2.orthogonal(la.vec2.create(d1[0], d1[2]));
        var p2 = la.vec2.orthogonal(la.vec2.create(d2[0], d2[2]));
        return la.vec2.intersection(s1, p1, s2, p2);
    }
}