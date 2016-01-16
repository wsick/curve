namespace curve {
    export function serialize(path: Path) {
        var serializer = new Serializer();
        path.exec(serializer);
        return serializer.data;
    }

    class Serializer implements ISegmentRunner {
        data: string = "";

        setFillRule(fillRule: FillRule) {
            this.prepend().data += `F${fillRule}`;
        }

        closePath() {
            this.prepend().data += "Z";
        }

        moveTo(x: number, y: number) {
            this.prepend().data += `M${x},${y}`;
        }

        lineTo(x: number, y: number) {
            this.prepend().data += `L${x},${y}`;
        }

        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
            this.prepend().data += `C${cp1x},${cp1y},${cp2x},${cp2y},${x},${y}`;
        }

        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
            this.prepend().data += `Q${cpx},${cpy},${x},${y}`;
        }

        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
            // Not represented in svg
        }

        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
            // Not represented in svg
        }

        ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, antiClockwise?: boolean) {
            // Convert to ellipticalArc
            console.warn("serialize.ellipse", "Not implemented");
        }

        private prepend(): this {
            if (this.data)
                this.data += " ";
            return this;
        }
    }
}