class Path2DEx implements Path2D {
    constructor();
    constructor(path: Path2D);
    constructor(d: string);
    constructor(arg0?: string|Path2D) {
        if (arg0 instanceof <any>Path2D) {
            //TODO: copyTo(<any>arg0, this);
        } else if (typeof arg0 === "string") {
            Path2DEx.parse.call(this, arg0);
        } else {
            //TODO: Initialize
        }
    }

    addPath(path: Path2D, transform?: SVGMatrix) {

    }

    closePath() {

    }

    moveTo(x: number, y: number) {

    }

    lineTo(x: number, y: number) {

    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {

    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {

    }

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {

    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {

    }

    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {

    }

    rect(x: number, y: number, width: number, height: number) {

    }

    static parse(d: string): Path2D {
        throw new Error("Not implemented");
    }
}