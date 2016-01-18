interface ISegmentExecutor {
    exec(runner: ISegmentRunner, step?: Function);
}

interface ISegmentRunner {
    setFillRule(fillRule: FillRule);
    closePath();
    moveTo(x: number, y: number);
    lineTo(x: number, y: number);
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number);
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number);
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean);
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number);
    ellipse(cx: number, cy: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean);
}

interface ISegment {
    (runner: ISegmentRunner): void;
}

enum FillRule {
    EvenOdd = 0,
    NonZero = 1
}

enum SweepDirection {
    Counterclockwise = 0,
    Clockwise = 1,
}

interface CanvasRenderingContext2D extends ISegmentRunner {
}
