namespace curve.bounds.extenders {
    import vec2 = la.vec2;

    export interface IEllipseMetrics extends ISegmentMetrics {
        util: la.IEllipse;
    }

    export class Ellipse implements IBoundsExtender {
        isMove = false;

        init(sx: number, sy: number, args: any[]): IEllipseMetrics {
            var cx = args[0];
            var cy = args[1];
            var rx = args[2];
            var ry = args[3];
            var phi = args[4];
            var sa = args[5];
            var ea = args[6];
            var ac = args[7];

            var util = la.ellipse(cx, cy, rx, ry, phi);

            var ep = util.point(ea);
            var sv = util.tangent(sa);
            var ev = util.tangent(ea);
            if (ac == true) {
                vec2.reverse(sv);
                vec2.reverse(ev);
            }

            return {
                util: util,
                startVector: sv,
                endVector: ev,
                endPoint: ep
            };
        }

        extendFillBox(box: curve.bounds.IBoundingBox, sx: number, sy: number, args: any[], metrics: IEllipseMetrics) {
            var sa = args[5];
            var ea = args[6];
            var ac = args[7];
            var util = metrics.util;

            for (var i = 0, ext = util.extrema(sa, ea, ac); i < ext.length; i++) {
                let p = ext[i];
                if (!p)
                    continue;
                let x = p[0];
                let y = p[1];
                box.l = Math.min(box.l, x);
                box.r = Math.max(box.r, x);
                box.t = Math.min(box.t, y);
                box.b = Math.max(box.b, y);
            }
        }

        extendStrokeBox(box: curve.bounds.IBoundingBox, sx: number, sy: number, args: any[], metrics: IEllipseMetrics, pars: curve.IStrokeParameters) {
            var sa = args[5];
            var ea = args[6];
            var ac = args[7];
            var util = metrics.util;
            var hs = pars.strokeThickness / 2.0;

            var [vp1, vp2, hp1, hp2] = util.extrema(sa, ea, ac);

            if (vp1) {
                box.l = Math.min(box.l, vp1[0] - hs);
                box.r = Math.max(box.r, vp1[0] + hs);
            }
            if (vp2) {
                box.l = Math.min(box.l, vp2[0] - hs);
                box.r = Math.max(box.r, vp2[0] + hs);
            }

            if (hp1) {
                box.t = Math.min(box.t, hp1[1] - hs);
                box.b = Math.max(box.b, hp1[1] + hs);
            }
            if (hp2) {
                box.t = Math.min(box.t, hp2[1] - hs);
                box.b = Math.max(box.b, hp2[1] + hs);
            }
        }
    }
}
