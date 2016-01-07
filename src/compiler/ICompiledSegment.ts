interface ICompiledSegment {
    t: CompiledOpType;
    a: any[];
}

enum CompiledOpType {
    setFillRule = 1,
    closePath = 2,
    moveTo = 3,
    lineTo = 4,
    bezierCurveTo = 5,
    quadraticCurveTo = 6,
    arc = 7,
    arcTo = 8,
    ellipse = 9,
}