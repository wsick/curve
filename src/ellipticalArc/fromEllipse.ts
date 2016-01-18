namespace curve.ellipticalArc {
    import vec2 = la.vec2;

    export interface IEllipticalArcParameterization {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        fa: number;
        fs: number;
        rx: number;
        ry: number;
        phi: number;
    }

    // [cx, cy] = ellipse center
    // [rx, ry] = radial size
    // sa = starting angle (radians)
    // ea = ending angle (radians)
    // phi = angle (radians) from x-axis of coordinate space to x-axis of ellipse
    export function fromEllipse(cx: number, cy: number, rx: number, ry: number, sa: number, ea: number, phi: number): IEllipticalArcParameterization {
        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        // F.6.4 Conversion from center to endpoint parameterization

        // F.6.4.1
        // Compute a`
        var ap = vec2.rotate(vec2.create(rx * Math.cos(sa), ry * Math.sin(sa)), -phi);
        ap[0] += cx;
        ap[1] += cy;

        // F.6.4.2
        // Compute b`
        var bp = vec2.rotate(vec2.create(rx * Math.cos(ea), ry * Math.sin(ea)), -phi);
        bp[0] += cx;
        bp[1] += cy;

        var da = ea - sa;
        // F.6.4.3
        // Compute fA
        var fa = Math.abs(da) > Math.PI ? 1 : 0;

        // F.6.4.4
        // Compute fS
        var fs = da > 0 ? 1 : 0;

        return {
            x1: ap[0],
            y1: ap[1],
            x2: bp[0],
            y2: bp[1],
            fa: fa,
            fs: fs,
            rx: rx,
            ry: ry,
            phi: phi
        };
    }
}