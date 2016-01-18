namespace curve.bounds.extenders {
    export class Ellipse implements IBoundsExtender {
        isMove = false;

        init(sx: number, sy: number, args: any[]): curve.bounds.extenders.ISegmentMetrics {
            //TODO: Implement
            return undefined;
        }

        extendFillBox(box: curve.bounds.IBoundingBox, sx: number, sy: number, args: any[], metrics: curve.bounds.extenders.ISegmentMetrics) {
        }

        extendStrokeBox(box: curve.bounds.IBoundingBox, sx: number, sy: number, args: any[], metrics: curve.bounds.extenders.ISegmentMetrics, pars: curve.IStrokeParameters) {
        }

    }
}