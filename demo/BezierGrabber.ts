namespace demo {
    const GRAB_RADIUS = 8;

    export class BezierGrabber implements IGrabeable {
        private $points = [];
        private $last = la.vec2.create(0, 0);
        private $index = -1;

        setPoints(points: Float32Array[]) {
            this.$points = points;
        }

        grab(x: number, y: number): boolean {
            var index = this.$index = this.findPoint(x, y);
            if (index > -1) {
                this.$last[0] = x;
                this.$last[1] = y;
                return true;
            }
            return false;
        }

        move(x: number, y: number) {
            var index = this.$index;
            if (index < 0)
                return;

            var last = this.$last;
            var dx = x - last[0];
            var dy = y - last[1];
            var point = this.$points[index];
            point[0] += dx;
            point[1] += dy;
            last[0] = x;
            last[1] = y;
        }

        canGrab(x: number, y: number): boolean {
            return this.findPoint(x, y) > -1;
        }

        protected findPoint(x: number, y: number): number {
            for (var i = 0, points = this.$points; i < points.length; i++) {
                let point = points[i];
                if ((Math.abs(point[0] - x) < GRAB_RADIUS) && (Math.abs(point[1] - y) < GRAB_RADIUS)) {
                    return i;
                }
            }
            return -1;
        }
    }
}