namespace demo.cubic {
    import vec2 = la.vec2;

    export class CubicDemo extends InteractiveDemo {
        private $curve: curve.Path;
        private $p0: Float32Array;
        private $p1: Float32Array;
        private $p2: Float32Array;
        private $p3: Float32Array;
        private $grabber = new BezierGrabber();

        get grabber(): IGrabeable {
            return this.$grabber;
        }

        constructor() {
            super();
            this.$p0 = vec2.create(100, 200);
            this.$p1 = vec2.create(250, 100);
            this.$p2 = vec2.create(350, 300);
            this.$p3 = vec2.create(500, 200);
            this.$grabber.setPoints([this.$p0, this.$p1, this.$p2, this.$p3]);
        }

        build(): this {
            var p0 = this.$p0,
                p1 = this.$p1,
                p2 = this.$p2,
                p3 = this.$p3;
            var path = this.$curve = new curve.Path();
            path.moveTo(p0[0], p0[1]);
            path.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
            return this;
        }

        drawCurve(ctx: CanvasRenderingContext2D): this {
            ctx.beginPath();
            this.$curve.draw(ctx);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(0,0,0,0.6)";
            ctx.stroke();
            return this;
        }

        drawGuide(ctx: CanvasRenderingContext2D): this {
            return this.drawSingle(ctx, this.$curve);
        }

        drawTimeline(ctx: CanvasRenderingContext2D, t: number): this {
            var lp0 = utils.pointOnLine(this.$p0, this.$p1, t);
            var lp1 = utils.pointOnLine(this.$p1, this.$p2, t);
            var lp2 = utils.pointOnLine(this.$p2, this.$p3, t);
            var ip1 = utils.pointOnLine(lp0, lp1, t);
            var ip2 = utils.pointOnLine(lp1, lp2, t);
            var fp = utils.pointOnLine(ip1, ip2, t);
            this.drawPoint(ctx, lp0[0], lp0[1], "blue")
                .drawPoint(ctx, lp1[0], lp1[1], "blue")
                .drawPoint(ctx, lp2[0], lp2[1], "blue")
                .drawLine(ctx, lp0[0], lp0[1], lp1[0], lp1[1], "blue")
                .drawLine(ctx, lp1[0], lp1[1], lp2[0], lp2[1], "blue");

            this.drawPoint(ctx, ip1[0], ip1[1], "blue")
                .drawPoint(ctx, ip2[0], ip2[1], "blue")
                .drawLine(ctx, ip1[0], ip1[1], ip2[0], ip2[1], "blue");

            this.drawPoint(ctx, fp[0], fp[1], "blue");

            return this;
        }
    }
}