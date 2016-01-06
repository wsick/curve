namespace curve {
    export interface IPath {
        fillRule: FillRule;
        addPath(path: Path, transform?: SVGMatrix);
        closePath() ;
        moveTo(x: number, y: number) ;
        lineTo(x: number, y: number) ;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) ;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) ;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) ;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) ;
        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) ;
        rect(x: number, y: number, width: number, height: number) ;
        draw(ctx: CanvasRenderingContext2D) ;
    }
}