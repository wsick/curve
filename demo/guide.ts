namespace demo.guide {
    import fromEllipse = curve.ellipticalArc.fromEllipse;
    var colors = {
        start: "rgba(0,   255,   0, 0.8)",
        control: "rgba(255, 106,   0, 0.8)",
        rx: "rgba(127,  51,   0, 0.8)",
        ry: "rgba(  0,  19, 127, 0.8)",
        end: "rgba(255,   0,   0, 0.8)"
    };

    export function drawSingle(ctx: CanvasRenderingContext2D, path: curve.Path) {
        var compiled = curve.compiler.compile(path);

        var last = [0, 0];
        if (compiled[0].t !== CompiledOpType.moveTo) {
            drawSegment(ctx, {t: CompiledOpType.moveTo, a: [0, 0]}, last);
        }
        last = drawSegment(ctx, compiled[0], last);
        last = drawSegment(ctx, compiled[1], last);
    }

    export function drawMultiple(ctx: CanvasRenderingContext2D, path: curve.Path) {
        var compiled = curve.compiler.compile(path);

        var last = [0, 0];
        if (compiled[0].t !== CompiledOpType.moveTo) {
            drawSegment(ctx, {t: CompiledOpType.moveTo, a: [0, 0]}, last);
        }
        for (var i = 0; i < compiled.length; i++) {
            last = drawSegment(ctx, compiled[i], last);
        }
    }

    function drawSegment(ctx: CanvasRenderingContext2D, cur: ICompiledSegment, last: number[]): number[] {
        if (cur.t === CompiledOpType.moveTo) {
            drawPoint(ctx, cur.a[0], cur.a[1], colors.start);
            return [cur.a[0], cur.a[1]];
        } else if (cur.t === CompiledOpType.lineTo) {
            drawPoint(ctx, cur.a[0], cur.a[1], colors.end);
            return [cur.a[0], cur.a[1]];
        } else if (cur.t === CompiledOpType.quadraticCurveTo) {
            drawLine(ctx, last[0], last[1], cur.a[0], cur.a[1], colors.control);
            drawPoint(ctx, cur.a[0], cur.a[1], colors.control);
            drawLine(ctx, cur.a[0], cur.a[1], cur.a[2], cur.a[3], colors.control);
            drawPoint(ctx, cur.a[2], cur.a[3], colors.end);
            return [cur.a[2], cur.a[3]];
        } else if (cur.t === CompiledOpType.bezierCurveTo) {
            drawLine(ctx, last[0], last[1], cur.a[0], cur.a[1], colors.control);
            drawPoint(ctx, cur.a[0], cur.a[1], colors.control);
            drawLine(ctx, cur.a[0], cur.a[1], cur.a[2], cur.a[3], colors.control);
            drawPoint(ctx, cur.a[2], cur.a[3], colors.control);
            drawLine(ctx, cur.a[2], cur.a[3], cur.a[4], cur.a[5], colors.control);
            drawPoint(ctx, cur.a[4], cur.a[5], colors.end);
            return [cur.a[4], cur.a[5]];
        } else if (cur.t === CompiledOpType.ellipse) {
            drawEllipse(ctx, cur.a[0], cur.a[1], cur.a[2], cur.a[3], cur.a[4], colors.control);
            var earc = fromEllipse(cur.a[0], cur.a[1], cur.a[2], cur.a[3], cur.a[4], cur.a[5], cur.a[6], cur.a[7]);
            drawPoint(ctx, earc.ex, earc.ey, colors.end);
            drawEllipseLines(ctx, cur.a[0], cur.a[1], cur.a[2], cur.a[3], cur.a[4]);
            drawEllipseExtrema(ctx, cur.a, colors.end);
            return [earc.ex, earc.ey];
        }
    }

    function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(x - 2, y - 2, 4, 4);
    }

    function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.setLineDash([10, 10]);
        ctx.stroke();
        ctx.restore();
    }

    function drawEllipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, rot: number, color: string) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, rot, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.setLineDash([10, 10]);
        ctx.stroke();
        ctx.restore();
    }

    function drawEllipseLines(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, rot: number) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        drawPoint(ctx, 0, 0, colors.control);
        drawLine(ctx, 0, 0, rx, 0, colors.rx);
        drawLine(ctx, 0, 0, 0, ry, colors.ry);
        ctx.restore();
    }

    function drawEllipseExtrema(ctx: CanvasRenderingContext2D, args: any[], color: string) {
        var util = la.ellipse(args[0], args[1], args[2], args[3], args[4]);
        for (var i = 0, ext = util.extrema(0, 2 * Math.PI, args[7]); i < ext.length; i++) {
            let p = ext[i];
            drawPoint(ctx, p[0], p[1], color)
        }
    }
}