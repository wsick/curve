/*

// Convert an SVG elliptical arc to a series of canvas commands.
//
// x1, x2: start and stop coordinates of the ellipse.
// rx, ry: radii of the ellipse.
// phi: rotation of the ellipse.
// fA: large arc flag.
// fS: sweep flag.
function ellipseFromEllipticalArc(x1, rx, ry, phi, fA, fS, x2) {
    // Convert from endpoint to center parametrization, as detailed in:
    //   http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
    if (rx == 0 || ry == 0) {
        ops.push({type: 'lineTo', args: x2});
        return;
    }
    var phi = phi * (Math.PI / 180.0);
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    var xPrime = rotClockwise(midPoint(x1, x2), phi);                // F.6.5.1
    var xPrime2 = pointMul(xPrime, xPrime);
    var rx2 = Math.pow(rx, 2);
    var ry2 = Math.pow(ry, 2);

    var lambda = Math.sqrt(xPrime2[0] / rx2 + xPrime2[1] / ry2);
    if (lambda > 1) {
        rx *= lambda;
        ry *= lambda;
        rx2 = Math.pow(rx, 2);
        ry2 = Math.pow(ry, 2);
    }

    var factor = Math.sqrt((rx2 * ry2 - rx2 * xPrime2[1] - ry2 * xPrime2[0]) /
        (rx2 * xPrime2[1] + ry2 * xPrime2[0]));
    if (fA === fS) {
        factor *= -1.0;
    }
    var cPrime = scale(factor, [rx * xPrime[1] / ry, -ry * xPrime[0] / rx]); // F.6.5.2
    var c = sum(rotCounterClockwise(cPrime, phi), meanVec(x1, x2));  // F.6.5.3
    var x1UnitVector = [(xPrime[0] - cPrime[0]) / rx, (xPrime[1] - cPrime[1]) / ry];
    var x2UnitVector = [(-1.0 * xPrime[0] - cPrime[0]) / rx, (-1.0 * xPrime[1] - cPrime[1]) / ry];
    var theta = angle([1, 0], x1UnitVector);                         // F.6.5.5
    var deltaTheta = angle(x1UnitVector, x2UnitVector);              // F.6.5.6
    var start = theta;
    var end = theta + deltaTheta;
    ops.push(
        {type: 'save', args: []},
        {type: 'translate', args: [c[0], c[1]]},
        {type: 'rotate', args: [phi]},
        {type: 'scale', args: [rx, ry]},
        {type: 'arc', args: [0, 0, 1, start, end, 1 - fS]},
        {type: 'restore', args: []}
    );
}
*/