namespace demo {
    import vec2 = la.vec2;
    import fromEllipse = curve.ellipticalArc.fromEllipse;
    import IBoundingBox = curve.bounds.IBoundingBox;
    var colors = {
        start: "rgba(0,   255,   0, 0.8)",
        control: "rgba(255, 106,   0, 0.8)",
        rx: "rgba(127,  51,   0, 0.8)",
        ry: "rgba(  0,  19, 127, 0.8)",
        end: "rgba(255,   0,   0, 0.8)"
    };

    export interface IGrabeable {
        grab(x: number, y: number): boolean;
        move(x: number, y: number);
        canGrab(x: number, y: number): boolean;
    }

    export class InteractiveDemo {
        protected $canvas: HTMLCanvasElement;
        protected $data: HTMLDivElement;
        protected $timeline = new Timeline();
        protected $mover = new Mover();
        private $show = [false, false, false, false];

        get grabber() {
            return null;
        }

        init(canvas: HTMLCanvasElement, box: HTMLDivElement, filler: HTMLDivElement, data: HTMLDivElement): this {
            return this.initCanvas(canvas)
                .initTimeline(box, filler)
                .initMover(canvas)
                .initData(data);
        }

        protected initCanvas(canvas: HTMLCanvasElement): this {
            this.$canvas = canvas;
            return this;
        }

        protected initTimeline(box: HTMLDivElement, filler: HTMLDivElement): this {
            if (!box || !filler)
                return this;
            this.$timeline
                .init(box, filler)
                .onRun(this.run);
            return this;
        }

        protected initMover(canvas: HTMLCanvasElement): this {
            this.$mover
                .init(canvas, this.grabber)
                .onRun(this.run);
            return this;
        }

        protected initData(data: HTMLDivElement): this {
            this.$data = data;
            return this;
        }

        toggleCurve() {
            this.$show[0] = !this.$show[0];
            this.run();
        }

        toggleGuide() {
            this.$show[1] = !this.$show[1];
            this.run();
        }

        toggleTimeline() {
            this.$show[2] = !this.$show[2];
            this.run();
        }

        toggleBounds() {
            this.$show[3] = !this.$show[3];
            this.run();
        }

        run = () => {
            return this.build()
                .updateData()
                .clear()
                .draw();
        };

        build(): this {
            return this;
        }

        updateData(): this {
            this.$data.innerText = this.serialize();
            return this;
        }

        clear(): this {
            var ctx = this.$canvas.getContext('2d');
            ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
            return this;
        }

        draw(): this {
            var ctx = this.$canvas.getContext('2d');
            var show = this.$show;
            if (show[0])
                this.drawCurve(ctx);
            if (show[1])
                this.drawGuide(ctx);
            if (show[2])
                this.drawTimeline(ctx, this.$timeline.getTime());
            if (show[3])
                this.drawBounds(ctx);
            return this;
        }

        drawCurve(ctx: CanvasRenderingContext2D): this {
            return this;
        }

        drawGuide(ctx: CanvasRenderingContext2D): this {
            return this;
        }

        drawTimeline(ctx: CanvasRenderingContext2D, t: number): this {
            return this;
        }

        drawBounds(ctx: CanvasRenderingContext2D): this {
            return this;
        }

        protected drawSingle(ctx: CanvasRenderingContext2D, path: curve.Path): this {
            var compiled = curve.compiler.compile(path);
            var last = [0, 0];
            if (compiled[0].t !== CompiledOpType.moveTo) {
                this.drawSegment(ctx, {t: CompiledOpType.moveTo, a: [0, 0]}, last);
            }
            last = this.drawSegment(ctx, compiled[0], last);
            last = this.drawSegment(ctx, compiled[1], last);
            return this;
        }

