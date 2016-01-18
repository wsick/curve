namespace curve.ellipticalArc {
    // [apx, apy] = primed coordinate values from F.6.5.1
    // [rx, ry] = radial size
    export function correctRadii(rx: number, ry: number, apx: number, apy: number): number[] {
        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        // F.6.6 Correction of out-of-range radii

        // F.6.6.1
        // Ensure radii are positive
        rx = Math.abs(rx);
        ry = Math.abs(ry);

        // F.6.6.2
        // Compute lambda
        var lambda = ((apx * apx) / (rx * rx)) + ((apy * apy) / (ry * ry));

        // F.6.6.3
        // Alter small radii
        if (lambda > 1) {
            var rl = Math.sqrt(lambda);
            rx *= rl;
            ry *= rl;
        }

        return [rx, ry];
    }
}