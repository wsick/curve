namespace curve.bounds.stroke.line.tests {
    QUnit.module("bounds.stroke.line");

    function createStrokePars(): curve.IStrokeParameters {
        return {
            strokeThickness: 5,
            strokeLineJoin: PenLineJoin.Miter,
            strokeStartLineCap: PenLineCap.Flat,
            strokeEndLineCap: PenLineCap.Flat,
            strokeMiterLimit: 10,
            strokeDashCap: PenLineCap.Flat,
            strokeDashArray: [],
            strokeDashOffset: 0,
        };
    }

    function boxClose(assert, actual: IBoundingBox, expected: IBoundingBox, msg: string) {
        var factor = Math.pow(10, 3);
        assert.equal(Math.round(actual.l * factor) / factor, Math.round(expected.l * factor) / factor, `${msg}-left`);
        assert.equal(Math.round(actual.t * factor) / factor, Math.round(expected.t * factor) / factor, `${msg}-top`);
        assert.equal(Math.round(actual.r * factor) / factor, Math.round(expected.r * factor) / factor, `${msg}-right`);
        assert.equal(Math.round(actual.b * factor) / factor, Math.round(expected.b * factor) / factor, `${msg}-bottom`);
    }

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
