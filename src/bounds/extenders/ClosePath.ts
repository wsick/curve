namespace curve.bounds.extenders {
    export class ClosePath implements IBoundsExtender {
        isMove = false;

        init(): ISegmentMetrics {
            return {
                endPoint: undefined,
                startVector: undefined,
                endVector: undefined
            }
        }

        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics) {
        }

        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters) {
        }
    }
}