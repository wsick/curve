namespace demo.ellipticalArc {
    import vec2 = la.vec2;

    export class EllipticalArcDemo extends InteractiveDemo {
        private $curve: curve.Path;
        private $alternate: curve.Path;
        private $ell: curve.ellipticalArc.IEllipseParameterization;
        private $aell: curve.ellipticalArc.IEllipseParameterization;
        private $r: Float32Array;
        private $c0 = vec2.create(0, 0);
        private $c1 = vec2.create(0, 0);
        private $r00 = vec2.create(0, 0);
        private $r01 = vec2.create(0, 0);
        private $r10 = vec2.create(0, 0);
        private $r11 = vec2.create(0, 0);
        private $p0: Float32Array;
        private $p1: Float32Array;
        private $phi: number = 0;
        private $fa: number = 0;
        private $fs = SweepDirection.Counterclockwise;
        private $grabber = new PointsGrabber();

        get grabber(): IGrabeable {
            return this.$grabber;
        }

        constructor() {
            super();
            this.$p0 = vec2.create(400, 400);
            this.$p1 = vec2.create(400, 250);
            this.$r = vec2.create(200, 100);
            this.$grabber.setPoints([this.$p0, this.$p1, this.$r00, this.$r01]);
            this.alignEllipse();
        }

        toggleLargeArc() {
            this.$fa = 1 - this.$fa;
            this.run();
        }

        toggleSweepDirection() {
            this.$fs = this.$fs === SweepDirection.Clockwise
                ? SweepDirection.Counterclockwise
                : SweepDirection.Clockwise;
            this.run();
        }

        build(): this {
            this.align();

            var p0 = this.$p0,
                r = this.$r,
                phi = this.$phi,
                ell = this.$ell,
                aell = this.$aell;

            var path = this.$curve = new curve.Path();
            path.moveTo(p0[0], p0[1]);
            path.ellipse(ell.cx, ell.cy, r[0], r[1], phi, ell.sa, ell.ea, ell.ac);

            var alt = this.$alternate = new curve.Path();
            alt.moveTo(p0[0], p0[1]);
            alt.ellipse(aell.cx, aell.cy, r[0], r[1], phi, aell.sa, aell.ea, aell.ac);
            return this;
        }

        protected align() {
            switch (this.$grabber.lastIndex) {
                default:
                case 0: //start
                case 1: //end
                    return this.alignEllipse();
                case 2: //r00
                    return this.alignArc(false, true);
                case 3: //r01
                    return this.alignArc(false, false);
                case 4: //r10
                    return this.alignArc(true, true);
                case 5: //r11
                    return this.alignArc(true, false);
            }
        }

        protected alignEllipse() {
            var p0 = this.$p0,
                p1 = this.$p1,
                r = this.$r,
                phi = this.$phi,
                fa = this.$fa,
                fs = this.$fs;
            var ell = this.$ell = curve.ellipticalArc.toEllipse(p0[0], p0[1], r[0], r[1], phi, fa, fs, p1[0], p1[1]);
            this.$c0[0] = ell.cx;
            this.$c0[1] = ell.cy;

            var aell = this.$aell = curve.ellipticalArc.toEllipse(p0[0], p0[1], r[0], r[1], phi, 1 - fa, fs, p1[0], p1[1]);
            this.$c1[0] = aell.cx;
            this.$c1[1] = aell.cy;

            this.alignRadialPoints(ell, aell);
        }

        protected alignArc(isAlternate: boolean, xaxis: boolean) {
            var p0 = this.$p0,
                p1 = this.$p1,
                r = this.$r,
                phi = this.$phi,
                fa = this.$fa,
                fs = this.$fs;

            var c = isAlternate ? this.$c1 : this.$c0;
            var exp = la.ellipse(c[0], c[1], r[0], r[1], phi).point(xaxis ? 0 : Math.PI / 2);
            var rij = isAlternate ? (xaxis ? this.$r10 : this.$r11) : (xaxis ? this.$r00 : this.$r01);

            var v0 = vec2.create(c[0] - exp[0], c[1] - exp[1]);
            var vp = vec2.create(c[0] - rij[0], c[1] - rij[1]);
            var dphi = la.vec2.angleBetween(v0, vp);
            if (!la.vec2.isClockwiseTo(v0, vp))
                dphi = -dphi;
            var newPhi = this.$phi + dphi;
            if (newPhi > (2 * Math.PI)) {
                newPhi -= 2 * Math.PI;
            } else if (newPhi < 0) {
                newPhi += 2 * Math.PI;
            }

            var newRadius = Math.sqrt(vp[0] * vp[0] + vp[1] * vp[1]);
            if (xaxis) {
                r[0] = newRadius;
            } else {
                r[1] = newRadius;
            }

            this.$phi = newPhi;

            var ell = {
                cx: this.$c0[0],
                cy: this.$c0[1],
                rx: this.$r[0],
                ry: this.$r[1],
                phi: newPhi
            };
            var aell = {
                cx: this.$c1[0],
                cy: this.$c1[1],
                rx: this.$r[0],
                ry: this.$r[1],
                phi: newPhi
            };
            this.alignRadialPoints(ell, aell);

            //rebuild sx,sy & ex,ey
            var par = isAlternate ? aell : ell;
            var newEllipse = la.ellipse(par.cx, par.cy, par.rx, par.ry, par.phi);
            this.$p0[0] = newEllipse.x(this.$ell.sa);
            this.$p0[1] = newEllipse.y(this.$ell.sa);
            this.$p1[0] = newEllipse.x(this.$ell.ea);
            this.$p1[1] = newEllipse.y(this.$ell.ea);

            this.alignEllipse();
        }

        protected alignRadialPoints(ell: curve.ellipticalArc.IEllipseParameterization, aell: curve.ellipticalArc.IEllipseParameterization) {
            var e = la.ellipse(ell.cx, ell.cy, ell.rx, ell.ry, ell.phi);
            this.$r00[0] = e.x(0);
            this.$r00[1] = e.y(0);
            this.$r01[0] = e.x(Math.PI / 2);
            this.$r01[1] = e.y(Math.PI / 2);

            var ae = la.ellipse(aell.cx, aell.cy, ell.rx, ell.ry, ell.phi);
            this.$r10[0] = ae.x(0);
            this.$r10[1] = ae.y(0);
            this.$r11[0] = ae.x(Math.PI / 2);
            this.$r11[1] = ae.y(Math.PI / 2);
        }

        drawCurve(ctx: CanvasRenderingContext2D): this {
            ctx.save();
            ctx.beginPath();
            this.$curve.draw(ctx);
            ctx.lineWidth = 10;
            ctx.strokeStyle = "rgba(0,0,0,0.6)";
            ctx.stroke();
            ctx.restore();
            return this;
        }

        drawGuide(ctx: CanvasRenderingContext2D): this {
            this.drawSingle(ctx, this.$curve);
            this.drawSingle(ctx, this.$alternate);

            return this.drawGrabPoint(ctx, this.$r00[0], this.$r00[1], "orange")
                .drawGrabPoint(ctx, this.$r01[0], this.$r01[1], "orange");
            //.drawGrabPoint(ctx, this.$r10[0], this.$r10[1], "orange")
            //.drawGrabPoint(ctx, this.$r11[0], this.$r11[1], "orange");
        }

        drawBounds(ctx: CanvasRenderingContext2D): this {
            var b = new curve.bounds.stroke.StrokeBounds(this.$curve);
            b.pars = {
                strokeThickness: 10,
                strokeDashArray: [],
                strokeDashCap: curve.PenLineCap.Flat,
                strokeDashOffset: 0,
                strokeEndLineCap: curve.PenLineCap.Flat,
                strokeLineJoin: curve.PenLineJoin.Miter,
                strokeMiterLimit: 10,
                strokeStartLineCap: curve.PenLineCap.Flat
            };
            b.ensure();
            return this.drawBoundingBox(ctx, b);
        }

        serialize(): string {
            return curve.serialize(this.$curve, true);
        }
    }
}