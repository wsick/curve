namespace curve.bounds.stroke.tests.cubicBezier {
    QUnit.module("bounds.stroke.cubicBezier");

    var path1 = new Path("M335,308 C516,432,88,381,792,526");

    QUnit.test("flat-cap", (assert) => {
        var bounds = new StrokeBounds(path1);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Flat;
        bounds.ensure();

        boxClose(assert, bounds, {
            l: 323.69652032852173,
            t: 291.50056529045105,
            r: 796.0346285700798,
            b: 545.588817358017
        }, "#1");
    });

    QUnit.test("square-cap", (assert) => {
        var bounds = new StrokeBounds(path1);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Square;
        bounds.ensure();

        boxClose(assert, bounds, {
            l: 307.1970856189728,
            t: 280.1970856189728,
            r: 815.6234459280968,
            b: 549.6234459280968
        }, "#1");
    });

    QUnit.test("round-cap", (assert) => {
        var bounds = new StrokeBounds(path1);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Round;
        bounds.ensure();

        boxClose(assert, bounds, {l: 315, t: 288, r: 812, b: 546}, "#1");
    });
}
