namespace curve {
    var proto: CanvasRenderingContext2D = CanvasRenderingContext2D.prototype;
    if (!proto.setFillRule) {
        proto.setFillRule = function (arg: FillRule) {
            this.fillRule = arg;
        };
    }
}