namespace curve.bounds.stroke {
    import vec2 = la.vec2;
    import IBoundsExtender = curve.bounds.extenders.IBoundsExtender;
    import ISegmentMetrics = curve.bounds.extenders.ISegmentMetrics;

    export class StrokeBounds implements IBoundingBox {
        path: Path;
        pars: IStrokeParameters;
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
                sy: number,
                last: IBoundsExtender,
                lastMetrics: ISegmentMetrics;
            var selector = new ExtenderSelector();
            this.path.exec(selector, () => {
                var cur = selector.current;
                var metrics = cur.init(sx, sy, selector.args);

                if (!cur.isMove && last.isMove) {
                    extendStartCap(this, sx, sy, metrics, this.pars);
                } else if (lastMetrics) {
                    extendLineJoin(this, sx, sy, metrics, lastMetrics, this.pars);
                }

                cur.extendStrokeBox(this, sx, sy, selector.args, metrics, this.pars);

                sx = metrics.endPoint[0];
                sy = metrics.endPoint[1];
                last = cur;
                lastMetrics = metrics;
            });

            if (lastMetrics)
                extendEndCap(this, lastMetrics, this.pars);

            this.$calc = true;
            return this;
        }
    }
}