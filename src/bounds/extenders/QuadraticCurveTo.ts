namespace curve.bounds.extenders {
    import vec2 = la.vec2;

    export class QuadraticCurveTo implements IBoundsExtender {
        isMove = false;

        init(sx: number, sy: number, args: any[]): ISegmentMetrics {
            var cpx: number = args[0];
            var cpy: number = args[1];
            var x: number = args[2];
            var y: number = args[3];

            return {
                endPoint: vec2.create(x, y),
                startVector: vec2.create(2 * (cpx - sx), 2 * (cpy - sy)),   // [F(0)'x, F(0)'y]
                endVector: vec2.create(2 * (x - cpx), 2 * (y - cpy))        // [F(1)'x, F(1)'y]
            };
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics) {
            var cpx: number = args[0];
            var cpy: number = args[1];
            var x: number = args[2];
            var y: number = args[3];

            var m = getMaxima(sx, cpx, x, sy, cpy, y);
            if (m.x != null) {
                box.l = Math.min(box.l, m.x);
                box.r = Math.max(box.r, m.x);
            }
            if (m.y != null) {
                box.t = Math.min(box.t, m.y);
                box.b = Math.max(box.b, m.y);
            }

            box.l = Math.min(box.l, x);
            box.r = Math.max(box.r, x);
            box.t = Math.min(box.t, y);
            box.b = Math.max(box.b, y);
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters) {
            var cpx: number = args[0];
            var cpy: number = args[1];
            var x: number = args[2];
            var y: number = args[3];
            var hs = pars.strokeThickness / 2.0;

            var m = getMaxima(sx, cpx, x, sy, cpy, y);
            if (m.x) {
                box.l = Math.min(box.l, m.x - hs);
                box.r = Math.max(box.r, m.x + hs);
            }
            if (m.y) {
                box.t = Math.min(box.t, m.y - hs);
                box.b = Math.max(box.b, m.y + hs);
            }

            box.l = Math.min(box.l, x);
            box.r = Math.max(box.r, x);
            box.t = Math.min(box.t, y);
            box.b = Math.max(box.b, y);
        }
    }

    //http://pomax.nihongoresources.com/pages/bezier/
    /* Quadratic Bezier curve is defined by parametric curve:
     *  F(t)x = s.x(1-t)^2 + cp.x(1-t)t + e.x(t^2)
     *  F(t)x = s.y(1-t)^2 + cp.y(1-t)t + e.y(t^2)
     * where
     *  s = start point
     *  cp = control point
     *  e = end point
     *
     * We find the coordinates (2) where F(t)x/dt = 0, F(t)y/dt = 0
     * (within the constraints of the curve (0 <= t <= 1)
     * These points will expand the bounding box
     */

    interface IMaxima {
        x: number;
        y: number;
    }
    function getMaxima(x1: number, x2: number, x3: number, y1: number, y2: number, y3: number): IMaxima {
        return {
            x: cod(x1, x2, x3),
            y: cod(y1, y2, y3)
        };
    }

    function cod(a: number, b: number, c: number): number {
        var t = (a - b) / (a - 2 * b + c);
        if (t < 0 || t > 1)
            return null;
        return (a * Math.pow(1 - t, 2)) + (2 * b * (1 - t) * t) + (c * Math.pow(t, 2));
    }
}