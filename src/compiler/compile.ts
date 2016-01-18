namespace curve.compiler {
    export function compile(arg0: string|ISegmentExecutor): ICompiledSegment[] {
        var compiler = PathCompiler.instance;
        compiler.compiled = [];
        if (typeof arg0 === "string") {
            var parser = parse.getParser();
            parser.parse(compiler, arg0);
        } else if (typeof arg0.exec === "function") {
            arg0.exec(compiler);
        }
        return compiler.compiled;
    }

    class PathCompiler implements ISegmentRunner {
        static instance = new PathCompiler();

        compiled: ICompiledSegment[] = [];

        setFillRule(fillRule: FillRule) {
            this.compiled.push({t: CompiledOpType.setFillRule, a: [fillRule]});
        }

        closePath() {
            this.compiled.push({t: CompiledOpType.closePath, a: []});
        }

        moveTo(x: number, y: number) {
            this.compiled.push({t: CompiledOpType.moveTo, a: [x, y]});
        }

        lineTo(x: number, y: number) {
            this.compiled.push({t: CompiledOpType.lineTo, a: [x, y]});
        }

        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
            this.compiled.push({t: CompiledOpType.bezierCurveTo, a: [cp1x, cp1y, cp2x, cp2y, x, y]});
        }

        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
            this.compiled.push({t: CompiledOpType.quadraticCurveTo, a: [cpx, cpy, x, y]});
        }

        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
            this.compiled.push({t: CompiledOpType.arc, a: [x, y, radius, startAngle, endAngle, anticlockwise]});
        }

        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
            this.compiled.push({t: CompiledOpType.arcTo, a: [x1, y1, x2, y2, radius]});
        }

        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean) {
            this.compiled.push({
                t: CompiledOpType.ellipse,
                a: [x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise]
            })
        }
    }
}