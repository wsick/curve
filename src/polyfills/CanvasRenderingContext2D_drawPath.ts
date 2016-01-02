interface CanvasRenderingContext2D {
    drawPath(path: gfx.IPath);
}

namespace gfx {
    var proto: CanvasRenderingContext2D = CanvasRenderingContext2D.prototype;
    if (typeof proto.drawPath !== "function") {
        proto.drawPath = function (path: IPath) {
            this.beginPath();
            path.draw(this);
        };
    }
}