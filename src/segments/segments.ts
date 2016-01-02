/// <reference path="ClosePath" />
/// <reference path="MoveTo" />
/// <reference path="LineTo" />
/// <reference path="BezierCurveTo" />
/// <reference path="QuadraticCurveTo" />
/// <reference path="Arc" />
/// <reference path="ArcTo" />
/// <reference path="Ellipse" />
/// <reference path="Rect" />

namespace gfx.segments {
    export interface ISegment {
        draw(ctx: CanvasRenderingContext2D, args: any[]);
        extendFillBox(box: IBoundingBox, sx: number, sy: number, args: any[], metrics?: any);
        extendStrokeBox(box: IBoundingBox, sx: number, sy: number, args: any[], pars: IStrokeParameters, metrics?: any);
        getStartVector(sx: number, sy: number, args: any[], metrics?: any): number[];
        getEndVector(sx: number, sy: number, args: any[], metrics?: any): number[];
    }

    export var all = [];
    all[PathOpType.closePath] = new ClosePath();
    all[PathOpType.moveTo] = new MoveTo();
    all[PathOpType.lineTo] = new LineTo();
    all[PathOpType.bezierCurveTo] = new BezierCurveTo();
    all[PathOpType.quadraticCurveTo] = new QuadraticCurveTo();
    all[PathOpType.arc] = new Arc();
    all[PathOpType.arcTo] = new ArcTo();
    all[PathOpType.ellipse] = new Ellipse();
    all[PathOpType.rect] = new Rect();
}