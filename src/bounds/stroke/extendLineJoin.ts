namespace curve.bounds.stroke {
    import vec2 = la.vec2;
    import ISegmentMetrics = curve.bounds.extenders.ISegmentMetrics;

    export function extendLineJoin(box: IBoundingBox, sx: number, sy: number, metrics: ISegmentMetrics, lastMetrics: ISegmentMetrics, pars: IStrokeParameters) {
        var hs = pars.strokeThickness / 2.0;
        if (pars.strokeLineJoin === PenLineJoin.Round) {
            box.l = Math.min(box.l, sx - hs);
            box.r = Math.max(box.r, sx + hs);
            box.t = Math.min(box.t, sy - hs);
            box.b = Math.max(box.b, sy + hs);
            return;
        }
        var tips = (pars.strokeLineJoin === PenLineJoin.Miter)
            ? findMiterTips(sx, sy, metrics, lastMetrics, hs, pars.strokeMiterLimit)
            : findBevelTips(sx, sy, metrics, lastMetrics, hs);
        if (!tips)
            return;
        var x1 = tips[0][0],
            y1 = tips[0][1],
            x2 = tips[1][0],
            y2 = tips[1][1];
        box.l = Math.min(box.l, x1, x2);
        box.r = Math.max(box.r, x1, x2);
        box.t = Math.min(box.t, y1, y2);
        box.b = Math.max(box.b, y1, y2);
    }

    function findMiterTips(sx: number, sy: number, metrics: ISegmentMetrics, lastMetrics: ISegmentMetrics, hs: number, miterLimit: number): Float32Array[] {
        var av = vec2.clone(lastMetrics.endVector);
        var bv = vec2.clone(metrics.startVector);
        if (!av || !bv)
            return null;
        vec2.reverse(av);
        var tau = vec2.angleBetween(av, bv) / 2;
        if (isNaN(tau))
            return null;

        var miterRatio = 1 / Math.sin(tau);
        if (miterRatio > miterLimit)
            return findBevelTips(sx, sy, metrics, lastMetrics, hs);

        //vector in direction of join point to miter tip
        var cv = vec2.isClockwiseTo(av, bv) ? vec2.clone(av) : vec2.clone(bv);
        vec2.normalize(vec2.reverse(vec2.rotate(cv, tau)));

        //distance from join point and miter tip
        var miterLen = hs * miterRatio;

        var tip = vec2.create(sx + miterLen * cv[0], sy + miterLen * cv[1]);
        return [tip, tip];
    }

    function findBevelTips(sx: number, sy: number, metrics: ISegmentMetrics, lastMetrics: ISegmentMetrics, hs: number): Float32Array[] {
        var av = vec2.clone(lastMetrics.endVector);
        var bv = vec2.clone(metrics.startVector);
        if (!av || !bv)
            return;
        vec2.normalize(vec2.reverse(av));
        vec2.normalize(bv);

        var avo = vec2.clone(av),
            bvo = vec2.clone(bv);
        if (vec2.isClockwiseTo(av, bv)) {
            avo = vec2.orthogonal(av);
            bvo = vec2.reverse(vec2.orthogonal(bv));
        } else {
            avo = vec2.reverse(vec2.orthogonal(av));
            bvo = vec2.orthogonal(bv);
        }

        return [
            vec2.create(sx - hs * avo[0], sy - hs * avo[1]),
            vec2.create(sx - hs * bvo[0], sy - hs * bvo[1])
        ];
    }
}