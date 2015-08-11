interface CanvasRenderingContext2D {
    drawPath(path: Path2D);
}

namespace path2d {
    var proto: CanvasRenderingContext2D = CanvasRenderingContext2D.prototype;
    if (typeof proto.drawPath !== "function") {
        proto.drawPath = function (path: Path2D) {
            this.beginPath();
            for (var i = 0, ops = (<any>path).$ops, len = ops.length; i < len; i++) {
                let op = ops[i];
                let name: string = PathOpType[op.type];
                let func = CanvasRenderingContext2D.prototype[name];
                if (!func)
                    throw new Error(`Invalid path operation type. [${op.type}]`);
                func.apply(this, op.args);
            }
        };
    }
}