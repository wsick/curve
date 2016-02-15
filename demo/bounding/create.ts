namespace demo.create {
    export enum DemoTypes {
        Line = 0,
        QuadraticBezier = 1,
        CubicBezier = 2,
        Ellipse = 3,
        Multiple = 4,
    }

    var $type = DemoTypes.Line;

    export function setType(type: string) {
        $type = parseFloat(type) || 0;
        return demo;
    }

    export function newCurve(spec: any): curve.Path {
        switch ($type) {
            default:
            case DemoTypes.Line:
                return newLine(spec);
            case DemoTypes.QuadraticBezier:
                return newQuadBezier(spec);
            case DemoTypes.CubicBezier:
                return newCubicBezier(spec);
            case DemoTypes.Ellipse:
                return newEllipse(spec);
            case DemoTypes.Multiple:
                return newMulti(spec);
        }
    }

    export function isSingleType(): boolean {
        switch ($type) {
            default:
                return true;
            case DemoTypes.Multiple:
                return false;
        }
    }

    function newLine(spec: any): curve.Path {
        var path = new curve.Path();
        var [x, y] = random.point([spec.w, spec.h]);
        path.moveTo(x, y);
        [x, y] = random.point([spec.w, spec.h]);
        path.lineTo(x, y);
        return path;
    }

    function newQuadBezier(spec: any): curve.Path {
        var path = new curve.Path();
        var [x, y] = random.point([spec.w, spec.h]);
        path.moveTo(x, y);
        var [cpx, cpy] = random.point([spec.w, spec.h]);
        [x, y] = random.point([spec.w, spec.h]);
        path.quadraticCurveTo(cpx, cpy, x, y);
        return path;
    }

    function newCubicBezier(spec: any): curve.Path {
        var path = new curve.Path();
        var [x, y] = random.point([spec.w, spec.h]);
        path.moveTo(x, y);
        var [cp1x, cp1y] = random.point([spec.w, spec.h]);
        var [cp2x, cp2y] = random.point([spec.w, spec.h]);
        [x, y] = random.point([spec.w, spec.h]);
        path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        return path;
    }

    function newEllipse(spec: any): curve.Path {
        var ea = randomEllipticalArc(spec);
        var ell = curve.ellipticalArc.toEllipse(ea.sx, ea.sy, ea.rx, ea.ry, ea.phi, ea.fa, ea.fs, ea.ex, ea.ey);

        var path = new curve.Path();
        path.moveTo(ea.sx, ea.sy);
        path.ellipse(ell.cx, ell.cy, ell.rx, ell.ry, ell.phi, ell.sa, ell.ea);
        return path;
    }

    function newMulti(spec: any): curve.Path {
        var last = [0, 0];
        var path = new curve.Path();
        var [x, y] = random.point([spec.w, spec.h]);
        path.moveTo(x, y);

        for (var i = random.randomInt(2, 4); i >= 0; i--) {
            [x, y] = random.point([spec.w, spec.h]);
            let [cp1x, cp1y] = random.point([spec.w, spec.h]);
            let [cp2x, cp2y] = random.point([spec.w, spec.h]);
            switch (random.randomInt(0, 4)) {
                case DemoTypes.Line:
                    path.lineTo(x, y);
                    break;
                case DemoTypes.QuadraticBezier:
                    path.quadraticCurveTo(cp1x, cp1y, x, y);
                    break;
                case DemoTypes.CubicBezier:
                    path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                    break;
                case DemoTypes.Ellipse:
                    var ea = randomEllipticalArc(spec);
                    var [dx, dy] = [last[0] - ea.sx, last[1] - ea.sy];
                    ea.sx -= dx;
                    ea.sy -= dy;
                    ea.ex -= dx;
                    ea.ey -= dy;
                    var ell = curve.ellipticalArc.toEllipse(ea.sx, ea.sy, ea.rx, ea.ry, ea.phi, ea.fa, ea.fs, ea.ex, ea.ey);
                    path.ellipse(ell.cx, ell.cy, ell.rx, ell.ry, ell.phi, ell.sa, ell.ea, ell.ac);
                    break;
            }
            last[0] = x;
            last[1] = y;
        }
        return path;
    }

    function randomEllipticalArc(spec: any) {
        var [cx, cy] = random.point([spec.w, spec.h]);
        var [rx, ry] = random.point([spec.w / 4, spec.h / 4]);
        var phi = random.randomInt(0, 2 * Math.PI);
        var sa = random.randomInt(0, Math.PI / 2);
        var ea = random.randomInt(sa, 2 * Math.PI);
        var ac = random.flag();
        return curve.ellipticalArc.fromEllipse(cx, cy, rx, ry, phi, sa, ea, ac);
    }
}