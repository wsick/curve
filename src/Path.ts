namespace curve {
    interface IPathOp {
        type: PathOpType;
        args: any[];
        metrics?: any;
    }

    export enum PathOpType {
        closePath,
        moveTo,
        lineTo,
        bezierCurveTo,
        quadraticCurveTo,
        arc,
        arcTo,
        ellipse,
        rect,
    }

    export class Path implements IPath {
        private $ops: IPathOp[];

        fillRule: FillRule;

        constructor();
        constructor(path: Path);
        constructor(d: string);
        constructor(arg0?: string|Path) {
            if (arg0 instanceof Path) {
                this.$ops = JSON.parse(JSON.stringify(this.$ops));
            } else if (typeof arg0 === "string") {
                this.$ops = [];
                Path.parse.call(this, arg0);
            } else {
                this.$ops = [];
            }
        }

        addPath(path: Path, transform?: SVGMatrix) {
            console.warn("addPath", "Not implemented");
        }

        closePath() {
            this.$ops.push({
                type: PathOpType.closePath,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        moveTo(x: number, y: number) {
            this.$ops.push({
                type: PathOpType.moveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        lineTo(x: number, y: number) {
            this.$ops.push({
                type: PathOpType.lineTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
            this.$ops.push({
                type: PathOpType.bezierCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
            this.$ops.push({
                type: PathOpType.quadraticCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
            this.$ops.push({
                type: PathOpType.arc,
                args: Array.prototype.slice.call(arguments, 0),
                metrics: {}
            });
        }

        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
            this.$ops.push({
                type: PathOpType.arcTo,
                args: Array.prototype.slice.call(arguments, 0),
                metrics: {}
            });
        }

        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
            this.$ops.push({
                type: PathOpType.ellipse,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        rect(x: number, y: number, width: number, height: number) {
            this.$ops.push({
                type: PathOpType.rect,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        draw(ctx: CanvasRenderingContext2D) {
            for (var i = 0, ops = this.$ops, len = ops.length; i < len; i++) {
                let op = ops[i];
                let name: string = PathOpType[op.type];
                let func = ctx[name];
                if (!func)
                    throw new Error(`Invalid path operation type. [${op.type}]`);
                func.apply(this, op.args);
            }
        }

        static parse(d: string): IPath {
            var parser = parse.getParser();
            var _this = <Path><any>this;
            var inst = _this instanceof Path ? _this : new Path();
            return parser.parse(inst, d);
        }
    }
}