namespace curve {
    export function serialize(path: Path, pretty?: boolean) {
        var serializer = new Serializer(pretty);
        path.exec(serializer);
        return serializer.data;
    }

    class Serializer implements ISegmentRunner {
        private prev: {x:number;y:number;};
        private pretty: boolean;
        data: string = "";

        constructor(pretty?: boolean) {
            this.pretty = pretty === true;
        }

        setFillRule(fillRule: FillRule) {
            this.prepend().data += `F${fillRule}`;
        }

        closePath() {
            this.prepend().data += "Z";
        }

        moveTo(x: number, y: number) {
            if (this.pretty) {
                x = round(x, 2);
                y = round(y, 2);
            }
            this.prepend().data += `M${x},${y}`;
            this.prev = {x: x, y: y};
        }

        lineTo(x: number, y: number) {
            if (this.pretty) {
                x = round(x, 2);
                y = round(y, 2);
            }
            this.prepend().data += `L${x},${y}`;
            this.prev = {x: x, y: y};
        }

        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
            if (this.pretty) {
                cp1x = round(cp1x, 2);
                cp1y = round(cp1y, 2);
                cp2x = round(cp2x, 2);
                cp2y = round(cp2y, 2);
                x = round(x, 2);
                y = round(y, 2);
            }
            this.prepend().data += `C${cp1x},${cp1y},${cp2x},${cp2y},${x},${y}`;
            this.prev = {x: x, y: y};
        }

        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
            if (this.pretty) {
                cpx = round(cpx, 2);
                cpy = round(cpy, 2);
                x = round(x, 2);
                y = round(y, 2);
            }
            this.prepend().data += `Q${cpx},${cpy},${x},${y}`;
            this.prev = {x: x, y: y};
        }

        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
            // Not represented in svg
        }

        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
            // Not represented in svg
        }

        ellipse(cx: number, cy: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean) {
            var earc = ellipticalArc.fromEllipse(cx, cy, rx, ry, rotation, startAngle, endAngle, antiClockwise);
            earc.phi = earc.phi * 180 / Math.PI;
            if (this.pretty) {
                earc.sx = round(earc.sx, 2);
                earc.sy = round(earc.sy, 2);
                earc.rx = round(earc.rx, 2);
                earc.ry = round(earc.ry, 2);
                earc.phi = round(earc.phi, 2);
                earc.ex = round(earc.ex, 2);
                earc.ey = round(earc.ey, 2);
            }
            if (this.prev && close(this.prev.x, earc.sx) && close(this.prev.y, earc.sy))
                this.prepend().data += `A${earc.rx},${earc.ry} ${earc.phi} ${earc.fa} ${earc.fs} ${earc.ex},${earc.ey}`;
            else
                this.prepend().data += `L${earc.sx},${earc.sy} A${earc.rx},${earc.ry} ${earc.phi} ${earc.fa} ${earc.fs} ${earc.ex},${earc.ey}`;
        }

        private prepend(): this {
            if (this.data)
                this.data += " ";
            return this;
        }
    }

    var EPSILON = 1e-4;

    function close(a: number, b: number): boolean {
        return Math.abs(a - b) < EPSILON;
    }

    function round(a: number, digits: number): number {
        var factor = Math.pow(10, digits);
        return Math.round(a * factor) / factor;
    }
}