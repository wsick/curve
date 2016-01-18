QUnit.module("parse.matching");

QUnit.test("lineTo", () => {
    var path = new curve.Path();
    var parser = new curve.parse.matching.Parser();
    parser.parse(path, "M0,0 L120,360");
    deepEqual(curve.compiler.compile(path), [
        {t: CompiledOpType.moveTo, a: [0, 0]},
        {t: CompiledOpType.lineTo, a: [120, 360]}
    ]);
});
