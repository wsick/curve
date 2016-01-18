namespace curve.bounds.extenders {
    import vec2 = la.vec2;

    export class MoveTo implements IBoundsExtender {
        isMove = true;

        init(sx: number, sy: number, args: any[]): ISegmentMetrics {
            var x = args[0];
            var y = args[1];

            return {
                startVector: null,
                endVector: null,
                endPoint: vec2.create(x, y)
            };
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics) {
            var x = args[0];
            var y = args[1];
            box.l = Math.min(box.l, x);
            box.r = Math.max(box.r, x);
            box.t = Math.min(box.t, y);
            box.b = Math.max(box.b, y);
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters) {
            this.extendFillBox(box, sx, sy, args, metrics);
        }
    }
}