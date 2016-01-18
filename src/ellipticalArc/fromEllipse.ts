namespace curve.ellipticalArc {
    import vec2 = la.vec2;

    // NOTES
    // rx, ry, phi are the same between both parameterizations
    // [cx, cy]/[rx, ry] defines the ellipse
    // there are 2 possible solutions that are "picked" through anti-clockwise flag
    // if anticlockwise, the arc becomes the complementary arc
    //      (large arc sweeping clockwise becomes small arc sweeping counterclockwise)
    // [sx, sy] defines the starting point as characterized by the starting angle
    // [ex, ey] defines the ending point as characterized by the ending angle

    export interface IEllipticalArcParameterization {
        sx: number;
        sy: number;
        ex: number;
        ey: number;
        fa: number;
        fs: number;
        rx: number;
        ry: number;
        phi: number;
    }

    // [cx, cy] = ellipse center
    // [rx, ry] = radial size
    // sa = starting angle (radians - clockwise from x-axis)
    // ea = ending angle (radians - clockwise from x-axis)
    // phi = angle (radians) from x-axis of coordinate space to x-axis of ellipse
    // ac = anti-clockwise
    export function fromEllipse(cx: number, cy: number, rx: number, ry: number, phi: number, sa: number, ea: number, ac: boolean): IEllipticalArcParameterization {
        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        // F.6.4 Conversion from center to endpoint parameterization

        // anti-clockwise inverts fA & fS (not mentioned in specification)

        // F.6.4.1
        // Compute a`
        var ap = vec2.rotate(vec2.create(rx * Math.cos(sa), ry * Math.sin(sa)), phi);
        ap[0] += cx;
        ap[1] += cy;

        // F.6.4.2
        // Compute b`
        var bp = vec2.rotate(vec2.create(rx * Math.cos(ea), ry * Math.sin(ea)), phi);
        bp[0] += cx;
        bp[1] += cy;

        var da = ea - sa;
        // F.6.4.3
        // Compute fA
        var fa = Math.abs(da) > Math.PI ? 1 : 0;
        var expac = Math.abs(sa - ea) ? ea < sa : sa > ea;
        fa = (expac !== ac) ? 1 : 0;

        // F.6.4.4
        // Compute fS
        var fs = ac === true ? 0 : 1;

        return {
            sx: ap[0],
            sy: ap[1],
            ex: bp[0],
            ey: bp[1],
            fa: fa,
            fs: fs,
            rx: rx,
            ry: ry,
            phi: phi
        };
    }
}