interface CanvasRenderingContext2D {
    drawPath(path: curve.IPath);
}

namespace curve {
    var proto: CanvasRenderingContext2D = CanvasRenderingContext2D.prototype;
    if (typeof proto.drawPath !== "function") {
        proto.drawPath = function (path: IPath) {
            this.beginPath();
            path.draw(this);
        };
    }
}