namespace demo.stroke {
    import PenLineCap = curve.PenLineCap;
    import PenLineJoin = curve.PenLineJoin;
    import IStrokeParameters = curve.IStrokeParameters;

    var $pars: curve.IStrokeParameters = {
        strokeThickness: 5,
        strokeLineJoin: PenLineJoin.Miter,
        strokeStartLineCap: PenLineCap.Flat,
        strokeEndLineCap: PenLineCap.Flat,
        strokeMiterLimit: 10,
        strokeDashCap: PenLineCap.Flat,
        strokeDashArray: [],
        strokeDashOffset: 0,
    };
    var $stroke = "rgba(0,0,0,0.6)";
    export var pars: IStrokeParameters;
    Object.defineProperties(demo.stroke, {"pars": {value: $pars, writable: false}});

    var caps = [
        "butt", //flat
        "square", //square
        "round", //round
        "butt" //triangle
    ];
    var joins = [
        "miter",
        "bevel",
        "round"
    ];

    export function set(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = $pars.strokeThickness;
        ctx.lineCap = caps[$pars.strokeStartLineCap || $pars.strokeEndLineCap || 0] || caps[0];
        ctx.lineJoin = joins[$pars.strokeLineJoin || 0] || joins[0];
        ctx.miterLimit = $pars.strokeMiterLimit;
        ctx.lineDashOffset = pars.strokeDashOffset;
        ctx.setLineDash(pars.strokeDashArray);
        ctx.strokeStyle = $stroke;
    }
}