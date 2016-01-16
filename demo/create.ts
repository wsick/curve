namespace demo.create {
    export enum DemoTypes {
        Line = 0,
        QuadraticBezier = 1,
        CubicBezier = 2,
        Multiple = 3,
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

    function newMulti(spec: any): curve.Path {
        var path = new curve.Path();
        var [x, y] = random.point([spec.w, spec.h]);
        path.moveTo(x, y);

        for (var i = random.randomInt(2, 4); i >= 0; i--) {
            [x, y] = random.point([spec.w, spec.h]);
            let [cp1x, cp1y] = random.point([spec.w, spec.h]);
            let [cp2x, cp2y] = random.point([spec.w, spec.h]);
            switch (random.randomInt(0, 3)) {
                case DemoTypes.Line:
                    path.lineTo(x, y);
                    break;
                case DemoTypes.QuadraticBezier:
                    path.quadraticCurveTo(cp1x, cp1y, x, y);
                    break;
                case DemoTypes.CubicBezier:
                    path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                    break;
            }
        }
        return path;
    }
}