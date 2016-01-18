namespace curve.ellipticalArc {
    import vec2 = la.vec2;
    var PI2 = 2 * Math.PI;

    export interface IEllipseParameterization {
        x: number;
        y: number;
        rx: number;
        ry: number;
        phi?: number; // rotation (radians)
        sa?: number; // start angle (radians)
        ea?: number; // end angle (radians)
        ac?: boolean; // anti-clockwise
    }

    // [x1, y1] = start point
    // [x2, y2] = end point
    // fa = large arc flag
    // fs = sweep direction flag
    // [rx, ry] = radial size
    // phi = angle (radians) from x-axis of coordinate space to x-axis of ellipse
    export function toEllipse(x1: number, y1: number, x2: number, y2: number, fa: number, fs: number, rx: number, ry: number, phi: number): IEllipseParameterization {
        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        // F.6.5 Conversion from endpoint to center parameterization
        if (rx === 0 || ry === 0) {
            return {x: x2, y: y2, rx: rx, ry: ry};
        }

        // F.6.5.1
        // Compute a`
        var ap = vec2.midpoint(vec2.create(x1, y1), vec2.create(x2, y2));
        vec2.rotate(ap, -phi);

        // Correct radii
        [rx, ry] = correctRadii(rx, ry, ap[0], ap[1]);

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

        return {
            x: c[0],
            y: c[1],
            rx: rx,
            ry: ry,
            phi: phi,
            sa: sa,
            ea: sa + dt,
            ac: (1 - fs) === 1
        };
    }
}