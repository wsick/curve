declare module path2d {
    var version: string;
}
interface CanvasRenderingContext2D {
    drawPath(path: Path2D): any;
}
declare module path2d {
}
interface CanvasRenderingContext2D {
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean): any;
}
declare module path2d {
}
interface CanvasRenderingContext2D {
    fill(path: Path2D, fillRule?: string): void;
    stroke(path: Path2D): void;
    clip(path: Path2D, fillRule?: string): void;
}
declare module path2d {
}
declare module path2d {
    interface IPathOp {
        type: PathOpType;
        args: any[];
    }
    enum PathOpType {
        closePath = 0,
        moveTo = 1,
        lineTo = 2,
        bezierCurveTo = 3,
        quadraticCurveTo = 4,
        arc = 5,
        arcTo = 6,
        ellipse = 7,
        rect = 8,
    }
    class Path2DEx implements Path2D {
        private $ops;
        constructor();
        constructor(path: Path2D);
        constructor(d: string);
        addPath(path: Path2D, transform?: SVGMatrix): void;
        closePath(): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        rect(x: number, y: number, width: number, height: number): void;
        static parse(d: string): Path2D;
    }
}
interface Path2D {
    addPath(path: Path2D, transform?: SVGMatrix): any;
    closePath(): any;
    moveTo(x: number, y: number): any;
    lineTo(x: number, y: number): any;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): any;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): any;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): any;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): any;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): any;
    rect(x: number, y: number, width: number, height: number): any;
}
declare var Path2D: {
    prototype: Path2D;
    new (): Path2D;
    new (path: Path2D): Path2D;
    new (d: string): Path2D;
    parse(d: string): Path2D;
};
declare module path2d {
    function parseNumber(tracker: IParseTracker): number;
}
interface TextEncoder {
    encode(str: string): Uint8Array;
    encoding: string;
}
declare var TextEncoder: {
    prototype: TextEncoder;
    new (): TextEncoder;
};
declare module path2d {
    interface IParseTracker {
        data: Uint8Array;
        offset: number;
    }
}
