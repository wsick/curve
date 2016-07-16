declare namespace curve {
    var version: string;
}
declare namespace curve.bounds.extenders {
    interface IArcMetrics extends ISegmentMetrics {
        sx: number;
        sy: number;
        l: number;
        cl: boolean;
        r: number;
        cr: boolean;
        t: number;
        ct: boolean;
        b: number;
        cb: boolean;
    }
    class Arc implements IBoundsExtender {
        isMove: boolean;
        init(sx: number, sy: number, args: any[]): IArcMetrics;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: IArcMetrics): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: IArcMetrics, pars: IStrokeParameters): void;
    }
}
declare namespace curve.bounds.extenders {
    class LineTo implements IBoundsExtender {
        isMove: boolean;
        init(sx: number, sy: number, args: any[]): ISegmentMetrics;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters): void;
    }
}
declare namespace curve.bounds.extenders {
    interface IArcToMetrics extends ISegmentMetrics {
        line: {
            args: any[];
            metrics: ISegmentMetrics;
        };
        arc: {
            args: any[];
            metrics: IArcMetrics;
        };
    }
    class ArcTo implements IBoundsExtender {
        isMove: boolean;
        init(sx: number, sy: number, args: any[]): IArcToMetrics;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: IArcToMetrics): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: IArcToMetrics, pars: IStrokeParameters): void;
    }
}
declare namespace curve.bounds.extenders {
    class BezierCurveTo implements IBoundsExtender {
        isMove: boolean;
        init(sx: number, sy: number, args: any[]): ISegmentMetrics;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters): void;
    }
}
declare namespace curve.bounds.extenders {
    class ClosePath implements IBoundsExtender {
        isMove: boolean;
        init(): ISegmentMetrics;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters): void;
    }
}
declare namespace curve.bounds.extenders {
    interface IEllipseMetrics extends ISegmentMetrics {
        util: la.IEllipse;
    }
    class Ellipse implements IBoundsExtender {
        isMove: boolean;
        init(sx: number, sy: number, args: any[]): IEllipseMetrics;
        extendFillBox(box: curve.bounds.IBoundingBox, sx: number, sy: number, args: any[], metrics: IEllipseMetrics): void;
        extendStrokeBox(box: curve.bounds.IBoundingBox, sx: number, sy: number, args: any[], metrics: IEllipseMetrics, pars: curve.IStrokeParameters): void;
    }
}
declare namespace curve.bounds.extenders {
    interface IBoundsExtender {
        isMove: boolean;
        init(sx: number, sy: number, args: any[]): ISegmentMetrics;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics): any;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters): any;
    }
}
declare namespace curve.bounds.extenders {
    interface ISegmentMetrics {
        endPoint: Float32Array;
        startVector: Float32Array;
        endVector: Float32Array;
    }
}
declare namespace curve.bounds.extenders {
    class MoveTo implements IBoundsExtender {
        isMove: boolean;
        init(sx: number, sy: number, args: any[]): ISegmentMetrics;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters): void;
    }
}
declare namespace curve.bounds.extenders {
    class QuadraticCurveTo implements IBoundsExtender {
        isMove: boolean;
        init(sx: number, sy: number, args: any[]): ISegmentMetrics;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics): void;
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters): void;
    }
}
declare namespace curve.bounds {
    class ExtenderSelector implements ISegmentRunner {
        current: extenders.IBoundsExtender;
        args: any[];
        setFillRule(fillRule: FillRule): void;
        closePath(): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean): void;
    }
}
declare namespace curve.bounds.fill {
    class FillBounds implements IBoundingBox {
        path: Path;
        l: number;
        t: number;
        r: number;
        b: number;
        private $calc;
        constructor(path: Path);
        reset(): void;
        ensure(): this;
        calculate(): this;
    }
}
declare namespace curve.bounds {
    interface IBoundingBox {
        l: number;
        t: number;
        r: number;
        b: number;
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
declare namespace curve.bounds.stroke {
    function extendEndCap(box: IBoundingBox, metrics: any, pars: IStrokeParameters): void;
}
declare namespace curve.bounds.stroke {
    import ISegmentMetrics = curve.bounds.extenders.ISegmentMetrics;
    function extendLineJoin(box: IBoundingBox, sx: number, sy: number, metrics: ISegmentMetrics, lastMetrics: ISegmentMetrics, pars: IStrokeParameters): void;
}
declare namespace curve.bounds.stroke {
    function extendStartCap(box: IBoundingBox, sx: number, sy: number, metrics: any, pars: IStrokeParameters): void;
}
declare namespace curve.bounds.stroke {
    class StartCapExtender {
        extend(): void;
    }
}
declare namespace curve.bounds.stroke {
    class StrokeBounds implements IBoundingBox {
        path: Path;
        pars: IStrokeParameters;
        l: number;
        t: number;
        r: number;
        b: number;
        private $calc;
        constructor(path: Path);
        reset(): void;
        ensure(): this;
        calculate(): this;
    }
}
declare namespace curve.compiler {
    function compile(arg0: string | ISegmentExecutor): ICompiledSegment[];
}
declare namespace curve.compiler {
    function decompile(runner: ISegmentRunner, compiled: ICompiledSegment[]): void;
}
interface ICompiledSegment {
    t: CompiledOpType;
    a: any[];
}
declare enum CompiledOpType {
    setFillRule = 1,
    closePath = 2,
    moveTo = 3,
    lineTo = 4,
    bezierCurveTo = 5,
    quadraticCurveTo = 6,
    arc = 7,
    arcTo = 8,
    ellipse = 9,
}
declare namespace curve.ellipticalArc {
    interface IEllipticalArcParameterization {
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
    function fromEllipse(cx: number, cy: number, rx: number, ry: number, phi: number, sa: number, ea: number, ac: boolean): IEllipticalArcParameterization;
}
declare namespace curve.ellipticalArc {
    function correctRadii(rx: number, ry: number, apx: number, apy: number): number[];
}
declare namespace curve.ellipticalArc {
    interface IEllipseParameterization {
        cx: number;
        cy: number;
        rx: number;
        ry: number;
        phi?: number;
        sa?: number;
        ea?: number;
        ac?: boolean;
    }
    function toEllipse(sx: number, sy: number, rx: number, ry: number, phi: number, fa: number, fs: number, ex: number, ey: number): IEllipseParameterization;
}
interface ISegmentExecutor {
    exec(runner: ISegmentRunner, step?: Function): any;
}
interface ISegmentRunner {
    setFillRule(fillRule: FillRule): any;
    closePath(): any;
    moveTo(x: number, y: number): any;
    lineTo(x: number, y: number): any;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): any;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): any;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): any;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): any;
    ellipse(cx: number, cy: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean): any;
}
interface ISegment {
    (runner: ISegmentRunner): void;
}
declare enum FillRule {
    EvenOdd = 0,
    NonZero = 1,
}
declare enum SweepDirection {
    Counterclockwise = 0,
    Clockwise = 1,
}
interface CanvasRenderingContext2D extends ISegmentRunner {
}
declare namespace curve.parse.buffer {
    interface IParseTracker {
        data: Uint8Array;
        offset: number;
    }
}
declare namespace curve.parse.buffer {
    class Parser implements IParser {
        parse(runner: ISegmentRunner, data: string | Uint8Array): any;
    }
    function parseNumber(tracker: IParseTracker): number;
}
declare namespace curve.parse.dom {
    class Parser implements IParser {
        parse(runner: ISegmentRunner, data: string | Uint8Array): void;
    }
}
declare namespace curve.parse {
    enum ParseStyles {
        Dom = 1,
        Buffer = 2,
        CharMatching = 3,
    }
}
declare namespace curve.parse {
    interface IParser {
        parse(runner: ISegmentRunner, data: string | Uint8Array): any;
    }
    var style: ParseStyles;
    function getParser(): IParser;
}
declare namespace curve.parse.matching {
    class Parser implements IParser {
        parse(runner: ISegmentRunner, data: string | Uint8Array): void;
    }
}
declare namespace curve {
    class Path implements ISegmentRunner, ISegmentExecutor {
        private $ops;
        constructor();
        constructor(path: Path);
        constructor(d: string);
        constructor(compiled: ICompiledSegment[]);
        exec(runner: ISegmentRunner, step?: Function): void;
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
        ellipse(cx: number, cy: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean): void;
        static parse(runner: ISegmentRunner, data: string): void;
    }
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
    prototype: TextEncoder;
    new (): TextEncoder;
};
declare namespace curve {
    function serialize(path: Path, pretty?: boolean): string;
}
