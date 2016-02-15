namespace demo.utils {
    export function pointOnLine(p0: Float32Array, p1: Float32Array, t: number): Float32Array {
        var x0 = p0[0],
            y0 = p0[1],
            x1 = p1[0],
            y1 = p1[1];
        return la.vec2.create(
            x0 + (t * (x1 - x0)),
            y0 + (t * (y1 - y0))
        );
    }
}