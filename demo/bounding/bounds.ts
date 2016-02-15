namespace demo.bounds {
    import IStrokeParameters = curve.IStrokeParameters;

    export function draw(ctx: CanvasRenderingContext2D, path: curve.Path, pars: IStrokeParameters): curve.bounds.IBoundingBox {
        var b = new curve.bounds.stroke.StrokeBounds(path);
        b.pars = pars;
        b.ensure();
        ctx.save();
        ctx.beginPath();
        ctx.rect(b.l, b.t, b.r - b.l, b.b - b.t);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,0,0,0.7)";
        ctx.setLineDash([10, 5]);
        ctx.stroke();
        ctx.restore();
        return b;
    }
}