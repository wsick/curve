namespace curve.segments {
    export class LineTo implements ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]) {
            var x = args[0];
            var y = args[1];
            ctx.lineTo(x, y);
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[]) {
            var x = args[0];
            var y = args[1];
            box.l = Math.min(box.l, x);
            box.r = Math.max(box.r, x);
            box.t = Math.min(box.t, y);
            box.b = Math.max(box.b, y);
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters) {
            this.extendFillBox(box, sx, sy, args);
        }

        getStartVector(sx: number, sy: number, args: any[]): number[] {
            return [
                args[0] - sx,
                args[1] - sy
            ];
        }

        getEndVector(sx: number, sy: number, args: any[]): number[] {
            return [
                args[0] - sx,
                args[1] - sy
            ];
        }
    }
}