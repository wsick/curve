namespace curve.ellipticalArc.tests.fromEllipse {
    QUnit.module("ellipticalArc.fromEllipse");

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

    function testFrom(origin: any, anticlockwise: boolean, exp: any, expfa: number, expfs: number, msg: string) {
        var ea = curve.ellipticalArc.fromEllipse(origin.cx, origin.cy, origin.rx, origin.ry, origin.phi, origin.sa, origin.ea, anticlockwise);
        equal(ea.sx, exp.sx, `${msg}-sx`);
        equal(ea.sy, exp.sy, `${msg}-sy`);
        equal(ea.ex, exp.ex, `${msg}-ex`);
        equal(ea.ey, exp.ey, `${msg}-ey`);
        equal(ea.rx, exp.rx, `${msg}-rx`);
        equal(ea.ry, exp.ry, `${msg}-ry`);
        equal(ea.phi, exp.phi, `${msg}-phi`);
        equal(ea.fa, expfa, `${msg}-fa`);
        equal(ea.fs, expfs, `${msg}-fs`);
    }

    QUnit.test("anti-clockwise", () => {
        testFrom(e1, true, ea1, 1, SweepDirection.Counterclockwise, "#1"); // red
        testFrom(e2, true, ea1, 0, SweepDirection.Counterclockwise, "#2"); // green
    });

    QUnit.test("clockwise", () => {
        testFrom(e1, false, ea1, 0, SweepDirection.Clockwise, "#1"); // blue
        testFrom(e2, false, ea1, 1, SweepDirection.Clockwise, "#2"); // orange
    });
}