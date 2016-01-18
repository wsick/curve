namespace curve.bounds.stroke.quadraticBezier.tests {
    QUnit.module("bounds.stroke.quadraticBezier");

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
        var path = new Path("M122,213 Q118,449,467,161");
        var bounds = new StrokeBounds(path);
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
        var path = new Path("M122,213 Q118,449,467,161");
        var bounds = new StrokeBounds(path);
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
        var path = new Path("M122,213 Q118,449,467,161");
        var bounds = new StrokeBounds(path);
        bounds.pars = createStrokePars();
        bounds.pars.strokeThickness = 40;
        bounds.pars.strokeStartLineCap = bounds.pars.strokeEndLineCap = PenLineCap.Round;
        bounds.ensure();

        boxClose(assert, bounds, {l: 101.95467422096317, t: 141, r: 487, b: 339.2900763358778}, "#1");
    });
}
