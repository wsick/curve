/// <reference path="extenders/Arc" />
/// <reference path="extenders/ArcTo" />
/// <reference path="extenders/BezierCurveTo" />
/// <reference path="extenders/ClosePath" />
/// <reference path="extenders/Ellipse" />
/// <reference path="extenders/LineTo" />
/// <reference path="extenders/MoveTo" />
/// <reference path="extenders/QuadraticCurveTo" />

namespace curve.bounds {
    var arc = new extenders.Arc();
    var arcTo = new extenders.ArcTo();
    var bezierCurveTo = new extenders.BezierCurveTo();
    var closePath = new extenders.ClosePath();
    var ellipse = new extenders.Ellipse();
    var lineTo = new extenders.LineTo();
    var moveTo = new extenders.MoveTo();
    var quadraticCurveTo = new extenders.QuadraticCurveTo();

    export class ExtenderSelector implements ISegmentRunner {
        current: extenders.IBoundsExtender;
        args: any[];

        setFillRule(fillRule: FillRule) {
            //TODO: Does fill rule affect bounds?
        }

        closePath() {
            this.current = closePath;
            this.args = <any[]><any>arguments;
        }

        moveTo(x: number, y: number) {
            this.current = moveTo;
            this.args = <any[]><any>arguments;
        }

        lineTo(x: number, y: number) {
            this.current = lineTo;
            this.args = <any[]><any>arguments;
        }

        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
            this.current = bezierCurveTo;
            this.args = <any[]><any>arguments;
        }

        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
            this.current = quadraticCurveTo;
            this.args = <any[]><any>arguments;
        }

        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
            this.current = arc;
            this.args = <any[]><any>arguments;
        }

        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
            this.current = arcTo;
            this.args = <any[]><any>arguments;
        }

        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean) {
            this.current = ellipse;
            this.args = <any[]><any>arguments;
        }
    }
}