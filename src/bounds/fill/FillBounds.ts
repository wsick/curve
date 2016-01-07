namespace curve.bounds.fill {
    export class FillBounds implements IBoundingBox {
        path: Path;
        l: number = 0;
        t: number = 0;
        r: number = 0;
        b: number = 0;

        private $calc = false;

        constructor(path: Path) {
            Object.defineProperties(this, {
                "path": {value: path, writable: false}
            });
        }

        ensure(): this {
            if (!this.$calc)
                this.calculate();
            return this;
        }

        calculate(): this {
            this.$calc = false;
            this.l = Number.POSITIVE_INFINITY;
            this.t = Number.POSITIVE_INFINITY;
            this.r = Number.NEGATIVE_INFINITY;
            this.b = Number.NEGATIVE_INFINITY;

            var sx: number,
                sy: number;
            var selector = new ExtenderSelector();
            this.path.exec(selector, () => {
                var cur = selector.current;
                var metrics = cur.init(sx, sy, selector.args);

                cur.extendFillBox(this, sx, sy, selector.args, metrics);

                sx = metrics.endPoint[0];
                sy = metrics.endPoint[1];
            });

            this.$calc = true;
            return this;
        }
    }
}