export function load() {
    QUnit.module('parseNumber');

    function run(str: string): number {
        return path2d.parseNumber(stringToTracker(str));
    }

    function stringToTracker(str: string): path2d.IParseTracker {
        var buffer = new TextEncoder().encode(str);
        return {
            data: buffer,
            offset: 0
        };
    }

    QUnit.test("NaN", (assert) => {
        assert.ok(isNaN(run('NaN')));
    });

    QUnit.test("Infinity", (assert) => {
        assert.strictEqual(run('Infinity'), Number.POSITIVE_INFINITY);
        assert.strictEqual(run('+Infinity'), Number.POSITIVE_INFINITY);
        assert.strictEqual(run('-Infinity'), Number.NEGATIVE_INFINITY);
    });

    QUnit.test("Integer", (assert) => {
        assert.strictEqual(run('1'), 1);
        assert.strictEqual(run('-1'), -1);
    });

    QUnit.test("Simple decimal", (assert) => {
        assert.strictEqual(run('1.1'), 1.1);
        assert.strictEqual(run('-1.1'), -1.1);

        assert.strictEqual(run('.1'), .1);
        assert.strictEqual(run('-.1'), -.1);

        assert.strictEqual(run('0.1'), 0.1);
        assert.strictEqual(run('-0.1'), -0.1);

        assert.strictEqual(run('0000.1'), 0.1);
        assert.strictEqual(run('-0000.1'), -0.1);

        assert.strictEqual(run('1.123456'), 1.123456);
        assert.strictEqual(run('-1.123456'), -1.123456);
    });
}