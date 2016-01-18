namespace curve.bounds.stroke.tests.quadraticBezier {
    QUnit.module("bounds.stroke.quadraticBezier");

    var path1 = new Path("M122,213 Q118,449,467,161");

    QUnit.test("flat-cap", (assert) => {
        var bounds = new StrokeBounds(path1);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Flat;
        bounds.ensure();

        boxClose(assert, bounds, {
            l: 101.95467422096317,
            t: 145.5741617679596,
            r: 479.7296316623688,
            b: 339.2900763358778
        }, "#1");
    });

    QUnit.test("square-cap", (assert) => {
        var bounds = new StrokeBounds(path1);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Square;
        bounds.ensure();

        boxClose(assert, bounds, {
            l: 101.95467422096317,
            t: 132.84453010559082,
            r: 495.1554698944092,
            b: 339.2900763358778
        }, "#1");
    });

    QUnit.test("round-cap", (assert) => {
        var bounds = new StrokeBounds(path1);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Round;
        bounds.ensure();

        boxClose(assert, bounds, {l: 101.95467422096317, t: 141, r: 487, b: 339.2900763358778}, "#1");
    });
}
