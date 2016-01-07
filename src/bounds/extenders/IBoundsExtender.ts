namespace curve.bounds.extenders {
    export interface IBoundsExtender {
        isMove: boolean;
        init(sx: number, sy: number, args: any[]): ISegmentMetrics;
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics);
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics: ISegmentMetrics, pars: IStrokeParameters);
    }
}