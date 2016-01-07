/// <reference path="LineTo" />
/// <reference path="Arc" />

namespace curve.bounds.extenders {
    import vec2 = la.vec2;

    export interface IArcToMetrics extends ISegmentMetrics {
        line: {
            args: any[];
            metrics: ISegmentMetrics;
        };
        arc: {
            args: any[];
            metrics: IArcMetrics;
        };
    }

    var _arc = new Arc();
    var _lineTo = new LineTo();

    export class ArcTo implements IBoundsExtender {
        isMove = false;

        init(sx: number, sy: number, args: any[]): IArcToMetrics {
            var x1: number = args[0];
            var y1: number = args[1];
            var x2: number = args[2];
            var y2: number = args[3];
            var radius: number = args[4];

            var v1 = vec2.create(x1 - sx, y1 - sy);
            var v2 = vec2.create(x2 - x1, y2 - y1);
            var inner_theta = Math.PI - vec2.angleBetween(v1, v2);
            //find 2 points tangent to imaginary circle along guide lines
            var a = getTangentPoint(inner_theta, radius, vec2.create(sx, sy), v1, true);
            var b = getTangentPoint(inner_theta, radius, vec2.create(x1, y1), v2, false);

            var line = createLine(sx, sy, a[0], a[1]);
            var arc = createArc(a, v1, b, v2, radius);

            return {
                line: line,
                arc: arc,
                startVector: line.metrics.startVector,
                endVector: arc.metrics.endVector,
                endPoint: arc.metrics.endPoint
            };
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: IArcToMetrics) {
            _lineTo.extendFillBox(box, sx, sy, metrics.line.args, metrics.line.metrics);
            var ep = metrics.line.metrics.endPoint;
            _arc.extendFillBox(box, ep[0], ep[1], metrics.arc.args, metrics.arc.metrics);
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: IArcToMetrics, pars: IStrokeParameters) {
            _lineTo.extendStrokeBox(box, sx, sy, metrics.line.args, metrics.line.metrics, pars);
            var ep = metrics.line.metrics.endPoint;
            _arc.extendStrokeBox(box, ep[0], ep[1], metrics.arc.args, metrics.arc.metrics, pars);
        }
    }

    function createLine(sx: number, sy: number, x: number, y: number) {
        var args = [x, y];
        return {
            args: args,
            metrics: _lineTo.init(sx, sy, args)
        };
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
        var args = [c[0], c[1], radius, sa, ea, cc];

        return {
            args: args,
            metrics: _arc.init(a[0], a[1], args)
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
        var p1 = vec2.orthogonal(vec2.clone(d1));
        var p2 = vec2.orthogonal(vec2.clone(d2));
        return vec2.intersection(s1, p1, s2, p2);
    }
}