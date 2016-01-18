namespace curve {
    export class Path implements ISegmentRunner, ISegmentExecutor {
        private $ops: ISegment[] = [];

        constructor();
        constructor(path: Path);
        constructor(d: string);
        constructor(compiled: ICompiledSegment[]);
        constructor(arg0?: string|Path|ICompiledSegment[]) {
            if (arg0 instanceof Path) {
                arg0.exec(this);
            } else if (Array.isArray(arg0)) {
                new compiler.decompile(this, arg0);
            } else if (typeof arg0 === "string") {
                var parser = parse.getParser();
                parser.parse(this, arg0);
            }
        }

        exec(runner: ISegmentRunner, step?: Function) {
            for (var ops = this.$ops, i = 0; ops && i < ops.length; i++) {
                ops[i](runner);
                step && step();
            }
        }

        draw(ctx: CanvasRenderingContext2D) {
            this.exec(ctx);
        }

        addPath(path: Path) {
            path.exec(this);
        }

        setFillRule(fillRule: FillRule) {
            this.$ops.push(exec => exec.setFillRule(fillRule));
        }

        closePath() {
            this.$ops.push(exec => exec.closePath());
        }

        moveTo(x: number, y: number) {
            this.$ops.push(exec => exec.moveTo(x, y));
        }

        lineTo(x: number, y: number) {
            this.$ops.push(exec => exec.lineTo(x, y));
        }

        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
            this.$ops.push(exec => exec.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
        }

        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
            this.$ops.push(exec => exec.quadraticCurveTo(cpx, cpy, x, y));
        }

        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
            this.$ops.push(exec => exec.arc(x, y, radius, startAngle, endAngle, anticlockwise));
        }

        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
            this.$ops.push(exec => exec.arcTo(x1, y1, x2, y2, radius));
        }

        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean) {
            this.$ops.push(exec => exec.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise));
        }

        static parse(runner: ISegmentRunner, data: string) {
            var parser = parse.getParser();
            parser.parse(runner, data);
        }
    }
}