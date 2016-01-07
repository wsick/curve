declare namespace curve {
    var version: string;
}
interface CanvasRenderingContext2D {
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean): any;
}
declare namespace curve {
}
declare namespace curve {
}
interface TextEncoder {
    encode(str: string): Uint8Array;
    encoding: string;
}
declare var TextEncoder: {
    prototpye: TextEncoder;
    new (): TextEncoder;
};
declare namespace curve.ellipticalArc {
    function generate(path: Path, sx: number, sy: number, rx: number, ry: number, rotationAngle: number, isLargeArcFlag: boolean, sweepDirectionFlag: SweepDirection, ex: number, ey: number): void;
}
declare namespace curve.parse {
    interface IParser {
        parse(path: ISegmentExecutor, data: string | Uint8Array): any;
    }
    var style: ParseStyles;
    function getParser(): IParser;
}
declare namespace curve.parse {
    enum ParseStyles {
        CharMatching = 2,
        Buffer = 1,
    }
}
declare namespace curve.segments {
    interface IArcMetrics {
        inited: boolean;
        sx: number;
        sy: number;
        ex: number;
        ey: number;
        l: number;
        cl: boolean;
        r: number;
        cr: boolean;
        t: number;
        ct: boolean;
        b: number;
        cb: boolean;
    }
    class Arc implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): void;
        init(metrics: IArcMetrics, x: number, y: number, radius: number, sa: number, ea: number, cc: boolean): void;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any): void;
        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[];
        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[];
    }
}
declare namespace curve.segments {
    class LineTo implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): void;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[]): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters): void;
        getStartVector(sx: number, sy: number, args: any[]): number[];
        getEndVector(sx: number, sy: number, args: any[]): number[];
    }
}
declare namespace curve.segments {
    interface IArcToMetrics {
        inited: boolean;
        sx: number;
        sy: number;
        line: {
            args: any[];
        };
        arc: {
            sx: number;
            sy: number;
            args: any[];
            metrics?: IArcMetrics;
        };
    }
    class ArcTo implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): void;
        init(metrics: IArcToMetrics, sx: number, sy: number, args: any[]): void;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any): void;
        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[];
        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[];
    }
}
declare namespace curve.segments {
    class BezierCurveTo implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): void;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[]): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters): void;
        getStartVector(sx: number, sy: number, args: any[]): number[];
        getEndVector(sx: number, sy: number, args: any[]): number[];
    }
}
declare namespace curve.segments {
    class ClosePath implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): void;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[]): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters): void;
        getStartVector(sx: number, sy: number, args: any[]): number[];
        getEndVector(sx: number, sy: number, args: any[]): number[];
    }
}
declare namespace curve.segments {
    class Ellipse implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): void;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any): void;
        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[];
        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[];
    }
}
declare namespace curve.segments {
    class MoveTo implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): void;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[]): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters): void;
        getStartVector(sx: number, sy: number, args: any[]): number[];
        getEndVector(sx: number, sy: number, args: any[]): number[];
    }
}
declare namespace curve.segments {
    class QuadraticCurveTo implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): void;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[]): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters): void;
        getStartVector(sx: number, sy: number, args: any[]): number[];
        getEndVector(sx: number, sy: number, args: any[]): number[];
    }
}
declare namespace curve.segments {
    class Rect implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): void;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any): void;
        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[];
        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[];
    }
}
declare namespace curve.segments {
    interface ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]): any;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any): any;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any): any;
        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[];
        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[];
    }
    var all: any[];
}
declare namespace curve.parse.buffer {
    interface IParseTracker {
        data: Uint8Array;
        offset: number;
    }
}
declare namespace curve.parse.buffer {
    class Parser implements IParser {
        parse(executor: ISegmentExecutor, data: string | Uint8Array): any;
    }
    function parseNumber(tracker: IParseTracker): number;
}
declare namespace curve.parse.matching {
    class Parser implements IParser {
        parse(executor: ISegmentExecutor, data: string | Uint8Array): void;
    }
}
declare namespace curve {
    enum PenLineCap {
        Flat = 0,
        Square = 1,
        Round = 2,
        Triangle = 3,
    }
    enum PenLineJoin {
        Miter = 0,
        Bevel = 1,
        Round = 2,
    }
}
declare namespace curve {
    interface IBoundingBox {
        l: number;
        t: number;
        r: number;
        b: number;
    }
}
interface ISegmentExecutor {
    setFillRule(fillRule: FillRule): any;
    closePath(): any;
    moveTo(x: number, y: number): any;
    lineTo(x: number, y: number): any;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): any;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): any;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): any;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): any;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): any;
    ellipticalArc(rx: number, ry: number, rotation: number, largeArcFlag: number, sweepFlag: SweepDirection, ex: number, ey: number): any;
    rect(x: number, y: number, width: number, height: number): any;
}
interface ISegment {
    (executor: ISegmentExecutor): void;
}
declare enum FillRule {
    EvenOdd = 0,
    NonZero = 1,
}
declare enum SweepDirection {
    Counterclockwise = 0,
    Clockwise = 1,
}
interface CanvasRenderingContext2D extends ISegmentExecutor {
}
declare namespace curve {
    interface IStrokeParameters {
        strokeThickness: number;
        strokeDashArray: number[];
        strokeDashCap: PenLineCap;
        strokeDashOffset: number;
        strokeEndLineCap: PenLineCap;
        strokeLineJoin: PenLineJoin;
        strokeMiterLimit: number;
        strokeStartLineCap: PenLineCap;
    }
}
declare namespace curve {
    class Path implements ISegmentExecutor {
        private $ops;
        constructor();
        constructor(path: Path);
        constructor(d: string);
        exec(executor: ISegmentExecutor): void;
        draw(ctx: CanvasRenderingContext2D): void;
        addPath(path: Path): void;
        setFillRule(fillRule: FillRule): void;
        closePath(): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        ellipticalArc(rx: number, ry: number, rotation: number, largeArcFlag: number, sweepFlag: SweepDirection, ex: number, ey: number): void;
        rect(x: number, y: number, width: number, height: number): void;
        static parse(executor: ISegmentExecutor, data: string): void;
    }
}
