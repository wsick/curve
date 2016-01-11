namespace curve.ellipticalArc {
    import vec2 = la.vec2;
    var PI2 = 2 * Math.PI;

    // [x1, y1] = start point
    // [x2, y2] = end point
    // fa = large arc flag
    // fs = sweep direction flag
    // [rx, ry] = radial size
    // phi = angle (radians) from x-axis of coordinate space to x-axis of ellipse
    export function genEllipse(runner: ISegmentRunner, x1: number, y1: number, x2: number, y2: number, fa: number, fs: number, rx: number, ry: number, phi: number) {
        // Convert from endpoint to center parametrization, as detailed in:
        //   http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        if (rx === 0 || ry === 0) {
            runner.lineTo(x2, y2);
            return;
        }

        // F.6.5.1
        // Compute a`
        var ap = vec2.midpoint(vec2.create(x1, y1), vec2.create(x2, y2));
        vec2.rotate(ap, -phi);

        // F.6.5.2
        // Compute c`
        var rx2 = rx * rx;
        var ry2 = ry * ry;
        var apx2 = ap[0] * ap[0];
        var apy2 = ap[1] * ap[1];
        var factor = Math.sqrt(((rx2 * ry2) - (rx2 * apy2) - (ry2 * apx2)) / ((rx2 * apy2) + (ry2 * apx2)));
        if (fa === fs) {
            factor *= -1;
        }
        var cp = vec2.create(rx * ap[1] / ry, -ry * ap[0] / rx);
        cp[0] *= factor;
        cp[1] *= factor;

        // F.6.5.3
        // Compute c
        var c = vec2.rotate(vec2.clone(cp), phi);
        c[0] += (x1 + x2) / 2.0;
        c[1] += (y1 + y2) / 2.0;

        // F.6.5.5
        // Compute theta1
        var u = vec2.create((ap[0] - cp[0]) / rx, (ap[1] - cp[1]) / ry);
        var v = vec2.create((-ap[0] - cp[0]) / rx, (-ap[1] - cp[1]) / ry);
        var sa = vec2.angleBetween(vec2.create(1, 0), u);

        // F.6.5.6
        // Compute delta-theta
        var dt = vec2.angleBetween(u, v) % PI2;
        // Correct for sweep flag
        if (fs === 0 && dt > 0) {
            dt -= PI2;
        } else if (fs === 1 && dt < 0) {
            dt += PI2;
        }

        runner.ellipse(c[0], c[1], rx, ry, phi, sa, sa + dt, (1 - fs) === 1);
    }
}