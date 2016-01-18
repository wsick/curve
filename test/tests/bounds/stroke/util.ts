namespace curve.bounds.stroke.tests {
    export function createStrokePars(): curve.IStrokeParameters {
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

    export function boxClose(assert, actual: IBoundingBox, expected: IBoundingBox, msg: string) {
        var factor = Math.pow(10, 3);
        assert.equal(Math.round(actual.l * factor) / factor, Math.round(expected.l * factor) / factor, `${msg}-left`);
        assert.equal(Math.round(actual.t * factor) / factor, Math.round(expected.t * factor) / factor, `${msg}-top`);
        assert.equal(Math.round(actual.r * factor) / factor, Math.round(expected.r * factor) / factor, `${msg}-right`);
        assert.equal(Math.round(actual.b * factor) / factor, Math.round(expected.b * factor) / factor, `${msg}-bottom`);
    }
}