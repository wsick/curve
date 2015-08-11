namespace path2d {
    export interface IPathOp {
        type: IPathOpType;
    }
    export enum IPathOpType {
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

    export class Path2DEx implements Path2D {
        private $ops: IPathOp[];

        constructor ();
        constructor (path: Path2D);
        constructor (d: string);
        constructor (arg0?: string|Path2D) {
            if (arg0 instanceof <any>Path2D) {
                this.$ops = JSON.parse(JSON.stringify(this.$ops));
            } else if (typeof arg0 === "string") {
                this.$ops = [];
                Path2DEx.parse.call(this, arg0);
            } else {
                this.$ops = [];
            }
        }

        addPath (path: Path2D, transform?: SVGMatrix) {

        }

        closePath () {
            this.$ops.push({
                type: IPathOpType.closePath,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        moveTo (x: number, y: number) {
            this.$ops.push({
                type: IPathOpType.moveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        lineTo (x: number, y: number) {
            this.$ops.push({
                type: IPathOpType.lineTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        bezierCurveTo (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
            this.$ops.push({
                type: IPathOpType.bezierCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        quadraticCurveTo (cpx: number, cpy: number, x: number, y: number) {
            this.$ops.push({
                type: IPathOpType.quadraticCurveTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        arc (x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
            this.$ops.push({
                type: IPathOpType.arc,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        arcTo (x1: number, y1: number, x2: number, y2: number, radius: number) {
            this.$ops.push({
                type: IPathOpType.arcTo,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        ellipse (x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
            this.$ops.push({
                type: IPathOpType.ellipse,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        rect (x: number, y: number, width: number, height: number) {
            this.$ops.push({
                type: IPathOpType.rect,
                args: Array.prototype.slice.call(arguments, 0)
            });
        }

        static parse (d: string): Path2D {
            throw new Error("Not implemented");
        }
    }
}