        protected drawSegment(ctx: CanvasRenderingContext2D, cur: ICompiledSegment, last: number[]): number[] {
            if (cur.t === CompiledOpType.moveTo) {
                this.drawGrabPoint(ctx, cur.a[0], cur.a[1], colors.start);
                return [cur.a[0], cur.a[1]];
            } else if (cur.t === CompiledOpType.lineTo) {
                this.drawGrabPoint(ctx, cur.a[0], cur.a[1], colors.end);
                return [cur.a[0], cur.a[1]];
            } else if (cur.t === CompiledOpType.quadraticCurveTo) {
                this.drawLine(ctx, last[0], last[1], cur.a[0], cur.a[1], colors.control)
                    .drawGrabPoint(ctx, cur.a[0], cur.a[1], colors.control)
                    .drawLine(ctx, cur.a[0], cur.a[1], cur.a[2], cur.a[3], colors.control)
                    .drawGrabPoint(ctx, cur.a[2], cur.a[3], colors.end);
                return [cur.a[2], cur.a[3]];
            } else if (cur.t === CompiledOpType.bezierCurveTo) {
                this.drawLine(ctx, last[0], last[1], cur.a[0], cur.a[1], colors.control)
                    .drawGrabPoint(ctx, cur.a[0], cur.a[1], colors.control)
                    .drawLine(ctx, cur.a[0], cur.a[1], cur.a[2], cur.a[3], colors.control)
                    .drawGrabPoint(ctx, cur.a[2], cur.a[3], colors.control)
                    .drawLine(ctx, cur.a[2], cur.a[3], cur.a[4], cur.a[5], colors.control)
                    .drawGrabPoint(ctx, cur.a[4], cur.a[5], colors.end);
                return [cur.a[4], cur.a[5]];
            } else if (cur.t === CompiledOpType.ellipse) {
                var earc = fromEllipse(cur.a[0], cur.a[1], cur.a[2], cur.a[3], cur.a[4], cur.a[5], cur.a[6], cur.a[7]);
                this.drawEllipse(ctx, cur.a[0], cur.a[1], cur.a[2], cur.a[3], cur.a[4], colors.control)
                    .drawGrabPoint(ctx, earc.ex, earc.ey, colors.end)
                    .drawEllipseLines(ctx, cur.a[0], cur.a[1], cur.a[2], cur.a[3], cur.a[4])
                    .drawEllipseExtrema(ctx, cur.a, colors.end);
                return [earc.ex, earc.ey];
            }
        }

        protected drawEllipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, rot: number, color: string): this {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, rot, 0, 2 * Math.PI);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.setLineDash([10, 10]);
            ctx.stroke();
            ctx.restore();
            return this;
        }

        protected drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): this {
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
            return this;
        }

        protected drawGrabPoint(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): this {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            return this;
        }

        protected drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string): this {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.setLineDash([10, 10]);
            ctx.stroke();
            ctx.restore();
            return this;
        }

        protected drawEllipseLines(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, rot: number): this {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rot);
            this.drawPoint(ctx, 0, 0, colors.control)
                .drawLine(ctx, 0, 0, rx, 0, colors.rx)
                .drawLine(ctx, 0, 0, 0, ry, colors.ry);
            ctx.restore();
            return this;
        }

        protected drawEllipseExtrema(ctx: CanvasRenderingContext2D, args: any[], color: string): this {
            var util = la.ellipse(args[0], args[1], args[2], args[3], args[4]);
            for (var i = 0, ext = util.extrema(0, 2 * Math.PI, args[7]); i < ext.length; i++) {
                let p = ext[i];
                if (p)
                    this.drawPoint(ctx, p[0], p[1], color)
            }
            return this;
        }

        protected drawBoundingBox(ctx: CanvasRenderingContext2D, box: IBoundingBox): this {
            ctx.save();
            ctx.beginPath();
            ctx.rect(box.l, box.t, box.r - box.l, box.b - box.t);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255,0,0,0.7)";
            ctx.setLineDash([10, 5]);
            ctx.stroke();
            ctx.restore();
            return this;
        }

        serialize(): string {
            return "";
        }
    }
}