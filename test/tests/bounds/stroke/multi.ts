namespace curve.bounds.stroke.tests.multi {
    QUnit.module("bounds.stroke.multi");

    var path1 = new Path("M149,202 C225,511,163,514,557,80 C538,499,270,311,105,210 C223,109,472,83,278,565 C533,534,446,39,576,325");

    QUnit.test("miter-join", (assert) => {
        var bounds = new StrokeBounds(path1);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Flat;
        bounds.pars.strokeLineJoin = PenLineJoin.Miter;
        bounds.ensure();

        boxClose(assert, bounds, {
            l: 71.0943832397461,
            t: 25.4683837890625,
            r: 594.2073295116425,
            b: 588.9395141601562
        }, "#1");
    });

    QUnit.test("bevel-join", (assert) => {
        var bounds = new StrokeBounds(path1);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Flat;
        bounds.pars.strokeLineJoin = PenLineJoin.Bevel;
        bounds.ensure();

        boxClose(assert, bounds, {
            l: 91.99478149414062,
            t: 66.5567398071289,
            r: 594.2073295116425,
            b: 584.8538208007812
        }, "#1");
    });

    QUnit.test("round-join", (assert) => {
        var bounds = new StrokeBounds(path1);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Flat;
        bounds.pars.strokeLineJoin = PenLineJoin.Round;
        bounds.ensure();

        boxClose(assert, bounds, {l: 85, t: 60, r: 594.2073295116425, b: 585}, "#1");
    });
}
