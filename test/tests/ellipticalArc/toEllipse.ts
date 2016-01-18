namespace curve.ellipticalArc.tests.toEllipse {
    QUnit.module("ellipticalArc.toEllipse");

    var ea1 = {
        sx: 100,
        sy: 75,
        ex: 50,
        ey: 150,
        rx: 50,
        ry: 75,
        phi: 0
    };
    var e1 = {
        cx: 50,
        cy: 75,
        rx: 50,
        ry: 75,
        phi: 0,
        sa: 0,
        ea: Math.PI / 2
    };
    var e2 = {
        cx: 100,
        cy: 150,
        rx: 50,
        ry: 75,
        phi: 0,
        sa: 3 * Math.PI / 2,
        ea: Math.PI
    };

    function testTo(origin: any, fa: number, fs: number, exp: any, expac: boolean, msg: string) {
        var el = curve.ellipticalArc.toEllipse(origin.sx, origin.sy, origin.rx, origin.ry, origin.phi, fa, fs, origin.ex, origin.ey);
        equal(el.cx, exp.cx, `${msg}-cx`);
        equal(el.cy, exp.cy, `${msg}-cy`);
        equal(el.rx, exp.rx, `${msg}-rx`);
        equal(el.ry, exp.ry, `${msg}-ry`);
        equal(el.phi, exp.phi, `${msg}-phi`);
        equal(el.sa, exp.sa, `${msg}-sa`);
        equal(el.ea, exp.ea, `${msg}-ea`);
        equal(el.ac, expac, `${msg}-ac`);
    }

    QUnit.test("large-arc sweep-ccw", () => {
        // red
        testTo(ea1, 1, SweepDirection.Counterclockwise, e1, true, "#1");
    });

    QUnit.test("large-arc sweep-cw", () => {
        // orange
        testTo(ea1, 1, SweepDirection.Clockwise, e2, false, "#2");
    });

    QUnit.test("small-arc sweep-ccw", () => {
        // green
        testTo(ea1, 0, SweepDirection.Counterclockwise, e2, true, "#2");
    });

    QUnit.test("small-arc sweep-cw", () => {
        // blue
        testTo(ea1, 0, SweepDirection.Clockwise, e1, false, "#1");
    });
}