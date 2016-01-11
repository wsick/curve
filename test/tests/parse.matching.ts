QUnit.module("parse.matching");

(function () {
    var parser = new curve.parse.matching.Parser();

    QUnit.test("lineTo", () => {
        var path = new curve.Path();
        parser.parse(path, "M0,0 L120,360");
        deepEqual(curve.compiler.compile(path), [
            {t: CompiledOpType.moveTo, a: [0, 0]},
            {t: CompiledOpType.lineTo, a: [120, 360]}
        ]);
    });

    QUnit.test("bezierCurveTo", () => {
        var path = new curve.Path();
        parser.parse(path, "M0,0 C100,200 200,400 300,200");
        deepEqual(curve.compiler.compile(path), [
            {t: CompiledOpType.moveTo, a: [0, 0]},
            {t: CompiledOpType.bezierCurveTo, a: [100, 200, 200, 400, 300, 200]}
        ]);
    });

    QUnit.test("quadraticCurveTo", () => {
        var path = new curve.Path();
        parser.parse(path, "M0,0 Q100,200 300,200");
        deepEqual(curve.compiler.compile(path), [
            {t: CompiledOpType.moveTo, a: [0, 0]},
            {t: CompiledOpType.quadraticCurveTo, a: [100, 200, 300, 200]}
        ]);
    });
})();