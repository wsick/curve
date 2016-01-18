namespace curve.ellipticalArc {
    import vec2 = la.vec2;
    var PI2 = 2 * Math.PI;

    // NOTES
    // rx, ry, phi are the same between both parameterizations
    // [cx, cy] is computed based on [sx, sy, rx, ry, ex, ey, fa, fs]
    // there are 2 possible solutions for ellipse [cx, cy]
    // each ellipse has 2 possible solutions
    //   these solutions should be chosen based on fa, fs, and [sx,sy]->[ex,ey] relationship
    //   the solutions chosen should have exactly one anti-clockwise true and one anti-clockwise false

    export interface IEllipseParameterization {
        cx: number;
        cy: number;
        rx: number;
        ry: number;
        phi?: number; // rotation (radians)
        sa?: number; // start angle (radians)
        ea?: number; // end angle (radians)
        ac?: boolean; // anti-clockwise
    }

    // [sx, sy] = start point
    // [rx, ry] = radial size
    // phi = angle (radians) from x-axis of coordinate space to x-axis of ellipse
    // fa = large arc flag
    // fs = sweep direction flag
    // [ex, ey] = end point
    export function toEllipse(sx: number, sy: number, rx: number, ry: number, phi: number, fa: number, fs: number, ex: number, ey: number): IEllipseParameterization {
        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        // F.6.5 Conversion from endpoint to center parameterization
        if (rx === 0 || ry === 0) {
            return {cx: ex, cy: ey, rx: rx, ry: ry};
        }

        // F.6.5.1
        // Compute a`
        var ap = vec2.create((sx - ex) / 2.0, (sy - ey) / 2.0);
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
        c[0] += (sx + ex) / 2.0;
        c[1] += (sy + ey) / 2.0;

        // F.6.5.5
        // Compute theta1
        var v = vec2.create(1, 0);
        var u = vec2.create((ap[0] - cp[0]) / rx, (ap[1] - cp[1]) / ry);
        var sa = vec2.angleBetween(v, u) * signAdjust(v, u);
        if (sa < 0) {
            sa += PI2;
        }

        // F.6.5.6
        // Compute delta-theta
        v = vec2.create((-ap[0] - cp[0]) / rx, (-ap[1] - cp[1]) / ry);
        var dt = (vec2.angleBetween(u, v) * signAdjust(u, v)) % PI2;
        // Correct for sweep flag
        if (fs === 0 && dt > 0) {
            dt -= PI2;
        } else if (fs === 1 && dt < 0) {
            dt += PI2;
        }

        // Normalize end angle
        var ea = (sa + dt) % PI2;
        if (ea < 0) {
            ea += PI2;
        }

        var ac = fs === 0;

        return {
            cx: c[0],
            cy: c[1],
            rx: rx,
            ry: ry,
            phi: phi,
            sa: sa,
            ea: ea,
            ac: ac
        };
    }

    function signAdjust(u: Float32Array, v: Float32Array): number {
        return ((u[0] * v[1]) - (u[1] * v[0])) < 0 ? -1 : 1;
    }
}