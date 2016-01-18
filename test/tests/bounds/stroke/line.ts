namespace curve.bounds.stroke.tests.line {
    QUnit.module("bounds.stroke.line");

    QUnit.test("flat-cap", (assert) => {
        var path = new Path("M424,577 L225,454");
        var bounds = new StrokeBounds(path);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Flat;
        bounds.ensure();

        boxClose(assert, bounds, {
            l: 214.48468208312988,
            t: 436.98741340637207,
            r: 434.5153179168701,
            b: 594.0125865936279
        }, "#1");
    });

    QUnit.test("square-cap", (assert) => {
        var path = new Path("M510,280 L345,457");
        var bounds = new StrokeBounds(path);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Square;
        bounds.ensure();

        boxClose(assert, bounds, {
            l: 316.73312306404114,
            t: 251.73312306404114,
            r: 538.2668769359589,
            b: 485.26687693595886
        }, "#1");
    });

    QUnit.test("round-cap", (assert) => {
        var path = new Path("M30,368 L646,548");
        var bounds = new StrokeBounds(path);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Round;
        bounds.ensure();

        boxClose(assert, bounds, {l: 10, t: 348, r: 666, b: 568}, "#1");
    });
}
